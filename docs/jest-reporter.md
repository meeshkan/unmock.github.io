---
id: jest-reporter
title: Jest reporter
sidebar_label: Jest reporter
---

Unmock includes a Jest reporter for easy integration with [Jest](https://jestjs.io/), a delightful JS testing framework. When run with Jest, the reporter outputs an HTML report of the HTTP traffic made by each test. It has never been easier to see how your code interacts with the outside world!

## Installation

Install [unmock-jest](https://www.npmjs.com/package/unmock-jest):

```
npm i unmock-jest -D
// or
yarn add unmock-jest -D
```

## Usage

In your [Jest configuration](https://jestjs.io/docs/en/configuration#reporters-array-modulename-modulename-options), add `"unmock-jest/reporter"` as reporter:

```
// jest.config.js
{
    reporters: ["default", "unmock-jest/reporter"]
}
```

Then run your tests and a report is generated.

Note that `unmock` must also be installed.

## Configuration

You can define options in the reporter configuration:

```
// jest.config.js
{
    reporters: [
      "default",
        [ "unmock-jest", { outputDirectory: "reports" } ]
  ]
}
```

Following options are available:

| Reporter Config Name | Description                  | Default              |
| -------------------- | ---------------------------- | -------------------- |
| `outputDirectory`    | Directory to save the output | "**unmock**/"        |
| `outputFilename`     | File name for the output     | "unmock-report.html" |
