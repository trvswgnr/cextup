# CExtUp

Chrome extension development can be painful. CExtUp tries to alleviate some of that pain, without doing too much. It provides a way to quickly scaffold and develop an extension. CExtUp gives you a solid foundation for your projects, including a build system, a development server, and a basic structure, but leaves the rest up to you.

CExtUp uses [Bun](https://bun.sh/)—a modern JavaScript runtime, bundler, and package manager—instead of Node.js for its build system and server. It is also pre-configured to use [Vercel Serverless Edge Functions](https://vercel.com/docs/functions/edge-functions), but should work with other serverless platforms as well.

## Features

-   **Project Setup**: CExtUp automatically generates a new Chrome extension project with a basic structure and all the necessary files.
-   **Bun Integration**: We use Bun for its build system and server, providing an incredibly fast and efficient development experience.
-   **TypeScript Support**: Out-of-the-box support for TS, giving you more confidence in your code.
-   **Edge Functions**: CExtUp is set up to use Vercel Serverless Edge Functions, providing a scalable and efficient way to handle server-side logic. This is optional and can be removed if not needed. These live in the `api/` directory.

## Getting Started

To use CExtUp, run the following command:

```sh
bunx cextup
# or
npx cextup
```

This will prompt you for the name of your new extension and create a new directory with that name, containing all the necessary files for your new Chrome extension.

## Project Structure

The generated project includes the following directories:

-   `src/`: source files for your Chrome extension, including background scripts, content scripts, and the manifest file
-   `types/`: TypeScript type definitions
-   `api/`: serverless functions for your extension (if applicable)
-   `scripts/`: scripts for building and serving your extension during development

When you run `bun start`, the `extension/` directory will be created, containing the built extension. This directory is ignored by Git.

## Development

First, make sure you have [Bun](https://bun.sh/) installed:

```sh
curl -fsSL https://bun.sh/install | bash
```

To start developing your Chrome extension, navigate to the project directory and install the necessary dependencies:

```sh
cd your-extension-name
bun i
```

Then, start the development server and watch for changes:

```sh
bun start
```

If you want to build the extension without starting the development server, you can run:

```sh
bun ./scripts/build.ts
```

Note that while it is possible to use `vercel dev` to run the development server, it is much slower than using Bun, so we recommend using `bun start` instead.

## Loading the Extension in Chrome

To load your extension in Chrome, navigate to `chrome://extensions` in your browser and click `Load unpacked`. Select the `dist` directory in your project. Note that you must have Developer Mode enabled in order to load unpacked extensions.

After making changes to your code, you will need to reload the extension by clicking the `Update` button in `chrome://extensions`.

## Contributing

Contributions to CExtUp are welcome! Please [create an issue](https://github.com/trvswgnr/cextup/issues) or [submit a pull request](https://github.com/trvswgnr/cextup/pulls).

## License

CExtUp is licensed under the MIT License. See the `LICENSE` file for more information.
