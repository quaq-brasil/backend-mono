import { Injectable } from "@nestjs/common"
import * as lodash from "lodash"

interface IComparison {
  type: ComparisonType
  value: any
  comparativeValue?: any
}

type ComparisonType =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan"
  | "startsWith"
  | "endsWith"
  | "lengthEquals"
  | "lengthGreaterThan"
  | "lengthLessThan"
  | "matchesRegex"
  | "isArray"
  | "isObject"
  | "isTruthy"
  | "isFalsy"
  | "isNumber"
  | "isBoolean"
  | "isUndefined"
  | "isNull"
  | "isNullOrUndefined"
  | "isDate"
  | "isSymbol"
  | "isRegExp"
  | "isString"

interface IAutomationBlock {
  conditionals: IComparison[][]
  blocks: any[]
}

@Injectable()
export class AutomationService {
  public automationBlockExecution({ data }: { data: IAutomationBlock }) {
    return this.getMatchingBlocks(data.conditionals, data.blocks)
  }

  private getMatchingBlocks(conditionals: IComparison[][], blocks: any[]) {
    let isConditionalsSatisfied = false

    for (let index = 0; index < conditionals.length; index++) {
      if (isConditionalsSatisfied) {
        break
      }

      let numberOfSatisfied = 0

      for (
        let secondIndex = 0;
        secondIndex < conditionals[index].length;
        secondIndex++
      ) {
        const isSatisfied = this.conditionalVerifier(
          conditionals[index][secondIndex]
        )

        if (!isSatisfied) {
          break
        }

        numberOfSatisfied++

        if (numberOfSatisfied === conditionals[index].length) {
          isConditionalsSatisfied = true
          break
        }
      }
    }

    return isConditionalsSatisfied ? blocks : null
  }

  private conditionalVerifier({ type, value, comparativeValue }: IComparison) {
    const comparisonFunctions: Record<
      ComparisonType,
      (value: any, comparativeValue?: any) => boolean
    > = {
      equals: lodash.isEqualWith,
      notEquals: (a, b) => !lodash.isEqualWith(a, b),
      contains: lodash.includes,
      notContains: (a, b) => !lodash.includes(a, b),
      greaterThan: lodash.gt,
      lessThan: lodash.lt,
      startsWith: lodash.startsWith,
      endsWith: lodash.endsWith,
      lengthEquals: (a, b) => lodash.size(a) === b,
      lengthGreaterThan: (a, b) => lodash.size(a) > b,
      lengthLessThan: (a, b) => lodash.size(a) < b,
      matchesRegex: (a, b) => lodash.isString(a) && new RegExp(b).test(a),
      isArray: lodash.isArray,
      isObject: lodash.isObject,
      isTruthy: Boolean,
      isFalsy: (a) => !Boolean(a),
      isNumber: lodash.isNumber,
      isBoolean: lodash.isBoolean,
      isUndefined: lodash.isUndefined,
      isNull: lodash.isNull,
      isNullOrUndefined: lodash.isNil,
      isDate: lodash.isDate,
      isSymbol: lodash.isSymbol,
      isRegExp: lodash.isRegExp,
      isString: lodash.isString,
    }
    const comparisonFunction = comparisonFunctions[type]
    if (!comparisonFunction) {
      return false
    }

    return comparisonFunction(value, comparativeValue)
  }
}
