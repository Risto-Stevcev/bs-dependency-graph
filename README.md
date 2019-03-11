# bs-dependency-graph

[![Build Status](https://travis-ci.org/Risto-Stevcev/bs-dependency-graph.svg?branch=master)](https://travis-ci.org/Risto-Stevcev/bs-dependency-graph)
[![Latest release](https://img.shields.io/npm/v/bs-dependency-graph.svg?style=flat)](https://www.npmjs.com/package/bs-dependency-graph)
[![License](https://img.shields.io/npm/l/bs-dependency-graph.svg?style=flat)](https://github.com/Risto-Stevcev/bs-dependency-graph/blob/master/LICENSE)

Generates the module dependency graph for a bucklescript project

## Usage

Install it for your bucklescript project:

```sh
$ npm install --save-dev bs-dependency-graph
```

Optionally, you can use json-to-dot to convert it to the dot format:

```sh
$ npm install --save-dev json-to-dot
```

And if you have graphviz installed, you can convert the dot format to an image 
using the `dot` command, and then preview it with ImageMagick.

Combining these together, you can add it as a command in your `package.json`:

```js
{
  "name": "bs-some-project",
  ...

  "scripts": {
    "graph:dot": "bs-dependency-graph | json-to-dot > graph.dot",
    "graph:image": "dot -Tpng graph.dot -o graph.png",
    "graph:view": "display graph.png",
    "graph": "npm run graph:dot && npm run graph:image"
  },
  ...
}
```

## How it Works

The library fetches all of your project files based on the settings in 
`bsconfig.json` and then runs `ocamldep` on the files to get the dependency graph


## License

See LICENSE
