#!/usr/bin/env node
import yargs from 'yargs-parser'
import main from './main'

const args = yargs(process.argv.slice(2))

if (args.v || args.version) {
  console.log(require('../version.json').version)
  process.exit(0)
}

main()