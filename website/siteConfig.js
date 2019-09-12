/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [];

const siteConfig = {
  title: "Unmock", // Title for your website.
  tagline: "Make mocking fun again",
  url: "https://unmock.github.io", // Your website URL
  cname: "www.unmock.io",
  baseUrl: "/", // Base URL for your project
  docsUrl: "", // Defaults to `docs`
  // Used for publishing and more
  projectName: "unmock.github.io",
  organizationName: "unmock",

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "introduction", label: "Docs" },
    { href: "https://github.com/unmock/unmock-js", label: "GitHub" },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: "img/logo-white.svg",
  footerIcon: "img/logo.png",
  favicon: "img/logo-purple.png",

  /* Colors for website */
  colors: {
    primaryColor: "#BA00FF",
    secondaryColor: "#353b44",
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  editUrl: "https://github.com/unmock/unmock.github.io/edit/source/docs/",

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Meeshkan`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-light",
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "https://unpkg.com/unmock-gitter@0.0.0/index.js",
    {
      src: "https://sidecar.gitter.im/dist/sidecar.v1.js",
      async: true,
      defer: true
    }
  ],
  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',

  // Google Analytics tracking ID to track page views.
  gaTrackingId: process.env.GA_TRACKING_ID,
};

module.exports = siteConfig;
