import { Test } from "@nestjs/testing"
import {
  AutomationService,
  ComparisonType,
  IAutomationBlock,
} from "./automation.service"

describe("AutomationService", () => {
  let automationService: AutomationService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile()

    automationService = moduleRef.get<AutomationService>(AutomationService)
  })

  describe("automationBlockExecution", () => {
    it("should return matching blocks when conditionals are satisfied", () => {
      const data: IAutomationBlock = {
        conditionals: [
          [
            { type: ComparisonType.Equals, value: 2, comparativeValue: 2 },
            { type: ComparisonType.IsNumber, value: 42 },
          ],
        ],
        blocks: ["matchedBlock"],
      }

      const result = automationService.automationBlockExecution({ data })
      expect(result).toEqual(["matchedBlock"])
    })

    it("should return null when no conditionals are satisfied", () => {
      const data: IAutomationBlock = {
        conditionals: [
          [
            { type: ComparisonType.Equals, value: 2, comparativeValue: 3 },
            { type: ComparisonType.IsNumber, value: 42 },
          ],
        ],
        blocks: ["unmatchedBlock"],
      }

      const result = automationService.automationBlockExecution({ data })
      expect(result).toBeNull()
    })
  })

  describe("additional comparison types", () => {
    const dataTemplate: IAutomationBlock = {
      conditionals: [],
      blocks: ["matchedBlock"],
    }

    const createTestCase = (
      type: ComparisonType,
      value: any,
      comparativeValue: any,
      expectedResult: any[]
    ) => {
      const data: IAutomationBlock = {
        ...dataTemplate,
        conditionals: [[{ type, value, comparativeValue }]],
      }

      const result = automationService.automationBlockExecution({ data })
      expect(result).toEqual(expectedResult)
    }

    it("should handle ComparisonType.NotEquals", () => {
      createTestCase(ComparisonType.NotEquals, 2, 3, ["matchedBlock"])
      createTestCase(ComparisonType.NotEquals, "abc", "def", ["matchedBlock"])
      createTestCase(ComparisonType.NotEquals, 2, 2, null)
    })

    it("should handle ComparisonType.Contains", () => {
      createTestCase(ComparisonType.Contains, [1, 2, 3], 2, ["matchedBlock"])
      createTestCase(ComparisonType.Contains, "hello world", "world", [
        "matchedBlock",
      ])
      createTestCase(ComparisonType.Contains, [1, 2, 3], 4, null)
    })

    // Add more test cases for other ComparisonType values.
  })
})
