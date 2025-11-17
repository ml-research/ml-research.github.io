(() => {
  const containers = document.querySelectorAll('[data-profile-publications]');
  if (!containers.length) return;

  const DEFAULT_JSON_SOURCE = '../../build/publications.json';
  const DEFAULT_IMAGE_BASE = '../../';
  const DEFAULT_EMBED_SOURCE = '../../build/publications-data.js';
  const containerStates = new WeakMap();
  let cachedPublications = null;
  let publicationsPromise = null;
  let embeddedDataPromise = null;

  const normalize = (value = '') => value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace("*","")  // remove asterisks for multi-author highlighting; TODO: Add more possible markers for multi-author highlights
    .trim();

  const authorMatches = (author, term) => {
    if (!author || !term) return false;
    if (author === term) return true;
    const tokens = author.split(/[^a-z0-9]+/).filter(Boolean);
    return tokens.includes(term);
  };

  const parseList = (value = '') => {
    if (!value) return [];
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((entry) => entry.toString().trim()).filter(Boolean);
        }
      } catch (error) {
        // fall through to delimiter parsing
      }
    }
    return trimmed.split(/[,;]/).map((entry) => entry.trim()).filter(Boolean);
  };

  const getDefaultAuthors = () => {
    const heading = document.querySelector('#htname');
    if (!heading) return [];
    const parts = (heading.textContent || '').trim().split(/\s+/);
    if (!parts.length) return [];
    return [parts[parts.length - 1]];
  };

  const resolveAssetPath = (src = '', base = DEFAULT_IMAGE_BASE) => {
    if (!src) return '';
    if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('/')) {
      return src;
    }
    const sanitizedBase = base.endsWith('/') ? base : `${base}/`;
    if (src.startsWith('./')) {
      return `${sanitizedBase}${src.slice(2)}`;
    }
    return `${sanitizedBase}${src.replace(/^\/+/,'')}`;
  };

  const createToolbar = (config) => {
    const toolbar = document.createElement('div');
    toolbar.className = 'profile-publications-toolbar';

    const grid = document.createElement('div');
    grid.className = 'publication-filter-grid';
    toolbar.appendChild(grid);

    const controls = {};

    if (config.enableSearch) {
      const searchFilter = document.createElement('div');
      searchFilter.className = 'publication-filter';

      const searchLabel = document.createElement('label');
      searchLabel.className = 'form-label';
      searchLabel.textContent = 'Search publications';

      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.className = 'form-control publication-input';
      searchInput.placeholder = 'Search by title, author, venue or keyword';
      searchInput.setAttribute('aria-label', 'Search publications');

      searchFilter.append(searchLabel, searchInput);
      grid.appendChild(searchFilter);
      controls.searchInput = searchInput;
    }

    const yearFilter = document.createElement('div');
    yearFilter.className = 'publication-filter';
    const yearLabel = document.createElement('label');
    yearLabel.className = 'form-label';
    yearLabel.textContent = 'Year';
    const yearSelect = document.createElement('select');
    yearSelect.className = 'form-select publication-input';
    yearSelect.setAttribute('aria-label', 'Filter publications by year');
    yearFilter.append(yearLabel, yearSelect);
    grid.appendChild(yearFilter);
    controls.yearSelect = yearSelect;

    const typeFilter = document.createElement('div');
    typeFilter.className = 'publication-filter';
    const typeLabel = document.createElement('label');
    typeLabel.className = 'form-label';
    typeLabel.textContent = 'Type';
    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-select publication-input';
    typeSelect.setAttribute('aria-label', 'Filter publications by type');
    typeFilter.append(typeLabel, typeSelect);
    grid.appendChild(typeFilter);
    controls.typeSelect = typeSelect;

    controls.toolbar = toolbar;
    return controls;
  };

  const ensureStructure = (container, config) => {
    container.classList.add('profile-publications-table--enhanced');
    container.innerHTML = '';
    const elements = {};

    const toolbarControls = createToolbar(config);
    container.appendChild(toolbarControls.toolbar);
    elements.toolbar = toolbarControls.toolbar;
    elements.searchInput = toolbarControls.searchInput || null;
    elements.yearSelect = toolbarControls.yearSelect;
    elements.typeSelect = toolbarControls.typeSelect;

    const summary = document.createElement('p');
    summary.className = 'profile-publications-summary text-muted small';
    container.appendChild(summary);
    elements.summary = summary;

    const list = document.createElement('div');
    list.className = 'profile-publications-list';
    container.appendChild(list);
    elements.list = list;

    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<p class="text-muted small mb-0">Enable JavaScript to view publications.</p>';
    container.appendChild(noscript);

    return elements;
  };


  const loadEmbeddedData = (path = DEFAULT_EMBED_SOURCE) => {
    if (cachedPublications) {
      return Promise.resolve(cachedPublications);
    }
    if (Array.isArray(window.AIML_PUBLICATIONS) && window.AIML_PUBLICATIONS.length) {
      cachedPublications = window.AIML_PUBLICATIONS;
      return Promise.resolve(cachedPublications);
    }
    if (embeddedDataPromise) return embeddedDataPromise;

    embeddedDataPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path || DEFAULT_EMBED_SOURCE;
      script.async = true;
      script.onload = () => {
        if (Array.isArray(window.AIML_PUBLICATIONS) && window.AIML_PUBLICATIONS.length) {
          cachedPublications = window.AIML_PUBLICATIONS;
          resolve(cachedPublications);
        } else {
          reject(new Error('Embedded publications unavailable'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load embedded publications'));
      document.head.appendChild(script);
    });

    return embeddedDataPromise;
  };

  const loadPublications = (jsonSource, embedSource) => {
    if (cachedPublications) {
      return Promise.resolve(cachedPublications);
    }
    if (Array.isArray(window.AIML_PUBLICATIONS) && window.AIML_PUBLICATIONS.length) {
      cachedPublications = window.AIML_PUBLICATIONS;
      return Promise.resolve(cachedPublications);
    }
    if (publicationsPromise) return publicationsPromise;

    const jsonPath = jsonSource || DEFAULT_JSON_SOURCE;
    const embeddedPath = embedSource || DEFAULT_EMBED_SOURCE;
    const fallback = () => loadEmbeddedData(embeddedPath);

    if (window.location.protocol === 'file:' || typeof window.fetch !== 'function') {
      publicationsPromise = fallback();
      return publicationsPromise;
    }

    publicationsPromise = fetch(jsonPath, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load publications');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected publications payload');
        cachedPublications = data;
        return cachedPublications;
      })
      .catch(() => fallback());

    return publicationsPromise;
  };

  const createCard = (publication = {}, config = {}) => {
    const link = publication.url;
    const card = document.createElement(link ? 'a' : 'article');
    card.className = 'publication-card profile-publication-card';
    if (link) {
      card.href = link;
      card.target = '_blank';
      card.rel = 'noopener';
    }

    const imageSrc = resolveAssetPath(publication.image, config.imageBase);
    if (imageSrc) {
      const figure = document.createElement('div');
      figure.className = 'publication-card-figure';
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = publication.title || 'Publication artwork';
      img.loading = 'lazy';
      figure.appendChild(img);
      card.appendChild(figure);
    }

    const content = document.createElement('div');
    content.className = 'publication-card-content';
    card.appendChild(content);

    if (publication.title) {
      const title = document.createElement('h3');
      title.className = 'publication-card-title h5';
      title.textContent = publication.title;
      content.appendChild(title);
    }

    const authors = Array.isArray(publication.authors) ? publication.authors.join(', ') : '';
    if (authors) {
      const authorEl = document.createElement('p');
      authorEl.className = 'publication-card-authors';
      authorEl.textContent = authors;
      content.appendChild(authorEl);
    }

    const venue = publication.booktitle
      || publication.journal
      || publication.howpublished
      || publication.publisher
      || publication.institution
      || publication.organization
      || publication.school
      || publication.series
      || '';
    if (venue) {
      const venueEl = document.createElement('p');
      venueEl.className = 'publication-card-venue';
      venueEl.textContent = venue;
      content.appendChild(venueEl);
    }

    if (Array.isArray(publication.topics) && publication.topics.length) {
      const topics = document.createElement('p');
      topics.className = 'publication-card-topics';
      topics.textContent = publication.topics.slice(0, 3).join(', ');
      content.appendChild(topics);
    }

    const noteText = (publication.note || '').trim();
    if (noteText) {
      const noteEl = document.createElement('p');
      noteEl.className = 'publication-card-note';
      const label = document.createElement('span');
      label.className = 'publication-card-note-label';
      label.textContent = 'Abstract: ';
      noteEl.appendChild(label);

      const previewLimit = 120; // approx. 80% longer than previous character count
      const previewText = noteText.slice(0, previewLimit).trim();
      const hasMore = noteText.length > previewLimit;

      const preview = document.createElement('span');
      preview.className = 'publication-card-note-preview';
      preview.textContent = hasMore ? `${previewText}…` : previewText;
      noteEl.appendChild(preview);

      if (hasMore) {
        const full = document.createElement('span');
        full.className = 'publication-card-note-full';
        full.textContent = noteText;
        full.hidden = true;
        noteEl.appendChild(full);

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'publication-card-note-toggle';
        toggle.textContent = 'Show Abstract';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          const nextState = !expanded;
          toggle.setAttribute('aria-expanded', String(nextState));
          preview.hidden = nextState;
          full.hidden = !nextState;
          toggle.textContent = nextState ? 'Hide Abstract' : 'Show Abstract';
        });
        noteEl.appendChild(toggle);
      }

      content.appendChild(noteEl);
    }

    const meta = document.createElement('div');
    meta.className = 'publication-card-meta';
    if (publication.year) {
      const badge = document.createElement('span');
      badge.className = 'publication-card-badge publication-card-badge-year';
      badge.textContent = publication.year;
      meta.appendChild(badge);
    }
    if (publication.typeLabel) {
      const type = document.createElement('span');
      type.className = 'publication-card-badge';
      type.textContent = publication.typeLabel;
      meta.appendChild(type);
    }
    if (link) {
      const icon = document.createElement('span');
      icon.className = 'publication-card-icon';
      icon.textContent = '→';
      meta.appendChild(icon);
    }
    if (meta.childNodes.length) {
      content.appendChild(meta);
    }
    return card;
  };

  const filterPublications = (publications, config) => {
    const normalizedAuthors = config.authors.map(normalize);
    const includeCites = config.cites.map((cite) => cite.toLowerCase());
    const excludeCites = config.excludeCites.map((cite) => cite.toLowerCase());
    const keywordTerms = config.keywords.map(normalize);

    return publications.filter((publication) => {
      const cite = (publication.cite || '').toLowerCase();
      if (excludeCites.includes(cite)) return false;

      const citeMatch = includeCites.length ? includeCites.includes(cite) : false;
      let authorMatch = !normalizedAuthors.length;
      if (normalizedAuthors.length) {
        const authors = (publication.authors || []).map(normalize);
        authorMatch = authors.some((author) => normalizedAuthors.some((term) => authorMatches(author, term)));
      }

      let keywordMatch = true;
      if (keywordTerms.length) {
        const haystack = [
          publication.title || '',
          publication.note || '',
          ...(publication.topics || [])
        ].join(' ');
        const normalizedHaystack = normalize(haystack);
        keywordMatch = keywordTerms.some((term) => normalizedHaystack.includes(term));
      }

      if (!citeMatch && !authorMatch) {
        return false;
      }
      return keywordMatch || citeMatch;
    });
  };

  const sortPublications = (publications) => publications.slice().sort((a, b) => {
    const yearA = parseInt(a.year, 10);
    const yearB = parseInt(b.year, 10);
    if (!Number.isNaN(yearA) && !Number.isNaN(yearB) && yearA !== yearB) {
      return yearB - yearA;
    }
    return (a.position || 0) - (b.position || 0);
  });

  const filterBySearchTerm = (publications, term = '') => {
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) return publications;
    return publications.filter((publication) => {
      const haystack = [
        publication.title || '',
        publication.booktitle || '',
        publication.journal || '',
        publication.note || '',
        ...(publication.authors || []),
        ...(publication.topics || [])
      ].join(' ');
      return normalize(haystack).includes(normalizedTerm);
    });
  };

  const renderList = (listEl, publications, config, hasSearchTerm, totalBase) => {
    listEl.innerHTML = '';
    if (!publications.length) {
      const message = hasSearchTerm
        ? 'No publications match your search.'
        : totalBase ? 'No publications available yet.' : 'No publications added yet.';
      listEl.innerHTML = `<p class="profile-publications-empty text-muted mb-0">${message}</p>`;
      return;
    }
    const fragment = document.createDocumentFragment();
    publications.forEach((publication) => fragment.appendChild(createCard(publication, config)));
    listEl.appendChild(fragment);
  };

  const updateSummary = (summaryEl, visible, matched, total, hasSearchTerm) => {
    if (!total) {
      summaryEl.textContent = 'No publications available yet.';
      return;
    }
    if (!matched) {
      summaryEl.textContent = hasSearchTerm
        ? 'No publications match your search.'
        : 'No publications available yet.';
      return;
    }
    summaryEl.textContent = hasSearchTerm
      ? `Showing ${visible} of ${matched} matching publications (from ${total} total)`
      : `Showing ${visible} of ${total} publications`;
  };

  const renderState = (container) => {
    const state = containerStates.get(container);
    if (!state) return;
    const { basePublications, config, elements } = state;
    const hasSearchTerm = Boolean(state.searchTerm && state.searchTerm.trim());
    let filtered = basePublications;

    if (state.filterYear && state.filterYear !== 'all') {
      filtered = filtered.filter((publication) => {
        const year = publication.yearDisplay || publication.year || '';
        return String(year) === state.filterYear;
      });
    }

    if (state.filterType && state.filterType !== 'all') {
      filtered = filtered.filter((publication) => {
        const label = (publication.typeLabel || '').toLowerCase();
        return label === state.filterType;
      });
    }

    const searchFiltered = hasSearchTerm
      ? filterBySearchTerm(filtered, state.searchTerm)
      : filtered;
    const limited = config.limit ? searchFiltered.slice(0, config.limit) : searchFiltered;

    updateSummary(
      elements.summary,
      limited.length,
      searchFiltered.length,
      basePublications.length,
      hasSearchTerm || (state.filterYear && state.filterYear !== 'all') || (state.filterType && state.filterType !== 'all')
    );
    renderList(elements.list, limited, config, hasSearchTerm, basePublications.length);
  };

  const populateFilterOptions = (elements, state) => {
    if (!elements.yearSelect || !elements.typeSelect) return;

    const years = Array.from(new Set(
      state.basePublications
        .map((pub) => pub.yearDisplay || pub.year)
        .filter(Boolean)
    )).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

    const types = Array.from(new Set(
      state.basePublications
        .map((pub) => (pub.typeLabel || '').toLowerCase())
        .filter(Boolean)
    )).sort();

    const setOptions = (select, options, defaultLabel) => {
      select.innerHTML = '';
      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = defaultLabel;
      select.appendChild(allOption);
      options.forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option.replace(/\b\w/g, (c) => c.toUpperCase());
        select.appendChild(opt);
      });
    };

    setOptions(elements.yearSelect, years, 'All years');
    setOptions(elements.typeSelect, types, 'All types');

    elements.yearSelect.value = state.filterYear || 'all';
    elements.typeSelect.value = state.filterType || 'all';
  };

  containers.forEach((container) => {
    const dataset = container.dataset || {};
    const authorConfig = parseList(dataset.profileAuthors);
    const fallbackAuthors = authorConfig.length ? authorConfig : getDefaultAuthors();
    const config = {
      authors: fallbackAuthors,
      cites: parseList(dataset.profileCites).map((cite) => cite.toLowerCase()),
      excludeCites: parseList(dataset.profileExcludeCites).map((cite) => cite.toLowerCase()),
      keywords: parseList(dataset.profileKeywords),
      limit: Number.parseInt(dataset.profileLimit, 10) || null,
      source: dataset.profileSource || null,
      embedSource: dataset.profileDataSource || null,
            imageBase: dataset.profileImageBase || DEFAULT_IMAGE_BASE,
      enableSearch: dataset.profileSearch !== 'false'
    };

    if (!config.authors.length && !config.cites.length) {
      container.innerHTML = '<p class="profile-publications-empty text-muted mb-0">Add data-profile-authors or data-profile-cites attributes to display publications.</p>';
      return;
    }

    container.innerHTML = '<div class="profile-publications-loading text-muted" aria-live="polite">Loading publications…</div>';

    loadPublications(config.source, config.embedSource)
      .then((publications) => {
        const filtered = sortPublications(filterPublications(publications, config));
        const elements = ensureStructure(container, config);
        const state = {
          basePublications: filtered,
          config,
          elements,
          searchTerm: '',
          filterYear: 'all',
          filterType: 'all'
        };
        containerStates.set(container, state);
        populateFilterOptions(elements, state);
        if (elements.searchInput) {
          elements.searchInput.addEventListener('input', (event) => {
            state.searchTerm = event.target.value || '';
            renderState(container);
          });
        }
        if (elements.yearSelect) {
          elements.yearSelect.addEventListener('change', (event) => {
            state.filterYear = event.target.value || 'all';
            renderState(container);
          });
        }
        if (elements.typeSelect) {
          elements.typeSelect.addEventListener('change', (event) => {
            state.filterType = (event.target.value || 'all').toLowerCase();
            renderState(container);
          });
        }
        renderState(container);
      })
      .catch(() => {
        container.innerHTML = '<p class="profile-publications-empty text-muted mb-0">Unable to load publications.</p>';
      });
  });
})();
