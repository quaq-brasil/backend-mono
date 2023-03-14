import { Injectable } from "@nestjs/common"
import * as lodash from "lodash"

enum ComparisonType {
  Equals = "equals",
  NotEquals = "notEquals",
  Contains = "contains",
  NotContains = "notContains",
  GreaterThan = "greaterThan",
  LessThan = "lessThan",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
  LengthEquals = "lengthEquals",
  LengthGreaterThan = "lengthGreaterThan",
  LengthLessThan = "lengthLessThan",
  MatchesRegex = "matchesRegex",
  IsArray = "isArray",
  IsObject = "isObject",
  IsTruthy = "isTruthy",
  IsFalsy = "isFalsy",
  IsNumber = "isNumber",
  IsBoolean = "isBoolean",
  IsUndefined = "isUndefined",
  IsNull = "isNull",
  IsNullOrUndefined = "isNullOrUndefined",
  IsDate = "isDate",
  IsSymbol = "isSymbol",
  IsRegExp = "isRegExp",
  IsString = "isString",
}

interface IComparison {
  type: ComparisonType
  value: any
  comparativeValue?: any
}

interface IAutomationBlock {
  conditionals?: IComparison[][]
  blocks?: any[]
}

@Injectable()
export class AutomationService {
  public automationBlockExecution({
    data: { conditionals, blocks },
  }: {
    data: IAutomationBlock
  }) {
    return this.getMatchingBlocks(conditionals, blocks)
  }

  private getMatchingBlocks(conditionals: IComparison[][], blocks: any[]) {
    for (const conditionalGroup of conditionals) {
      let numberOfSatisfied = 0
      for (const conditional of conditionalGroup) {
        if (!this.isConditionalSatisfied(conditional)) {
          break
        }
        numberOfSatisfied++
      }
      if (numberOfSatisfied === conditionalGroup.length) {
        return blocks
      }
    }
    return null
  }

  private isConditionalSatisfied({
    type,
    value,
    comparativeValue,
  }: IComparison) {
    const comparisonFunctions: Record<
      ComparisonType,
      (value: any, comparativeValue?: any) => boolean
    > = {
      [ComparisonType.Equals]: lodash.isEqualWith,
      [ComparisonType.NotEquals]: (a, b) => !lodash.isEqualWith(a, b),
      [ComparisonType.Contains]: lodash.includes,
      [ComparisonType.NotContains]: (a, b) => !lodash.includes(a, b),
      [ComparisonType.GreaterThan]: lodash.gt,
      [ComparisonType.LessThan]: lodash.lt,
      [ComparisonType.StartsWith]: lodash.startsWith,
      [ComparisonType.EndsWith]: lodash.endsWith,
      [ComparisonType.LengthEquals]: (a, b) => lodash.size(a) === b,
      [ComparisonType.LengthGreaterThan]: (a, b) => lodash.size(a) > b,
      [ComparisonType.LengthLessThan]: (a, b) => lodash.size(a) < b,
      [ComparisonType.MatchesRegex]: (a, b) =>
        lodash.isString(a) && new RegExp(b).test(a),
      [ComparisonType.IsArray]: lodash.isArray,
      [ComparisonType.IsObject]: lodash.isObject,
      [ComparisonType.IsTruthy]: Boolean,
      [ComparisonType.IsFalsy]: (a) => !Boolean(a),
      [ComparisonType.IsNumber]: lodash.isNumber,
      [ComparisonType.IsBoolean]: lodash.isBoolean,
      [ComparisonType.IsUndefined]: lodash.isUndefined,
      [ComparisonType.IsNull]: lodash.isNull,
      [ComparisonType.IsNullOrUndefined]: lodash.isNil,
      [ComparisonType.IsDate]: lodash.isDate,
      [ComparisonType.IsSymbol]: lodash.isSymbol,
      [ComparisonType.IsRegExp]: lodash.isRegExp,
      [ComparisonType.IsString]: lodash.isString,
    }

    const comparisonFunction = comparisonFunctions[type]
    if (!comparisonFunction) {
      return false
    }

    return comparisonFunction(value, comparativeValue)
  }
}
