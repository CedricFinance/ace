export const ArgumentModeDict = {
  REQUIRED: 1,
  OPTIONAL: 2,
  IS_ARRAY: 4,
}

export class InputArgument {
  private _name: string
  private _mode: number
  private _description: string
  private _default: any

  public get name () {
    return this._name
  }

  public get description () {
    return this._description
  }

  public get defaultValue () {
    return this._default
  }

  constructor (name: string, mode?: number, description: string = '', defaultValue?: any) {
    if (typeof (mode) === 'undefined') {
      mode = ArgumentModeDict.OPTIONAL
    }

    this._name = name
    this._description = description
    this._mode = mode
    this.setDefault(defaultValue)
  }

  public isRequired (): boolean {
    return ArgumentModeDict.REQUIRED === (this._mode & ArgumentModeDict.REQUIRED)
  }

  public isArray (): boolean {
    return ArgumentModeDict.IS_ARRAY === (this._mode & ArgumentModeDict.IS_ARRAY)
  }

  public setDefault (defaultValue?: any) {
    if (this.isRequired() && typeof (defaultValue) !== 'undefined') {
      throw new Error('Cannot set a default value except for OPTIONAL mode.')
    }

    if (this.isArray()) {
      if (typeof (defaultValue) === 'undefined') {
        defaultValue = []
      } else if (!Array.isArray(defaultValue)) {
        throw new Error('A default value for an array argument must be an array.')
      }
    }

    this._default = defaultValue
  }
}
