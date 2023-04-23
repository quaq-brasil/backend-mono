import { Test, TestingModule } from "@nestjs/testing"
import { AutomationService } from "../automation.service"
import { testCases } from "./comparisonTestCases"

describe("isConditionalSatisfied", () => {
  let service: AutomationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile()

    service = module.get<AutomationService>(AutomationService)
  })

  testCases.forEach(({ description, comparison, expectedResult }) => {
    it(description, () => {
      const result = service.isConditionalSatisfied(comparison)
      expect(result).toBe(expectedResult)
    })
  })
})
