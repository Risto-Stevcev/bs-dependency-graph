# bs-dependency-graph

Generates a dependency graph for a bucklescript project

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
using the `dot` command.

Combining these together, you can add it as a command in your `package.json`:

```js
{
  "name": "bs-some-project",
  ...

  "scripts": {
    "graph:dot": "bs-dependency-graph | json-to-dot > graph.dot",
    "graph:image": "dot -Tpng graph.dot -o graph.png",
    "graph": "npm run graph:dot && npm run graph:image"
  },
  ...
}
```

## Limitations

This library is *severely* limited. It very loosely has a "lexer+parser": it 
tokenizes the files, and uses a stack to navigate module scope as you might for 
a CFG. It doesn't track external dependencies like included libraries, and it 
likely won't handle some corner cases. It's not ideal but it's better than 
nothing.

## License

See LICENSE
