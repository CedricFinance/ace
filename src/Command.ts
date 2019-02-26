/**
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommandContract } from './Contract/CommandContract';

export abstract class Command implements CommandContract {
  private static _name: string

  private static _booted = false

  public static get signature (): string {
    throw new Error('Define the signature')
  }

  public static get commandName (): string {
    return this._name
  }

  public static boot () {
    if (this._booted === true) {
      return this
    }

    this._parseSignature()
    this._booted = true

    return this
  }

  private static _parseSignature () {
    const [name] = this.signature.trim().split(' ')
    this._name = name
  }

  abstract handle (): Promise<void>
}
