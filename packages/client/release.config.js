module.exports = {
  branches: [
    "master",
    { name: "develop", prerelease: true, prerelease: "beta" },
  ],
  repositoryUrl: "https://github.com/amfa-team/picnic-sfu.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "semantic-release-slack-bot",
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
        markdownReleaseNotes: true,
      },
    ],
  ],
};
