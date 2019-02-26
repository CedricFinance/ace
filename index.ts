/**
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// email:send 1 --queue=default
// { _: [ '1' ], queue: 'default' }

// email:send --id=1 --id=2
// { _: [], id: [ 1, 2 ] }

import * as getops from 'getopts'
import { Kernel } from './src/Kernel'
import { Command } from './src/Command'

const parsedArgv = getops(process.argv.slice(2))
const kernel = Kernel.instance

class MyCommand extends Command {
  static get signature () {
    return 'new {name}'
  }

  async handle () {
    console.log('THUMBS UP')
  }
}

kernel.addCommand(MyCommand)
const commandName = parsedArgv['_'].shift() || ''
console.log(parsedArgv)
const command = new (kernel.getCommand(commandName))()

command.handle()

