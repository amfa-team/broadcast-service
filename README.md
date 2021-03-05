# PicNic SFU

## Getting Started

### Install

#### Copy template

- Copy template files

```bash
> git clone git@github.com:amfa-team/sbs-service-template.git test-service  --depth=0 --branch master
> cd test-service
> rm -rf .git
> git init
> git add .
> git branch -M master
> git remote add origin git@github.com:amfa-team/test-service.git
> git push -u origin master
> git checkout -b develop
> git push -u origin develop
```

#### Update package.json

```diff
{
-  "name": "sbs-service-template",
+  "name": "test-service",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

#### Update packages/react/package.json

```diff
{
-  "name": "@amfa-team/react-service-template",
+  "name": "@amfa-team/test-service",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

#### Update packages/react/release.config.js

```diff
-  repositoryUrl: "https://github.com/amfa-team/sbs-service-template.git",
+  repositoryUrl: "https://github.com/amfa-team/test-service.git",
  plugins: [
```

#### Update packages/example/package.json

```diff
{
  "name": "@amfa-team/example",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

#### Update packages/example/serverless.yml

```diff
-  service: example-template
+  service: test-service
```

```diff
  "dependencies": {
-    "@amfa-team/react-service-template": "^0.1.0",
+    "@amfa-team/test-service": "^0.1.0",
    "@sentry/react": "^5.24.2",
```

#### Update packages/example/src/index.tsx.tsx

```diff
- import "@amfa-team/react-service-template/dist/index.css";
+ import "@amfa-team/test-service/dist/index.css";
```

#### Update packages/example/src/App.tsx

```diff
- import { Hello } from "@amfa-team/react-service-template";
+ import { Hello } from "@amfa-team/test-service";
```

#### Update .eslintrc

```diff
-    "@amfa-team/react-service-template/dist/index.css": [
+    "@amfa-team/test-service/dist/index.css": [
      "./packages/react/src/index.css"
    ],
-    "@amfa-team/react-service-template": ["./packages/react/src"]
+    "@amfa-team/test-service": ["./packages/react/src"]
```

```diff
  custom:
    client:
-      bucketName: "example-template-${opt:stage}"
+      bucketName: "test-service-${opt:stage}"
```

#### Create `packages/api/.env` from `packages/api/.env.example`

- Create Sentry project and set `SENTRY_DNS` env-vars

#### Create `packages/example/.env` from `packages/example/.env.example`

- Create Sentry project and set `SENTRY_DNS` env-vars

#### AWS Profile

- Create AWS profile named `picnic` https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

> You can also use `cd package/api && yarn serverless config credentials --provider aws --key xxxx --secret xxx --profile picnic`

#### Create Secrets

Add following secrets to your repository:

- `SLACK_WEBHOOK_SDK`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SENTRY_API_DNS`
- `SENTRY_EXAMPLE_DNS`
- `API_ENDPOINT_STAGING`: This is generated after first API deployment (you'll need to set `https://sidebyside.live` value for first deploy, then you just need to force trigger again github action). You'll need to set a dummy value for the first deployment. Then you can retrieve it locally using `cd packages/api && yarn deploy:staging:info`
- `API_ENDPOINT_PRODUCTION`: This is generated after first API deployment (you'll need to set `https://sidebyside.live` value for first deploy, then you just need to force trigger again github action). You'll need to set a dummy value for the first deployment. Then you can retrieve it locally using `cd packages/api && yarn deploy:prod:info`

#### Github Repository

- Open your github repository Settings
- Go to Branches
- Set `develop` as default branch

## Usage

### Github Packages

In order to use private npm packages, you need to set `.npmrc` using the `.npmrc.template`

see https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token

## What's included

### Start

Run `yarn && yarn start`

> If you have the following error `Error: Can't resolve '@amfa-team/test-service'`, just restart the
> tab with example script (lib sdk was not build on start).

### Prettier

- Extensions: `js,ts,tsx,css,md,json`
- VsCode settings: AutoFormat on save
- Husky: AutoFormat on commit
- Github Action check

### Linter

- Includes `eslint` with `eslint-config-sbs`
- Includes `stylelint`

### Yarn Workspaces

- Uses yarn workspaces

### Github Actions

- prettier check
- build

### Commit Hooks

- Prettier
- Commit Lint with conventional commits (https://www.conventionalcommits.org/en/v1.0.0/#summary)

### Packages

#### Shared

- typescript
- shared code between environments

#### React

- React component library
- Deployment with Slack message on `#deploy` channel

#### Example

- React App example project using react component library
- Deployment with Slack message on `#deploy` channel

#### API

- Serverless API
- Deployment with Slack message on `#deploy` channel
