import { describe, expect, it } from 'vitest';
import { isSurveyIcon, surveyIcon } from './icons';

describe('surveyIcon', () => {
  it('returns listed icons and nothing for unknown or inherited names', () => {
    expect(surveyIcon('users')).not.toBeNull();
    expect(surveyIcon('not-an-icon')).toBeNull();
    // An inherited name would otherwise hand React the Object constructor.
    expect(surveyIcon('constructor')).toBeNull();
    expect(isSurveyIcon('toString')).toBe(false);
    expect(surveyIcon(null)).toBeNull();
  });
});
