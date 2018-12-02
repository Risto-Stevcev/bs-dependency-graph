#!/usr/bin/env node
const path = require('path')
const bsSource = require('bs-source-files')
const bsconfig = require(path.join(process.cwd(), 'bsconfig.json'))

const exec = require('child_process').execFileSync

const moduleNameOfFile = file => path.basename(file).replace(/\.[a-z]+[:]$/, '')

const dependencyGraph = files =>
  Object.assign.apply(
    null,
    exec('ocamldep', ['-modules'].concat(files), { encoding: 'utf8' })
      .split('\n')
      .filter(e => !!e)
      .map(e => {
        const [file, ...dependencies] = e.split(' ')
        return { [moduleNameOfFile(file)]: dependencies }
      })
  )

bsSource(bsconfig)
  .then(dependencyGraph)
  .then(json => console.log(JSON.stringify(json, null, 2)))
