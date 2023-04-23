import * as lodash from "lodash"
import { ComparisonType } from "./ComparisonType.enum"

export type ComparisonFunction = (value: any, comparativeValue?: any) => boolean

const Equals: ComparisonFunction = lodash.isEqual

const notEquals: ComparisonFunction = (a, b) => !lodash.isEqual(a, b)

const contains: ComparisonFunction = lodash.includes

const notContains: ComparisonFunction = (a, b) => !lodash.includes(a, b)

const greaterThan: ComparisonFunction = lodash.gt

const lessThan: ComparisonFunction = lodash.lt

const startsWith: ComparisonFunction = lodash.startsWith

const endsWith: ComparisonFunction = lodash.endsWith

const lengthEquals: ComparisonFunction = (a, b) => lodash.size(a) === b

const lengthGreaterThan: ComparisonFunction = (a, b) => lodash.size(a) > b

const lengthLessThan: ComparisonFunction = (a, b) => lodash.size(a) < b

const matchesRegex: ComparisonFunction = (a, b) =>
  lodash.isString(a) && new RegExp(b).test(a)

const isArray: ComparisonFunction = lodash.isArray

const isObject: ComparisonFunction = lodash.isObject

const isTruthy: ComparisonFunction = (a) => {
  if (
    (lodash.isString(a) && a.toLowerCase() === "false") ||
    (lodash.isString(a) && a.toLowerCase() === "boolean")
  ) {
    return false
  }
  return Boolean(a)
}

const isFalsy: ComparisonFunction = (a) => !Boolean(a)

const isNumber: ComparisonFunction = lodash.isNumber

const isBoolean: ComparisonFunction = lodash.isBoolean

const isUndefined: ComparisonFunction = lodash.isUndefined

const isNull: ComparisonFunction = lodash.isNull

const isNullOrUndefined: ComparisonFunction = lodash.isNil

const isDate: ComparisonFunction = lodash.isDate

const isSymbol: ComparisonFunction = lodash.isSymbol

const isRegExp: ComparisonFunction = lodash.isRegExp

const isString: ComparisonFunction = lodash.isString

export function getComparisonFunctions(
  type: ComparisonType
): ComparisonFunction | undefined {
  const comparisonFunctions: Record<ComparisonType, ComparisonFunction> = {
    [ComparisonType.Equals]: Equals,
    [ComparisonType.NotEquals]: notEquals,
    [ComparisonType.Contains]: contains,
    [ComparisonType.NotContains]: notContains,
    [ComparisonType.GreaterThan]: greaterThan,
    [ComparisonType.LessThan]: lessThan,
    [ComparisonType.StartsWith]: startsWith,
    [ComparisonType.EndsWith]: endsWith,
    [ComparisonType.LengthEquals]: lengthEquals,
    [ComparisonType.LengthGreaterThan]: lengthGreaterThan,
    [ComparisonType.LengthLessThan]: lengthLessThan,
    [ComparisonType.MatchesRegex]: matchesRegex,
    [ComparisonType.IsArray]: isArray,
    [ComparisonType.IsObject]: isObject,
    [ComparisonType.IsTruthy]: isTruthy,
    [ComparisonType.IsFalsy]: isFalsy,
    [ComparisonType.IsNumber]: isNumber,
    [ComparisonType.IsBoolean]: isBoolean,
    [ComparisonType.IsUndefined]: isUndefined,
    [ComparisonType.IsNull]: isNull,
    [ComparisonType.IsNullOrUndefined]: isNullOrUndefined,
    [ComparisonType.IsDate]: isDate,
    [ComparisonType.IsSymbol]: isSymbol,
    [ComparisonType.IsRegExp]: isRegExp,
    [ComparisonType.IsString]: isString,
  }

  return comparisonFunctions[type]
}
