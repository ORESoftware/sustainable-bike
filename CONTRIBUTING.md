# Contributing

1. Change `config/bike.json` first when altering product geometry or constraints.
2. Run `npm run generate`, `npm test`, and `npm run validate`.
3. Keep the scale-model-only status unless a documented, independently reviewed safety release changes it.
4. Do not add secrets, API tokens, personal credentials, battery unlock codes, or signing keys.
5. Use feature branches and merge commits for integration; avoid rebasing shared branches.
6. Include before/after derived metrics and rendered evidence in pull requests.
7. Safety-critical changes require a hazard analysis update and a physical test plan, not only a prettier render.
