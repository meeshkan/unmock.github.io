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
  tagline: "We fake it while you make it",
  url: "https://www.unmock.io", // Your website URL
  cname: "www.unmock.io",
  baseUrl: "/", // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: "unmock.github.io",
  organizationName: "unmock",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

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
    unmockBlue: "#6a81ff",
  },

  /* Custom fonts for website */
  fonts: {
    primary: ["Open Sans"],
    secondary: ["Source Code Pro"],
  },

  editUrl: "https://github.com/unmock/unmock.github.io/edit/source/docs/",

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Meeshkan`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-light",
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "//katacoda.com/embed.js",
    {
      src: "https://assets.digitalclimatestrike.net/widget.js",
      async: true,
    },
    "https://unpkg.com/unmock-gitter@0.0.0/index.js",
    {
      src: "https://sidecar.gitter.im/dist/sidecar.v1.js",
      async: true,
      defer: true,
    },
  ],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Open+Sans:300,400,700|Source+Code+Pro:400,700&display=swap",
  ],

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
