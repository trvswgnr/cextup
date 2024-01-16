# cextup

cextup is a tool to make developing chrome extensions less painful.

it uses `bun` to build the extension and watches for changes to rebuild.

files in the `src` folder are built into the `extension` folder. the `extension` folder is what you load into chrome.

## features

- builds the extension into a folder that can be loaded into chrome
- watches for changes and rebuilds
- no build tool configuration required
- zero dependencies
- creates a live server for development
- supports typescript out of the box
- preconfigured to use vercel serverless edge functions

## usage

make sure you have `bun` installed globally.

```sh
curl -fsSL https://bun.sh/install | bash
```

for now you'll need to clone the repo:
    
```sh
git clone https://github.com/trvswgnr/cextup.git
```

then install the dependencies:

```sh
bun i
```

now, you can start developing your extension:

```sh
bun start
```

## vercel serverless edge functions

cextup is preconfigured to use vercel serverless edge functions. you can read more about them [here](https://vercel.com/docs/functions/edge-functions).

when running the development server, you can access your functions at `http://localhost:3000/api/your-function-name`.

## license

the code in this repo is licensed under the MIT license. see [LICENSE](LICENSE) for more info.

## contributing

contributions are welcome! please open an issue or submit a pull request.
