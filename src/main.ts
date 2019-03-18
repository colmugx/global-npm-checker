import { spawnSync } from 'child_process'
import inquirer from 'inquirer'

interface IAnswer {
  packages: string[]
}

const GLOBAL = ['-g']
const OUTDATED = GLOBAL.concat('outdated')
const newSpawn = (opt: string[]) => spawnSync('npm', opt, { encoding : 'utf8' })
const installPkg = (pkg: string) => GLOBAL.concat(['install', pkg])

export default async function() {
  const { stdout } = newSpawn(OUTDATED)
  const output = stdout.split('\n').slice(1)
  const apps = output
    .map(v => v.match(/^(\S*\s+)(\S*)\s+(\S*)/))
    .filter(Boolean)
    .map(v => ({ name: `${v![1]} ${v![2]} ~> ${v![3]}`, value: v![1]}))

  if (!apps.length) {
    console.log('目前没有更新项')
    process.exit(0)
  }
  const answers = await inquirer.prompt({
    name: 'packages',
    message: "选择需要更新的包",
    type: 'checkbox',
    choices: apps
  })
  const { packages } = answers as IAnswer

  if (!packages.length) {
    console.log('看来你什么都不想更新')
    process.exit(0)
  }

  packages.forEach(pkg => {
    try {
      const { stdout } = newSpawn(installPkg(pkg.trim()))
      console.log(stdout.toString())
    } catch (err) {
      console.error(err)
      process.exit(0)
    } finally {
      console.log(`${pkg} 更新完成`)
    }
  });
}