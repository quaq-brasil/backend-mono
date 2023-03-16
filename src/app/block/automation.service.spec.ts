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

  // Add more tests for different comparison types and cases
})
