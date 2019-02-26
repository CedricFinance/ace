import { IocContract } from '@adonisjs/fold'

declare global {
  const use: IocContract['use']
  const make: IocContract['make']
}
