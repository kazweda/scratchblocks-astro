# Development

## Requirements

- Node.js 22.12 or later (required by Astro 7)
- npm

## Setup

```bash
npm install
```

## Tests

```bash
npm test
```

```bash
npm run test:watch
```

## Merge

```bash
gh pr merge <PR_NUMBER> --delete-branch
```

## Release

Publishing to npm is done by hand; there is no workflow for it.

1. In a PR, update `version` in `package.json` (and `package-lock.json` with `npm install`), and move the `Unreleased` entries in [CHANGELOG.md](CHANGELOG.md) under a new version heading with today's date. Update the compare links at the bottom.
2. After the PR is merged, publish from an up-to-date `main`:

   ```bash
   git checkout main && git pull
   npm ci && npm test
   npm publish --dry-run   # check the version and that only LICENSE, README.md, package.json and src/ are included
   npm publish             # needs `npm login`; enter the one-time password if asked
   ```

3. Tag the merge commit and push the tag:

   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

4. Create a GitHub Release with the version's section of CHANGELOG.md as the notes:

   ```bash
   gh release create vX.Y.Z --title vX.Y.Z --notes-file <notes.md>
   ```

Use a major-style bump (0.x → 0.(x+1)) for breaking changes while the version is below 1.0.0, and describe how to migrate in CHANGELOG.md.
