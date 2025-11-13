# Public website of the AIML Lab @ TU Darmstadt

Changes get automatically published at:
- https://www.aiml.informatik.tu-darmstadt.de
- https://ml-research.github.io/

## Updating publications

The publication data that powers the landing page and other sections is generated
from `references.bib`. Whenever this file (or the generator script) changes on
`main`, the `update-publications` GitHub Actions workflow automatically runs
`scripts/generate_publications_json.py`, commits the updated files in `build/`,
and pushes the results back to the repository. You can also run the same script
locally (requires `pip install bibtexparser`) before opening a PR:

```bash
python scripts/generate_publications_json.py
```

Each profile page now renders its publications directly from the shared
`build/publications.json` data via `scripts/profile-publications.js`. Configure
the filter per profile by setting `data-profile-authors` (and optionally
`data-profile-cites`, `data-profile-keywords`, or `data-profile-limit`) on the
`div.profile-publications-table` element.
