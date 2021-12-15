/* eslint-disable no-underscore-dangle */
import { BaseProperty, PropertyType } from 'adminjs'
import { ModelAttributeColumnOptions } from 'sequelize/types'

const TYPES_MAPPING = [
  ['STRING', 'string'],
  ['TEXT', 'string'],
  ['INTEGER', 'number'],
  ['BIGINT', 'number'],
  ['FLOAT', 'float'],
  ['REAL', 'float'],
  ['DOUBLE', 'float'],
  ['DECIMAL', 'float'],
  ['DATE', 'datetime'],
  ['DATEONLY', 'date'],
  ['ENUM', 'string'],
  ['ARRAY', 'array'],
  ['JSON', 'object'],
  ['JSONB', 'object'],
  ['BLOB', 'string'],
  ['UUID', 'string'],
  ['CIDR', 'string'],
  ['INET', 'string'],
  ['MACADDR', 'string'],
  ['RANGE', 'string'],
  ['GEOMETRY', 'string'],
  ['BOOLEAN', 'boolean'],
]

class Property extends BaseProperty {
  private sequelizePath: ModelAttributeColumnOptions

  private fieldName: string

  constructor(sequelizePath: ModelAttributeColumnOptions) {
    const { fieldName } = sequelizePath as any
    super({ path: fieldName })
    this.fieldName = fieldName
    this.sequelizePath = sequelizePath
  }

  name(): string {
    return this.fieldName
  }

  isEditable(): boolean {
    if ((this.sequelizePath as any)._autoGenerated) {
      return false
    }
    if (this.sequelizePath.autoIncrement) {
      return false
    }
    if (this.isId() && !(this.sequelizePath as any).allowEditId) {
      return false
    }
    return true
  }

  isVisible(): boolean {
    // fields containing password are hidden by default
    return !this.name().match('password')
  }

  isId(): boolean {
    return !!this.sequelizePath.primaryKey
  }

  reference(): string | null {
    if (this.isArray()) {
      return null
    }

    if (this.sequelizePath.references === 'string') {
      return this.sequelizePath.references as string
    } if (this.sequelizePath.references && typeof this.sequelizePath.references !== 'string') {
      return this.sequelizePath.references?.model as string
    }
    return null
  }

  availableValues(): Array<string> | null {
    return this.sequelizePath.values && this.sequelizePath.values.length
      ? this.sequelizePath.values as Array<string>
      : null
  }

  isArray(): boolean {
    return this.sequelizePath.type.constructor.name === 'ARRAY'
  }

  /**
   * @returns {PropertyType}
   */
  type(): PropertyType {
    let sequelizeType = this.sequelizePath.type

    if (this.isArray()) {
      sequelizeType = (sequelizeType as any).type
    }

    const key = TYPES_MAPPING.find((element) => (
      sequelizeType.constructor.name === element[0]
    ))

    if (this.reference()) {
      return 'reference' as PropertyType
    }

    const type = key && key[1]
    return (type || 'string') as PropertyType
  }

  isSortable(): boolean {
    return this.type() !== 'mixed' && !this.isArray()
  }

  isRequired(): boolean {
    return !(typeof this.sequelizePath.allowNull === 'undefined'
      || this.sequelizePath.allowNull === true)
  }
}

export default Property
