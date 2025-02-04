const trim = require('lodash/trim')
const identity = require('lodash/identity')
const last = require('lodash/last')
const head = require('lodash/head')

function commandsToMap(params) {
  return Object.keys(params).reduce((acc, key) => {
    const parsedCommand = new Map()

    if (!params[key]) {
      return Object.assign(acc, {
        [key]: undefined,
      })
    }

    const splittedCommand = params[key].split(/(\||&{1,2})/).map(trim)

    for (let i = 0; i < splittedCommand.length; i++) {
      const command = splittedCommand[i]
      const splittedSubcommand = command.split(/([A-Z0-9_-]+=\S+)\s/).filter(identity)
      const subcommandWithArgs = last(splittedSubcommand).split(' ')
      const subcommand = head(subcommandWithArgs)
      const args = subcommandWithArgs.slice(1)
      const env = splittedSubcommand.slice(0, splittedSubcommand.length - 1)
      const parsedSubcommand = new Map([['separator', null]])

      if (splittedCommand[i + 1]) {
        parsedSubcommand.set('separator', splittedCommand[i + 1])
      }

      parsedSubcommand.set('env', env)
      parsedSubcommand.set('args', args)

      if (!parsedCommand.has(subcommand)) {
        parsedCommand.set(subcommand, [])
      }

      parsedCommand.set(subcommand, parsedCommand.get(subcommand).concat(parsedSubcommand))

      i++
    }

    return Object.assign(acc, {
      [key]: parsedCommand,
    })
  }, {})
}

module.exports = commandsToMap
