export const OptionValueDict = {
  NONE: 1,
  REQUIRED: 2,
  OPTIONAL: 4,
  IS_ARRAY: 8,
}

export class InputOption {
  private _name
  private _shortcut
  private _mode
  private _description
  private _defaultValue

  public get name () {
    return this._name
  }

  public get shortcut () {
    return this._shortcut
  }

  public get description () {
    return this._description
  }

  public get defaultValue () {
    return this._defaultValue
  }

  constructor (name: string, shortcut?: string | string[], mode?: number, description: string = '', defaultValue?: any) {
    if (name.indexOf('--') !== -1) {
      name = name.substr(2, name.length)
    }

    if (typeof (mode) === 'undefined') {
      mode = OptionValueDict.NONE
    }

    if (typeof (shortcut) !== 'undefined') {
      if (Array.isArray(shortcut)) {
        shortcut = shortcut.join('|')
      }

      let shortcuts = shortcut.split('|')
      shortcut = shortcuts.join('|')
    }

    this._name = name
    this._description = description
    this._mode = mode
    this.setDefault(defaultValue)
  }

  public acceptValue () {
    return this.isValueRequired() || this.isValueOptional()
  }

  public isValueRequired () {
    return OptionValueDict.REQUIRED === (OptionValueDict.REQUIRED & this._mode)
  }

  public isValueOptional () {
    return OptionValueDict.OPTIONAL === (OptionValueDict.OPTIONAL & this._mode)
  }

  public isArray () {
    return OptionValueDict.IS_ARRAY === (OptionValueDict.IS_ARRAY & this._mode)
  }

  public setDefault (defaultValue?: any) {
    if (OptionValueDict.NONE === (OptionValueDict.NONE & this._mode) && typeof (defaultValue) !== 'undefined') {
      throw new Error('Cannot set a default value when using NONE mode.')
    }

    if (this.isArray()) {
      if (typeof (defaultValue) === 'undefined') {
        defaultValue = []
      } else if (!Array.isArray(defaultValue)) {
        throw new Error('A default value for an array argument must be an array.')
      }
    }

    this._defaultValue = this.acceptValue() ? defaultValue : false
  }
}
