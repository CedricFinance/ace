import { InputArgument, ArgumentModeDict } from './Input/InputArgument'
import { InputOption, OptionValueDict } from './Input/InputOption'

/**
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const argumentRegex = /{(-*.[^}]+)}/g

function trimString (argument: string, toTrim: string) {
  return argument.substr(0, argument.indexOf(toTrim))
}

function extractDescription (token: string): string[] {
  return token.includes(':') ? token.split(':').map(s => s.trim()) : [token.trim(), '']
}

function parseOption (token: string) {
  let match
  let shortcut: string | string[] | null = null
  let [option, description] = extractDescription(token)
  const matches = option.split(/(.+)\|(.+)/g, 2)

  if (matches[1] !== undefined) {
    shortcut = matches[0]
    option = matches[1]
  }

  switch (true) {
    case option.endsWith('='):
      return new InputOption(trimString(option, '='), shortcut, OptionValueDict.OPTIONAL, description)
    case option.endsWith('=*'):
      return new InputOption(trimString(option, '=*'), shortcut, OptionValueDict.IS_ARRAY | OptionValueDict.OPTIONAL, description)
  }

  if ((match = /(.+)=\*(.+)/g.exec(option)) !== null) {
    return new InputOption(match[1], shortcut, OptionValueDict.IS_ARRAY, description, match[2].split(','))
  }

  if ((match = /(.+)=(.+)/.exec(option)) !== null) {
    return new InputOption(match[1], shortcut, OptionValueDict.OPTIONAL, description, match[2])
  }

  return new InputOption(option, shortcut, OptionValueDict.NONE, description)
}

function parseArgument (token: string) {
  let match
  const [argument, description] = extractDescription(token)

  switch (true) {
    case argument.endsWith('?*'):
      return new InputArgument(trimString(argument, '?*'), ArgumentModeDict.IS_ARRAY, description)
    case argument.endsWith('*'):
      return new InputArgument(trimString(argument, '*'), ArgumentModeDict.IS_ARRAY | ArgumentModeDict.REQUIRED, description)
    case argument.endsWith('?'):
      return new InputArgument(trimString(argument, '?'), ArgumentModeDict.OPTIONAL, description)
  }

  if ((match = /(.+)=\*(.+)/g.exec(token)) !== null) {
    return new InputArgument(match[1], ArgumentModeDict.IS_ARRAY, description, match[2].split(','))
  }

  if ((match = /(.+)=(.+)/.exec(token)) !== null) {
    return new InputArgument(match[1], ArgumentModeDict.OPTIONAL, description, match[2])
  }

  return new InputArgument(token, ArgumentModeDict.REQUIRED, description)
}

export const Parser = {
  name (signature: string): string {
    const matches = /[^\s]+/.exec(signature)

    if (matches === null) {
      throw new Error('Unable to determine command name from signature.')
    }

    return matches[0]
  },

  parse (signature: string): any {
    let match
    const name =  Parser.name(signature)
    const args: InputArgument[] = []
    const options: InputOption[] = []

    /**
     * Looping through signature arguments.
     */
    while ((match = argumentRegex.exec(signature)) !== null) {
      const token = match[1]

      if (/-{2,}(.*)/.exec(token)) {
        options.push(parseOption(token))
      } else {
        args.push(parseArgument(token))
      }
    }

    return [name, args, options]
  },
}
