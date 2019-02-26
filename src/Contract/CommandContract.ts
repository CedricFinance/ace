/**
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CommandContract {
  handle (): Promise<void>
}

export interface CommandContractConstructor {
  commandName: string
  boot (): void
  new (): CommandContract
}
