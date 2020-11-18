import { R4 } from '@ahryman40k/ts-fhir-types';
import { createAnswerOption, createPrimitiveInitialValue } from '../../utils/results-processing';

const STRING_CQL_RESULT = 'test';
const INT_CQL_RESULT = 10;
const DATE_CQL_RESULT: Date & { isDate?: boolean } = new Date('2020-01-01');
const TIME_CQL_RESULT: Date & { isDateTime?: boolean } = new Date('2020-01-01T00:00:00');

// boolean comes from cql engine
DATE_CQL_RESULT.isDate = true;
TIME_CQL_RESULT.isDateTime = true;

const CODEABLE_CONCEPT_CQL_RESULT = {
  coding: [
    {
      code: 'example'
    }
  ],
  text: {
    value: 'example'
  },
  _json: {
    coding: [
      {
        code: 'example'
      }
    ],
    text: 'example'
  }
};

const CODING_CQL_RESULT = [
  {
    code: { value: 'example' },
    _json: {
      code: 'example'
    }
  }
];

// any fhir resource
const REFERENCE_CQL_RESULT = {
  id: { value: 'example' },
  code: {
    coding: [{ display: { value: 'example' }, code: { value: 'example' } }]
  },
  _json: {
    resourceType: 'Procedure',
    id: 'example',
    subject: {},
    code: {
      coding: [{ display: 'example', code: 'example' }]
    }
  }
};

const STRING_INITIAL_VALUE: R4.IQuestionnaire_Initial = {
  valueString: STRING_CQL_RESULT
};

const INT_INITIAL_VALUE: R4.IQuestionnaire_Initial = {
  valueInteger: INT_CQL_RESULT
};

const DATE_INITIAL_VALUE: R4.IQuestionnaire_Initial = {
  valueDate: DATE_CQL_RESULT.toString()
};

const TIME_INITIAL_VALUE: R4.IQuestionnaire_Initial = {
  valueTime: TIME_CQL_RESULT.toString()
};

const CODE_ANSWER_OPTION: R4.IQuestionnaire_AnswerOption = {
  valueCoding: {
    code: 'example'
  }
};

const REFERENCE_ANSWER_OPTION: R4.IQuestionnaire_AnswerOption = {
  valueReference: {
    reference: 'Procedure/example',
    display: 'example'
  }
};

describe('Results Processing Tests', () => {
  it('should create valid string answer option', () => {
    expect(createPrimitiveInitialValue('valueString', STRING_CQL_RESULT)).toEqual(STRING_INITIAL_VALUE);
  });

  it('should create valid integer answer option', () => {
    expect(createPrimitiveInitialValue('valueInteger', INT_CQL_RESULT)).toEqual(INT_INITIAL_VALUE);
  });

  it('should create valid date answer option', () => {
    expect(createPrimitiveInitialValue('valueDate', DATE_CQL_RESULT)).toEqual(DATE_INITIAL_VALUE);
  });

  it('should create valid time answer option', () => {
    expect(createPrimitiveInitialValue('valueTime', TIME_CQL_RESULT)).toEqual(TIME_INITIAL_VALUE);
  });

  it('should create valid valueCoding answer option', () => {
    expect(createAnswerOption(CODING_CQL_RESULT)).toEqual(CODE_ANSWER_OPTION);
    expect(createAnswerOption(CODEABLE_CONCEPT_CQL_RESULT)).toEqual(CODE_ANSWER_OPTION);
  });

  it('should create valid valueReference answer option', () => {
    expect(createAnswerOption(REFERENCE_CQL_RESULT)).toEqual(REFERENCE_ANSWER_OPTION);
  });
});
