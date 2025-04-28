import { describe, expect, test } from 'vitest';
import { convertTimestampToDate, createRef } from '../src/database/seeds/utilities.js';

describe('convertTimestampToDate', () => {
  test('returns a new object', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(typeof result).toBe('object');
  });
  test('converts a created_at property to a date', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test('does not mutate the input', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test('ignores includes any other key-value-pairs in returned object', () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test('returns unchanged object if no created_at property', () => {
    const input = { key: 'value' };
    const result = convertTimestampToDate(input);
    const expected = { key: 'value' };
    expect(result).toEqual(expected);
  });
});
describe('createRef', () => {
  test('should return an empty object when passed an empty array argument', () => {
    const input = [];
    const actual = createRef(input, '', '');
    expect(actual).toEqual({});
  });
  test("should return and empty object if the key isn't found in any of the array argument's objects", () => {
    const input = [
      { notthisone: 42, orthisone: 13 },
      { notthisone: 42, orthisone: 13 },
      { notthisone: 42, orthisone: 13 },
    ];
    const actual = createRef(input, 'lookingforthisaskey', 'lookingforthisasvalue');
    expect(actual).toEqual({});
  });
  test('should return an object with a single property if passed an array containing a single object that has property keys matching the second and third arguments', () => {
    const input = [{ defothisone: 42, andthisone: 7 }];
    const actual = createRef(input, 'defothisone', 'andthisone');
    expect(actual).toEqual({
      42: 7,
    });
  });
  test('should not add a property for an object in the argument array that has no property keys matching the second and third arguments', () => {
    const input = [
      { defothisone: 42, andthisone: 7 },
      { butnotthisone: 13, orthisone: 666 },
    ];
    const actual = createRef(input, 'defothisone', 'andthisone');
    expect(actual).toEqual({
      42: 7,
    });
  });
});
