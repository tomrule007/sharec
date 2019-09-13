const { install, remove, version } = require('./commands')

async function sharec({ configsPath, targetPath, command, options }) {
  if (command === 'version') {
    await version(configsPath)
    return
  }

  if (!configsPath || configsPath === targetPath) return

  switch (command) {
    case 'remove':
      await remove({ configsPath, targetPath, options })
      break
    case 'install':
    default:
      await install({ configsPath, targetPath, options })
  }
}

module.exports = sharec
