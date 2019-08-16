const chalk = require('chalk')
const path = require('path')
const { readFile, writeFile, makeDir } = require('../../utils/fs')
const { resolveConfigStrategy } = require('../strategies/resolve')

/**
 * @param {String} options.targetPath
 * @param {String} options.configPath
 * @param {String} options.configSource
 * @returns {Promise<void>}
 */
const installConfig = async ({ targetPath, configPath, configSource }) => {
  const targetStrategy = resolveConfigStrategy(configPath)
  const localConfigPath = path.join(targetPath, configPath)
  const localConfigDirName = path.dirname(localConfigPath)
  let newConfig = null
  let localConfig = null

  try {
    localConfig = await readFile(localConfigPath, 'utf8')
  } catch (err) {}

  if (localConfig && targetStrategy) {
    try {
      newConfig = targetStrategy.merge(configPath)(localConfig, configSource)
    } catch (err) {
      const errorMessage = [
        chalk.bold(
          `sharec: an error occured during merging ${localConfigPath}`,
        ),
        err.message,
      ]

      console.error(errorMessage.join('\n\t'))
    }
  } else {
    newConfig = configSource
  }

  try {
    await makeDir(localConfigDirName, {
      recursive: true,
    })
  } catch (err) {}

  await writeFile(
    localConfigPath,
    newConfig instanceof Object
      ? JSON.stringify(newConfig, null, 2)
      : newConfig,
    'utf8',
  )
}

module.exports = {
  installConfig,
}
