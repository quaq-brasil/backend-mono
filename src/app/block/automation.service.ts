import { Injectable } from "@nestjs/common"
import { ComparisonType } from "./ComparisonType.enum"
import { getComparisonFunctions } from "./comparisonFunctions"

export interface IComparison {
  type: ComparisonType
  value: any
  comparativeValue?: any
}

export interface IAutomationBlock {
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

  public getMatchingBlocks(
    conditionals: IComparison[][],
    blocks: any[]
  ): any[] | null {
    for (const conditionalGroup of conditionals) {
      const isGroupSatisfied = conditionalGroup.every((conditional) => {
        return this.isConditionalSatisfied(conditional)
      })

      if (isGroupSatisfied) {
        return blocks
      }
    }
    return null
  }

  public isConditionalSatisfied({
    type,
    value,
    comparativeValue,
  }: IComparison) {
    const comparisonFunction = getComparisonFunctions(type)

    return comparisonFunction
      ? comparisonFunction(value, comparativeValue)
      : false
  }
}
