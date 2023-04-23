import { Test, TestingModule } from "@nestjs/testing"
import {
  AutomationService,
  ComparisonType,
  IAutomationBlock,
} from "../automation.service"

describe("automationBlockExecution", () => {
  let service: AutomationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile()

    service = module.get<AutomationService>(AutomationService)
  })

  it("should return matching blocks if conditionals are satisfied", () => {
    const data: IAutomationBlock = {
      conditionals: [
        [
          {
            type: ComparisonType.Equals,
            value: 2,
            comparativeValue: 2,
          },
        ],
      ],
      blocks: ["block1", "block2"],
    }
    const result = service.automationBlockExecution({ data })
    expect(result).toEqual(data.blocks)
  })

  it("should return null if no conditionals are satisfied", () => {
    const data: IAutomationBlock = {
      conditionals: [
        [
          {
            type: ComparisonType.Equals,
            value: 2,
            comparativeValue: 3,
          },
        ],
      ],
      blocks: ["block1", "block2"],
    }
    const result = service.automationBlockExecution({ data })
    expect(result).toBeNull()
  })
})
