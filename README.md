# Side By Side Service Template

## Getting Started

### Install

#### Copy template

- Copy template files

#### Update package.json

```diff
{
-  "name": "sbs-service-template",
+  "name": "test-service",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

## Usage

### Github Packages

In order to use private npm packages, you need to set `.npmrc` using the `.npmrc.template`

see https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token

## What's included

### Prettier

- Extensions: `js,ts,tsx,css,md,json`
- VsCode settings: AutoFormat on save
- Husky: AutoFormat on commit
- Github Action check

### Yarn Workspaces

- Uses yarn workspaces

### Github Actions

- prettier check
- build

### Packages

#### Shared

- typescript
- shared code between environments
