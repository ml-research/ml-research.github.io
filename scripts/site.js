(function (window, document) {
  'use strict';

  const siteContent = window.AIML_SITE_CONTENT || {};
  const newsSource = Array.isArray(window.AIML_NEWS)
    ? window.AIML_NEWS
    : (siteContent.newsHighlights || []);
  const embeddedPublications = Array.isArray(window.AIML_PUBLICATIONS)
    ? window.AIML_PUBLICATIONS
    : [];
  const publicationImageBase = document.body?.dataset?.publicationImageBase || './images/';
  const FALLBACK_PUBLICATION_IMAGE = 'aiml2020small.png';
  const PUBLICATION_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

  const topicClusters = {
    'trustworthy-ai': ['robust', 'trust', 'safety', 'explain', 'fair', 'alignment', 'responsible', 'reliability'],
    'generative-models': ['generative', 'diffusion', 'flow', 'vae', 'gan', 'synthesis'],
    'neuro-symbolic': ['symbolic', 'logic', 'reasoning', 'knowledge', 'relational', 'neuro-symbolic'],
    'interactive-ai': ['human', 'interactive', 'user', 'collaborative', 'robot', 'multi-agent', 'interface'],
    'probabilistic-ai': ['probabilistic', 'bayesian', 'graphical', 'uncertainty', 'inference']
  };

  const selectors = {
    heroStats: '[data-render="heroStats"]',
    focusAreas: '[data-render="focusAreas"]',
    newsHighlights: '[data-render="newsHighlights"]',
    teaching: '[data-render="currentTeaching"]',
    heroPhotoWrapper: '[data-component="heroPhoto"]',
    heroPhotoToggle: '[data-action="toggleHeroPhoto"]',
    peopleGrid: '#people-grid',
    publicationList: '#publicationList',
    publicationSummary: '[data-render="pubCount"]',
    publicationLoadMore: '#pubLoadMore',
    publicationSearch: '[data-filter="search"]',
    publicationYear: '[data-filter="year"]',
    publicationType: '[data-filter="type"]',
    footerYear: '#current-year'
  };

  const Utils = {
    normalize(value = '') {
      return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    toNewsTimestamp(value = '') {
      if (!value) return 0;
      const parsed = new Date(value);
      const timestamp = parsed.getTime();
      if (!Number.isNaN(timestamp)) return timestamp;
      const fallback = String(value).match(/(\d{4})/);
      return fallback ? new Date(Number(fallback[1]), 0, 1).getTime() : 0;
    },
    sortNews(items = []) {
      return [...items].sort((a, b) => Utils.toNewsTimestamp(b?.date) - Utils.toNewsTimestamp(a?.date));
    },
    createElement(tag, options = {}) {
      const element = document.createElement(tag);
      if (options.className) element.className = options.className;
      if (options.text) element.textContent = options.text;
      if (options.html) element.innerHTML = options.html;
      if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            element.setAttribute(key, value);
          }
        });
      }
      return element;
    }
  };

  const resolvePublicationImagePath = (value = '') => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//')) {
      return value;
    }
    if (value.startsWith('/')) {
      return value;
    }
    if (value.startsWith('../')) {
      return value;
    }
    if (value.startsWith('./')) {
      const stripped = value.slice(2);
      if (!stripped) return value;
      if (stripped.startsWith('images/')) {
        return `${publicationImageBase}${stripped.replace(/^images\//, '')}`;
      }
      return `${publicationImageBase}${stripped}`;
    }
    return `${publicationImageBase}${value}`;
  };

  const PublicationImages = {
    buildCandidates(publication = {}) {
      const explicit = typeof publication.image === 'string' && publication.image.trim().length
        ? publication.image.trim()
        : '';
      if (explicit) {
        if (explicit.startsWith('http://') || explicit.startsWith('https://') || explicit.startsWith('//') || explicit.startsWith('/')) {
          return Array.from(new Set([
            explicit,
            resolvePublicationImagePath(FALLBACK_PUBLICATION_IMAGE)
          ]));
        }
        if (/\.(png|jpe?g|webp|svg)$/i.test(explicit)) {
          const resolved = resolvePublicationImagePath(explicit);
          return Array.from(new Set([
            resolved,
            resolvePublicationImagePath(FALLBACK_PUBLICATION_IMAGE)
          ]));
        }
      }

      const slugSource = explicit || publication.cite || '';
      if (!slugSource) {
        return [resolvePublicationImagePath(FALLBACK_PUBLICATION_IMAGE)];
      }

      if (slugSource.startsWith('http://') || slugSource.startsWith('https://') || slugSource.startsWith('//') || slugSource.startsWith('/')) {
        return Array.from(new Set([
          slugSource,
          resolvePublicationImagePath(FALLBACK_PUBLICATION_IMAGE)
        ]));
      }

      const candidates = PUBLICATION_IMAGE_EXTENSIONS.map((extension) => resolvePublicationImagePath(`${slugSource}${extension}`));
      candidates.push(resolvePublicationImagePath(FALLBACK_PUBLICATION_IMAGE));
      return Array.from(new Set(candidates));
    },

    createFigure(publication = {}) {
      const candidates = this.buildCandidates(publication);
      if (!candidates.length) return null;

      const figure = Utils.createElement('div', { className: 'publication-card-figure' });
      const image = Utils.createElement('img', {
        attrs: {
          src: candidates.shift(),
          alt: publication.title ? `${publication.title} illustration` : 'Publication illustration',
          loading: 'lazy'
        }
      });

      const handleError = () => {
        if (!candidates.length) {
          image.removeEventListener('error', handleError);
          figure.remove();
          return;
        }
        const next = candidates.shift();
        if (next) {
          image.src = next;
        } else {
          image.removeEventListener('error', handleError);
          figure.remove();
        }
      };

      image.addEventListener('error', handleError);
      figure.append(image);
      return figure;
    }
  };

  const HeroModule = {
    render(stats = []) {
      const container = document.querySelector(selectors.heroStats);
      if (!container) return;
      container.innerHTML = '';
      if (!stats.length) {
        container.classList.add('d-none');
        return;
      }

      const list = Utils.createElement('ul', {
        className: 'hero-stat-list list-unstyled d-flex flex-wrap gap-3'
      });

      stats.forEach((stat) => {
        const item = Utils.createElement('li', { className: 'hero-stat' });
        if (stat.icon) {
          item.append(Utils.createElement('span', {
            className: 'hero-stat-icon',
            text: stat.icon
          }));
        }
        item.append(
          Utils.createElement('span', {
            className: 'hero-stat-value',
            text: stat.value || ''
          }),
          Utils.createElement('span', {
            className: 'hero-stat-label',
            text: stat.label || ''
          })
        );
        list.append(item);
      });

      container.append(list);
    }
  };

  const FocusModule = {
    render(areas = []) {
      const container = document.querySelector(selectors.focusAreas);
      if (!container) return;
      container.innerHTML = '';

      areas.forEach((area) => {
        const col = Utils.createElement('div', {
          className: area.colClass || 'col-md-6 col-xl-4'
        });
        const card = Utils.createElement(area.link ? 'a' : 'article', {
          className: 'research-card h-100'
        });

        if (area.link) {
          card.href = area.link;
          card.classList.add('text-decoration-none', 'text-reset');
          card.setAttribute('aria-label', area.title || 'Research theme');
        }

        const imageWrapper = Utils.createElement('div', { className: 'research-figure' });
        const image = Utils.createElement('img', {
          attrs: {
            src: area.image || '',
            alt: area.title || '',
            loading: 'lazy'
          }
        });
        imageWrapper.append(image);

        const body = Utils.createElement('div', { className: 'research-body' });
        body.append(
          Utils.createElement('h3', { text: area.title || '' }),
          Utils.createElement('p', { text: area.description || '' })
        );

        card.append(imageWrapper, body);
        col.append(card);
        container.append(col);
      });
    }
  };

  const NewsModule = {
    createEntry(item = {}) {
      const entry = Utils.createElement('li', { className: 'news-item' });

      const header = Utils.createElement('div', { className: 'news-item-header' });
      header.append(
        Utils.createElement('time', {
          className: 'news-item-date',
          text: item.date || ''
        }),
        Utils.createElement('h3', {
          className: 'h5 news-item-title',
          text: item.title || ''
        })
      );
      entry.append(header);

      entry.append(
        Utils.createElement('div', {
          className: 'news-item-body',
          html: item.summary || item.body || ''
        })
      );

      if (item.details && item.details.trim().length) {
        const details = Utils.createElement('div', {
          className: 'news-item-details',
          html: item.details
        });
        const toggle = Utils.createElement('button', {
          className: 'news-item-toggle mt-2',
          text: 'Show details',
          attrs: { type: 'button', 'aria-expanded': 'false' }
        });
        toggle.addEventListener('click', () => {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!expanded));
          toggle.textContent = expanded ? 'Show details' : 'Hide details';
          details.classList.toggle('show', !expanded);
        });
        entry.append(toggle, details);
      }

      return entry;
    },

    renderHighlights(newsItems = []) {
      const container = document.querySelector(selectors.newsHighlights);
      if (!container) return;
      container.innerHTML = '';

      const highlights = Utils.sortNews(newsItems).slice(0, 3);
      if (!highlights.length) {
        container.innerHTML = '<p class="text-muted">No news items available at the moment.</p>';
        return;
      }

      const list = Utils.createElement('ul', { className: 'news-list list-unstyled' });
      highlights.forEach((item) => list.append(NewsModule.createEntry(item)));
      container.append(list);

      const archiveCta = Utils.createElement('div', { className: 'news-archive-cta mt-4' });
      const archiveLink = Utils.createElement('a', {
        className: 'btn btn-outline-primary',
        text: 'Browse full archive',
        attrs: {
          href: './news/index.html',
          'aria-label': 'Browse the full AIML Lab news archive'
        }
      });
      archiveCta.append(archiveLink);
      container.append(archiveCta);
    }
  };

  const PeopleModule = {
    defaultImage: './images/group_picture_june23.jpg',

    createCard(person = {}, options = {}) {
      const disableLinks = Boolean(options.disableLinks);
      const link = disableLinks ? '' : (person.link || (person.id ? `./people/${person.id}/index.html` : ''));
      const element = Utils.createElement(link ? 'a' : 'article', {
        className: 'people-card'
      });

      if (link) {
        element.href = link;
        element.classList.add('text-reset');
        element.setAttribute('aria-label', person.name ? `${person.name} profile` : 'AIML Lab member');
      }

      const avatar = Utils.createElement('figure', { className: 'people-card-avatar' });
      avatar.append(Utils.createElement('img', {
        attrs: {
          src: person.image || (person.id ? `./people/${person.id}/profile-thumbnail.jpg` : PeopleModule.defaultImage),
          alt: person.name || 'AIML Lab member',
          loading: 'lazy'
        }
      }));

      const content = Utils.createElement('div', { className: 'people-card-content' });
      content.append(Utils.createElement('h3', {
        className: 'people-card-name h5 mb-0',
        text: person.name || ''
      }));

      const roleText = person.role || person.what || '';
      if (roleText) {
        content.append(Utils.createElement('div', {
          className: 'people-card-role',
          text: roleText
        }));
      }

      const focusText = person.focus && person.focus !== roleText ? person.focus : '';
      if (focusText) {
        content.append(Utils.createElement('p', {
          className: 'people-card-focus',
          text: focusText
        }));
      }

      element.append(avatar, content);
      return element;
    },

    render(sections = []) {
      const container = document.querySelector(selectors.peopleGrid);
      if (!container) return;
      container.innerHTML = '';

      if (!Array.isArray(sections) || !sections.length) {
        container.innerHTML = '<p class="text-secondary">Our people directory is being updated.</p>';
        return;
      }

      const wrapper = Utils.createElement('div', { className: 'people-sections' });

      sections.forEach((section, index) => {
        const sectionEl = Utils.createElement('section', { className: 'people-section' });
        const sectionId = `people-section-${section.id || index}`;
        const isExpanded = section.defaultVisible === true || (section.defaultVisible !== false && index === 0);

        const toggle = Utils.createElement('button', {
          className: 'people-section-toggle',
          attrs: {
            type: 'button',
            'aria-controls': sectionId,
            'aria-expanded': String(isExpanded)
          }
        });

        const title = Utils.createElement('span', {
          className: 'people-section-title',
          text: section.title || 'Team'
        });

        const meta = Utils.createElement('span', { className: 'people-section-meta' });
        const countValue = Array.isArray(section.people) ? section.people.length : 0;
        if (countValue) {
          meta.append(Utils.createElement('span', {
            className: 'people-section-count',
            text: countValue
          }));
        }
        meta.append(Utils.createElement('span', {
          className: 'people-section-toggle-icon',
          attrs: { 'aria-hidden': 'true' }
        }));

        toggle.append(title, meta);

        const body = Utils.createElement('div', {
          className: 'people-section-body',
          attrs: { id: sectionId }
        });
        if (!isExpanded) body.hidden = true;

        if (section.description) {
          body.append(Utils.createElement('p', {
            className: 'people-section-description text-secondary',
            text: section.description
          }));
        }

        const peopleList = Array.isArray(section.people) ? section.people : [];
        if (peopleList.length) {
          const grid = Utils.createElement('div', { className: 'people-card-grid' });
          const disableLinks = section.id === 'alumni';
          peopleList.forEach((person) => grid.append(PeopleModule.createCard(person, { disableLinks })));
          body.append(grid);
        } else {
          body.append(Utils.createElement('p', {
            className: 'text-secondary mb-0',
            text: 'Profiles will be added soon.'
          }));
        }

        sectionEl.append(toggle, body);
        sectionEl.classList.toggle('is-open', isExpanded);

        toggle.addEventListener('click', () => {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!expanded));
          body.hidden = expanded;
          sectionEl.classList.toggle('is-open', !expanded);
        });

        wrapper.append(sectionEl);
      });

      container.append(wrapper);
    }
  };

  const TeachingModule = {
    render(courses = []) {
      const container = document.querySelector(selectors.teaching);
      if (!container) return;
      container.innerHTML = '';

      if (!courses.length) {
        container.innerHTML = '<p class="text-secondary">Current semester offerings will be announced soon.</p>';
        return;
      }

      const list = Utils.createElement('div', { className: 'teaching-card-grid' });

      courses.forEach((course) => {
        const isLinkable = Boolean(course.link);
        const card = Utils.createElement(isLinkable ? 'a' : 'article', {
          className: 'teaching-card card border-0 shadow-sm'
        });

        if (isLinkable) {
          card.href = course.link;
          card.target = '_blank';
          card.rel = 'noopener';
        }

        const body = Utils.createElement('div', {
          className: 'card-body d-flex flex-column gap-3'
        });

        if (course.term || course.abbreviation) {
          const topRow = Utils.createElement('div', { className: 'teaching-card-top' });
          if (course.term) {
            topRow.append(Utils.createElement('span', {
              className: 'teaching-term-badge',
              text: course.term
            }));
          }
          if (course.abbreviation) {
            topRow.append(Utils.createElement('span', {
              className: 'teaching-code-chip',
              text: course.abbreviation
            }));
          }
          body.append(topRow);
        }

        body.append(Utils.createElement('h3', {
          className: 'h5 mb-0',
          text: course.title || ''
        }));

        const details = [];
        if (course.format) details.push(course.format);
        if (course.credits) details.push(course.credits);
        if (details.length) {
          body.append(Utils.createElement('div', {
            className: 'teaching-meta text-muted small',
            text: details.join(' · ')
          }));
        }

        if (course.description) {
          body.append(Utils.createElement('p', {
            className: 'text-secondary mb-0',
            text: course.description
          }));
        }

        if (course.recommended) {
          body.append(Utils.createElement('div', {
            className: 'teaching-note text-secondary small',
            text: course.recommended
          }));
        }

        if (course.language || course.lastTaught) {
          body.append(Utils.createElement('div', {
            className: 'text-muted small',
            text: [course.language, course.lastTaught].filter(Boolean).join(' · ')
          }));
        }

        if (course.responsible && course.responsible.length) {
          body.append(Utils.createElement('div', {
            className: 'text-muted small',
            text: `Responsible: ${course.responsible.join(', ')}`
          }));
        }

        if (isLinkable) {
          const cta = Utils.createElement('span', {
            className: 'teaching-card-cta',
            text: 'Open course'
          });
          cta.append(Utils.createElement('span', {
            className: 'teaching-card-cta-icon',
            text: '→',
            attrs: { 'aria-hidden': 'true' }
          }));
          body.append(cta);
        }

        card.append(body);
        list.append(card);
      });

      container.append(list);
    }
  };

  const PublicationsModule = (function createPublicationsModule() {
    const state = {
      all: [],
      filtered: [],
      visible: 0,
      batch: 8,
      notice: '',
      filters: {
        search: '',
        year: 'all',
        type: 'all'
      }
    };

    const elements = {
      list: document.querySelector(selectors.publicationList),
      summary: document.querySelector(selectors.publicationSummary),
      loadMore: document.querySelector(selectors.publicationLoadMore),
      search: document.querySelector(selectors.publicationSearch),
      year: document.querySelector(selectors.publicationYear),
      type: document.querySelector(selectors.publicationType)
    };

    function formatAuthors(authors = []) {
      if (!Array.isArray(authors) || !authors.length) return '';
      const limit = 10;
      return authors.length <= limit
        ? authors.join(', ')
        : `${authors.slice(0, limit).join(', ')}, et al.`;
    }

    function createCard(publication = {}) {
      const hasLink = Boolean(publication.url);
      const card = Utils.createElement(hasLink ? 'a' : 'article', {
        className: 'publication-card'
      });

      if (hasLink) {
        card.href = publication.url;
        card.target = '_blank';
        card.rel = 'noopener';
      }

      const figure = PublicationImages.createFigure(publication);
      if (figure) {
        card.append(figure);
      }

      const meta = Utils.createElement('div', { className: 'publication-card-meta' });
      if (publication.yearDisplay || publication.year) {
        meta.append(Utils.createElement('span', {
          className: 'publication-card-badge publication-card-badge-year',
          text: publication.yearDisplay || publication.year
        }));
      }
      if (publication.typeLabel) {
        meta.append(Utils.createElement('span', {
          className: 'publication-card-badge',
          text: publication.typeLabel
        }));
      }
      if (meta.childNodes.length) card.append(meta);

      card.append(Utils.createElement('h3', {
        className: 'publication-card-title h5',
        text: publication.title || 'Untitled publication'
      }));

      const authors = formatAuthors(publication.authors);
      if (authors) {
        card.append(Utils.createElement('p', {
          className: 'publication-card-authors',
          text: authors
        }));
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
        card.append(Utils.createElement('p', {
          className: 'publication-card-venue',
          text: venue
        }));
      }

      const topics = Array.isArray(publication.topics) ? publication.topics.filter(Boolean) : [];
      if (topics.length) {
        const topicWrap = Utils.createElement('div', { className: 'publication-card-topics' });
        topics.slice(0, 3).forEach((topic) => {
          topicWrap.append(Utils.createElement('span', {
            className: 'publication-card-topic',
            text: topic
          }));
        });
        card.append(topicWrap);
      }

      const noteText = (publication.note || '').trim();
      if (noteText) {
        const noteWrap = document.createElement('p');
        noteWrap.className = 'publication-card-note';

        const label = document.createElement('span');
        label.className = 'publication-card-note-label';
        label.textContent = 'Abstract: ';
        noteWrap.appendChild(label);

        const words = noteText.split(/\s+/).filter(Boolean);
        const hasMore = words.length > 5;
        const previewText = hasMore ? `${words.slice(0, 5).join(' ')}…` : noteText;

        const preview = document.createElement('span');
        preview.className = 'publication-card-note-preview';
        preview.textContent = previewText;
        noteWrap.appendChild(preview);

        if (hasMore) {
          const full = document.createElement('span');
          full.className = 'publication-card-note-full';
          full.textContent = noteText;
          full.hidden = true;
          noteWrap.appendChild(full);

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
          noteWrap.appendChild(toggle);
        }

        card.append(noteWrap);
      }

      if (hasLink) {
        const cta = Utils.createElement('span', {
          className: 'publication-card-cta',
          text: 'Open publication'
        });
        cta.append(Utils.createElement('span', {
          className: 'publication-card-icon',
          text: '→',
          attrs: { 'aria-hidden': 'true' }
        }));
        card.append(cta);
      }

      return card;
    }

    function renderList() {
      const { list, summary, loadMore } = elements;
      if (!list || !loadMore) return;

      const total = state.filtered.length;
      const visible = state.visible;
      const notice = state.notice ? ` · ${state.notice}` : '';

      if (!total) {
        if (summary) {
          summary.textContent = `No publications match your filters yet${notice}`;
        }
        list.innerHTML = '<p class="text-secondary">Try adjusting your filters to explore more publications.</p>';
        loadMore.hidden = true;
        return;
      }

      if (summary) {
        summary.textContent = `Showing ${visible} of ${total} publications${notice}`;
      }
      list.innerHTML = '';

      const fragment = document.createDocumentFragment();
      state.filtered.slice(0, visible).forEach((publication) => {
        fragment.append(createCard(publication));
      });
      list.append(fragment);

      loadMore.hidden = visible >= total;
    }

    function applyFilters() {
      const searchTerm = Utils.normalize(state.filters.search);

      state.filtered = state.all.filter((publication) => {
        const searchable = [
          publication.title,
          publication.booktitle,
          publication.journal,
          publication.howpublished,
          publication.publisher,
          publication.institution,
          publication.organization,
          publication.school,
          publication.series,
          publication.note,
          ...(publication.authors || []),
          ...(publication.topics || [])
        ]
          .filter(Boolean)
          .map((value) => Utils.normalize(value))
          .join(' ');
        const matchesSearch = !searchTerm || searchable.includes(searchTerm);

        const matchesYear = state.filters.year === 'all'
          || (publication.yearDisplay || publication.year || '') === state.filters.year;

        const matchesType = state.filters.type === 'all'
          || (publication.typeLabel || '').toLowerCase() === state.filters.type;

        return matchesSearch && matchesYear && matchesType;
      });

      state.visible = Math.min(state.batch, state.filtered.length);
      renderList();
    }

    function populateFilters() {
      const years = Array.from(new Set(state.all.map((pub) => pub.yearDisplay || pub.year)))
        .filter(Boolean)
        .sort((a, b) => Number(b) - Number(a));
      const types = Array.from(new Set(state.all
        .map((pub) => (pub.typeLabel || '').toLowerCase())
        .filter(Boolean)));

      const addOptions = (select, values, transform = (v) => v) => {
        if (!select) return;
        select.innerHTML = '<option value="all">All</option>';
        values.forEach((value) => {
          select.append(Utils.createElement('option', {
            text: transform(value),
            attrs: { value }
          }));
        });
      };

      addOptions(elements.year, years);
      addOptions(elements.type, types, (value) => value.replace(/\b\w/g, (c) => c.toUpperCase()));
    }

    function attachEvents() {
      if (elements.search) {
        elements.search.addEventListener('input', (event) => {
          state.filters.search = event.target.value || '';
          applyFilters();
        });
      }

      if (elements.year) {
        elements.year.addEventListener('change', (event) => {
          state.filters.year = event.target.value || 'all';
          applyFilters();
        });
      }

      if (elements.type) {
        elements.type.addEventListener('change', (event) => {
          state.filters.type = (event.target.value || 'all').toLowerCase();
          applyFilters();
        });
      }

      if (elements.loadMore) {
        elements.loadMore.addEventListener('click', () => {
          state.visible = Math.min(state.visible + state.batch, state.filtered.length);
          renderList();
        });
      }
    }

    function setPublications(items = [], notice = '') {
      state.all = (Array.isArray(items) ? items : []).map((publication) => {
        if (publication.topicCluster) return publication;
        const text = [
          (publication.topicsNormalized || []).join(' '),
          publication.title || ''
        ].join(' ').toLowerCase();
        const derived = Object.entries(topicClusters).find(([, keywords]) =>
          keywords.some((keyword) => text.includes(keyword))
        );
        return {
          ...publication,
          topicCluster: derived ? derived[0] : 'uncategorized'
        };
      });
      state.notice = notice;
      populateFilters();
      applyFilters();
    }

    function getEmbeddedPublications() {
      return embeddedPublications;
    }

    function load() {
      if (!elements.list) return;

      const embedded = getEmbeddedPublications();

      if (window.location.protocol === 'file:' && embedded.length) {
        setPublications(embedded, 'Offline preview (embedded data)');
        return;
      }

      fetch('./build/publications.json')
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            setPublications(data);
            return;
          }
          if (embedded.length) {
            setPublications(embedded, 'Showing embedded publications');
            return;
          }
          throw new Error('No publications found');
        })
        .catch(() => {
          if (embedded.length) {
            setPublications(embedded, 'Offline preview (embedded data)');
            return;
          }
          state.all = [];
          state.filtered = [];
          state.notice = 'Publications unavailable.';
          if (elements.summary) {
            elements.summary.textContent = 'Publications unavailable.';
          }
          if (elements.list) {
            elements.list.innerHTML = '<p class="text-secondary">Unable to load publications.</p>';
          }
        });
    }

    function init() {
      attachEvents();
      load();
    }

    return { init };
  })();

  const HeroPhotoModule = {
    init() {
      const wrapper = document.querySelector(selectors.heroPhotoWrapper);
      const toggle = document.querySelector(selectors.heroPhotoToggle);
      if (!wrapper || !toggle) return;

      const setExpanded = (expanded) => {
        if (expanded) {
          wrapper.classList.add('is-expanded');
        } else {
          wrapper.classList.remove('is-expanded');
        }
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      };

      toggle.addEventListener('click', () => {
        const expanded = !wrapper.classList.contains('is-expanded');
        setExpanded(expanded);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && wrapper.classList.contains('is-expanded')) {
          setExpanded(false);
          toggle.focus({ preventScroll: true });
        }
      });
    }
  };

  const FooterModule = {
    updateYear() {
      const target = document.querySelector(selectors.footerYear);
      if (!target) return;
      target.textContent = new Date().getFullYear();
    }
  };

  function boot() {
    HeroModule.render(siteContent.heroStats || []);
    FocusModule.render(siteContent.focusAreas || []);
    NewsModule.renderHighlights(newsSource);
    PeopleModule.render(siteContent.peopleSections || []);
    TeachingModule.render(siteContent.currentTeaching || []);
    PublicationsModule.init();
    HeroPhotoModule.init();
    FooterModule.updateYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window, document);
