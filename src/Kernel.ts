// HACK
declare function use<T>(namespace: string): T

/**
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommandContractConstructor } from './Contract/CommandContract';

export class Kernel {
  /**
   * Instance of the Kernel.
   */
  private static _instance: Kernel

  /**
   * Gets the unique instance of the Kernel.
   */
  public static get instance (): Kernel {
    if (!Kernel._instance) {
      Kernel._instance = new Kernel()
    }

    return Kernel._instance
  }

  /**
   * An object containing all the
   * registered commands.
   */
  private _commands = new Map<string, CommandContractConstructor>()

  /**
   * Constructor.
   */
  private constructor () {}

  /**
   * Adds a command
   */
  public addCommand (command: CommandContractConstructor | string): void {
    /**
     * Get command if runtime has a global `use`
     * function.
     */
    if (typeof (command) === 'string' && typeof (use) !== 'undefined') {
      command = use<CommandContractConstructor>(command)
    }

    // Forcing TypeScript to understand it's not a string anymore
    command = command as CommandContractConstructor

    command.boot()
    this._commands.set(command.commandName, command)
  }

  public getCommand (name: string): CommandContractConstructor {
    const command = this._commands.get(name)

    if (typeof (command) === 'undefined') {
      throw new Error('The requested command is not defined')
    }

    return command
  }
}
