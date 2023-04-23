import { ComparisonType, IComparison } from "../automation.service"

const equals = {
  description: "Equals should return true when values are equal",
  comparison: {
    type: ComparisonType.Equals,
    value: 1,
    comparativeValue: 1,
  },
  expectedResult: true,
}

const notEquals = {
  description: "NotEquals should return true when values are not equal",
  comparison: {
    type: ComparisonType.NotEquals,
    value: 1,
    comparativeValue: 2,
  },
  expectedResult: true,
}

const contains = {
  description:
    "Contains should return true when value contains comparativeValue",
  comparison: {
    type: ComparisonType.Contains,
    value: [1, 2, 3],
    comparativeValue: 2,
  },
  expectedResult: true,
}

const notContains = {
  description:
    "NotContains should return true when value does not contain comparativeValue",
  comparison: {
    type: ComparisonType.NotContains,
    value: [1, 2, 3],
    comparativeValue: 4,
  },
  expectedResult: true,
}

const greaterThan = {
  description:
    "GreaterThan should return true when value is greater than comparativeValue",
  comparison: {
    type: ComparisonType.GreaterThan,
    value: 3,
    comparativeValue: 2,
  },
  expectedResult: true,
}

const lessThan = {
  description:
    "LessThan should return true when value is less than comparativeValue",
  comparison: {
    type: ComparisonType.LessThan,
    value: 1,
    comparativeValue: 2,
  },
  expectedResult: true,
}

const startsWith = {
  description:
    "StartsWith should return true when value starts with comparativeValue",
  comparison: {
    type: ComparisonType.StartsWith,
    value: "hello world",
    comparativeValue: "hello",
  },
  expectedResult: true,
}

const endsWith = {
  description:
    "EndsWith should return true when value ends with comparativeValue",
  comparison: {
    type: ComparisonType.EndsWith,
    value: "hello world",
    comparativeValue: "world",
  },
  expectedResult: true,
}

const lengthEquals = {
  description:
    "LengthEquals should return true when length of value equals comparativeValue",
  comparison: {
    type: ComparisonType.LengthEquals,
    value: [1, 2, 3],
    comparativeValue: 3,
  },
  expectedResult: true,
}

const lengthGreaterThan = {
  description:
    "LengthGreaterThan should return true when length of value is greater than comparativeValue",
  comparison: {
    type: ComparisonType.LengthGreaterThan,
    value: [1, 2, 3],
    comparativeValue: 2,
  },
  expectedResult: true,
}

const lengthLessThan = {
  description:
    "LengthLessThan should return true when length of value is less than comparativeValue",
  comparison: {
    type: ComparisonType.LengthLessThan,
    value: [1, 2],
    comparativeValue: 3,
  },
  expectedResult: true,
}

const matchesRegex = {
  description:
    "MatchesRegex should return true when value matches the regex pattern",
  comparison: {
    type: ComparisonType.MatchesRegex,
    value: "hello123",
    comparativeValue: "\\d+",
  },
  expectedResult: true,
}

const isArray = {
  description: "IsArray should return true when value is an array",
  comparison: {
    type: ComparisonType.IsArray,
    value: [1, 2, 3],
  },
  expectedResult: true,
}

const isObject = {
  description: "IsObject should return true when value is an object",
  comparison: {
    type: ComparisonType.IsObject,
    value: { key: "value" },
  },
  expectedResult: true,
}

const isTruthy = {
  description: "IsTruthy should return true when value is truthy",
  comparison: {
    type: ComparisonType.IsTruthy,
    value: 1,
  },
  expectedResult: true,
}

const isFalsy = {
  description: "IsFalsy should return true when value is falsy",
  comparison: {
    type: ComparisonType.IsFalsy,
    value: 0,
  },
  expectedResult: true,
}

const isNumber = {
  description: "IsNumber should return true when value is a number",
  comparison: {
    type: ComparisonType.IsNumber,
    value: 42,
  },
  expectedResult: true,
}

const isBoolean = {
  description: "IsBoolean should return true when value is a boolean",
  comparison: {
    type: ComparisonType.IsBoolean,
    value: true,
  },
  expectedResult: true,
}

const isUndefined = {
  description: "IsUndefined should return true when value is undefined",
  comparison: {
    type: ComparisonType.IsUndefined,
    value: undefined,
  },
  expectedResult: true,
}

const isNull = {
  description: "IsNull should return true when value is null",
  comparison: {
    type: ComparisonType.IsNull,
    value: null,
  },
  expectedResult: true,
}

const isNullOrUndefined = {
  description:
    "IsNullOrUndefined should return true when value is null or undefined",
  comparison: {
    type: ComparisonType.IsNullOrUndefined,
    value: null,
  },
  expectedResult: true,
}

const isDate = {
  description: "IsDate should return true when value is a Date object",
  comparison: {
    type: ComparisonType.IsDate,
    value: new Date(),
  },
  expectedResult: true,
}

const isSymbol = {
  description: "IsSymbol should return true when value is a Symbol",
  comparison: {
    type: ComparisonType.IsSymbol,
    value: Symbol("test"),
  },
  expectedResult: true,
}

const isRegExp = {
  description: "IsRegExp should return true when value is a RegExp object",
  comparison: {
    type: ComparisonType.IsRegExp,
    value: /test/,
  },
  expectedResult: true,
}

const isString = {
  description: "IsString should return true when value is a string",
  comparison: {
    type: ComparisonType.IsString,
    value: "test",
  },
  expectedResult: true,
}

export const testCases: {
  description: string
  comparison: IComparison
  expectedResult: boolean
}[] = [
  equals,
  notEquals,
  contains,
  notContains,
  greaterThan,
  lessThan,
  startsWith,
  endsWith,
  lengthEquals,
  lengthGreaterThan,
  lengthLessThan,
  matchesRegex,
  isArray,
  isObject,
  isTruthy,
  isFalsy,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isNullOrUndefined,
  isDate,
  isSymbol,
  isRegExp,
  isString,
]
