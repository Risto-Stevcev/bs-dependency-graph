#!/usr/bin/env node
const path = require('path')
const { readFileSync } = require('fs')
const { set, update } = require('seamless-immutable').static
const { uniq } = require('lodash')
const bsSource = require('bs-source-files')
const bsconfig = require(path.join(process.cwd(), 'bsconfig.json'))

const capitalizedIdent = /^[A-Z]{1}[A-Za-z0-9_']*$/
const modulePath = stack => stack.filter(e => !/^(object|begin)$/.test(e))

const setGraph = ({opens, calls}) => e => {
  const scope = e || { opens: [], calls: [] }
  return {
    opens: uniq(scope.opens.concat(opens)),
    calls: uniq(scope.calls.concat(calls))
  }
}

const getModuleName = tokens => tokens[tokens.lastIndexOf('module') + 1]

const dependencyGraph = files => {
  const g = files.reduce((acc, file) => {
    const moduleName = path.basename(file).replace(/\.[a-z]+$/, '')

    var stack = [moduleName]
    return readFileSync(file, 'utf8').split('\n').reduce((acc, line) => {
      const tokens = line.split(/\s+/)

      return tokens.reduce((acc, token, index) => {
        if (/^(struct|object|begin)$/.test(token))
          stack.push(token === 'struct' ? getModuleName(tokens.slice(0, index)) : token)
        if (token === 'end')
          stack.pop()

        if (token === 'open') {
          return update(
            acc,
            modulePath(stack).join('.'),
            setGraph({ opens: [tokens[index + 1]], calls: [] })
          )
        }
        else if (/\./.test(token) && token.split('.').some(e => capitalizedIdent.test(e))) {
          return update(
            acc,
            modulePath(stack).join('.'),
            setGraph({
              opens: [],
              calls: [token.split('.').filter(e => capitalizedIdent.test(e)).join('.')]
            })
          )
        }
        else return acc
      }, acc)
    }, acc)
  }, {})


  return Object.entries(g).reduce((acc, [key, {opens, calls}]) => {
    if (!key) return acc
    return set(
      acc,
      key,
      calls.reduce((acc, call) => {
        if (call in g)
          return acc.concat(call)
        
        const open = opens.filter(open => `${open}.${call}` in g)
        if (open.length)
          return acc.concat(`${open[0]}.${call}`)
        else
          return acc
      }, [])
    )
  }, {})
}

bsSource(bsconfig)
  .then(dependencyGraph)
  .then(json => console.log(JSON.stringify(json, null, 2)))
