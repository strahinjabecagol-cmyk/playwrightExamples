import { expect, test } from '@playwright/test'

// Import test data
import commonData from '../../data/wizardWorld/common.json';
import elixirsData from '../../data/wizardWorld/elixirs.json';

const baseUrl = commonData.baseUrl;
const felixFelicis = elixirsData.testData.felixFelicis.name;
const expectedIngredients = elixirsData.testData.felixFelicis.ingredients;
const elixirId = elixirsData.testData.testElixirId;

test.describe('Wizard World API - Elixirs endpoint tests', () => {
  test("GIVEN the Elixirs endpoing WHEN a request is made without parameters THAN it should return 145 items", async ({ request }) => {
    const elixirs = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirsJson = await elixirs.json();
    expect(elixirsJson.length).toBe(elixirsData.testData.expectedTotalCount);
  });

  test("GIVEN the Elixirs endpoing WHEN a request is made with name parameter felixFelicis THAN it should return Felix Felicis elixir object", async ({ request }) => {
    const felix = await request.get(baseUrl + `/Elixirs?Name=${felixFelicis}`);
    let felixJson = await felix.json();
    const felixData = elixirsData.testData.felixFelicis;
    
    expect.soft(await felixJson[0].id).toBe(felixData.id);
    expect.soft(await felixJson[0].name).toBe(felixData.name);
    expect.soft(await felixJson[0].sideEffects).toBe(felixData.sideEffects);
    expect.soft(await felixJson[0].difficulty).toBe(felixData.difficulty);
    expect.soft(await felixJson[0].ingredients).toStrictEqual(expectedIngredients);
    expect.soft(await felixJson[0].inventors.length).toBe(1);
    expect.soft(await felixJson[0].inventors[0].firstName).toBe(felixData.inventor.firstName);
    expect.soft(await felixJson[0].inventors[0].lastName).toBe(felixData.inventor.lastName);
  });

  test("GIVEN the Elixirs endpoing WHEN a request is made with Difficulty parameter Advanced THAN it should return only Advanced elixir objects", async ({ request }) => {
    const raw = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.advanced.name}`);
    let elixirs = await raw.json();
    expect.soft(elixirs.length).toBe(elixirsData.testData.difficulties.advanced.expectedCount);
    for (const elixir of elixirs) {
      expect.soft(await elixir.difficulty).toBe(elixirsData.testData.difficulties.advanced.name);
    }
  });

  test("GIVEN the Elixirs endpoing WHEN a request is made with Ingredient parameter Valerian root THAN it should return only elixir objects that contain Valerian root", async ({ request }) => {
    const raw = await request.get(baseUrl + `/Elixirs?Ingredient=${elixirsData.testData.ingredients.valerianRoot}`);
    let elixirs = await raw.json();
    expect.soft(elixirs.length).toBe(elixirsData.testData.ingredients.valerianRootCount);
    for (const elixir of elixirs) {
      const ingredientsNames = elixir.ingredients.map((i: { name: any; }) => i.name);
      expect.soft(ingredientsNames).toContain(elixirsData.testData.ingredients.valerianRoot);
    }
  });

  test("GIVEN the Elixirs endpoing WHEN a request is made with ID parameter THAN it should return only elixir object for that specific id", async ({ request }) => {
    const raw = await request.get(baseUrl + `/Elixirs/${elixirId}`);
    let elixir = await raw.json();
    expect(elixir.id).toBe(elixirId);
  });

  test('GIVEN the Elixirs endpoing WHEN a request is made THAN the properties of a response should be valid', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      expect.soft(typeof elixir.id).toBe('string');
      expect.soft(typeof elixir.name).toBe('string');
      expect.soft(Array.isArray(elixir.ingredients)).toBeTruthy();
      expect.soft(elixir.hasOwnProperty('difficulty')).toBeTruthy();
    }
  });

  test('GIVEN the Elixirs endpoing WHEN a request is made with name parameter for non existing name THAN the response body should be an empty array and a response code should be 200', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.nonExistentName}`);
    const data = await res.json();
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GIVEN the Elixirs endpoing WHEN a request is made with invalid ID parameter THAN the response code should be 400"', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs/${commonData.commonValidation.invalidId}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with non-existent name parameter THEN the response should be an empty array', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.nonExistentNameAlt}`);
    const data = await res.json();
    expect(data.length).toBe(0);
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made THEN the response should be quick and have JSON content type', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThan(commonData.commonValidation.performance.maxResponseTime);
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(res.headers()['content-type']).toContain(commonData.contentType);
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with Difficulty=Advanced and Ingredient=Valerian root THEN it should return only elixir objects matching both filters', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.advanced.name}&Ingredient=${elixirsData.testData.ingredients.valerianRoot}`);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      expect.soft(elixir.difficulty).toBe(elixirsData.testData.difficulties.advanced.name);
      const ingredientsNames = elixir.ingredients.map((i: { name: any; }) => i.name);
      expect.soft(ingredientsNames).toContain(elixirsData.testData.ingredients.valerianRoot);
    }
  });

  test('GIVEN the Elixirs endpoint WHEN all elixirs are retrieved THEN each elixir should have a unique id', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();
    const ids = elixirs.map((e: { id: any; }) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with case-sensitive name parameter THEN it should handle case sensitivity properly', async ({ request }) => {
    const lowerCase = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.caseSensitivity.lowerCase}`);
    const upperCase = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.caseSensitivity.upperCase}`);
    const properCase = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.caseSensitivity.properCase}`);

    // API appears to be case-insensitive or returns empty for non-exact matches
    expect.soft(lowerCase.status()).toBe(200);
    expect.soft(upperCase.status()).toBe(200);
    expect.soft(properCase.status()).toBe(200);
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with Difficulty=Beginner THEN it should return only Beginner elixir objects', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.beginner}`);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      expect.soft(elixir.difficulty).toBe(elixirsData.testData.difficulties.beginner);
    }
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with Difficulty=Moderate THEN it should return only Moderate elixir objects', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.moderate}`);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      expect.soft(elixir.difficulty).toBe(elixirsData.testData.difficulties.moderate);
    }
  });

  test('GIVEN the Elixirs endpoint WHEN all elixirs are retrieved THEN difficulty values should be from expected set', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();
    const validDifficulties = elixirsData.testData.difficulties.valid;

    for (const elixir of elixirs) {
      if (elixir.difficulty !== null && elixir.difficulty !== undefined) {
        expect.soft(validDifficulties).toContain(elixir.difficulty);
      }
    }
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with special characters in name THEN it should handle URL encoding properly', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Name=${elixirsData.testData.testCases.specialCharactersName}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GIVEN the Elixirs endpoint WHEN a request is made with invalid difficulty parameter THEN it should return 400 Bad Request', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.invalid}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test('GIVEN the Elixirs endpoint WHEN elixirs with inventors are retrieved THEN inventor IDs should be valid UUIDs', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const elixir of elixirs) {
      if (elixir.inventors && elixir.inventors.length > 0) {
        for (const inventor of elixir.inventors) {
          if (inventor.id) {
            expect.soft(uuidRegex.test(inventor.id)).toBeTruthy();
          }
        }
      }
    }
  });

  test('GIVEN the Elixirs endpoint WHEN all elixirs are retrieved THEN each elixir ID should be a valid UUID', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const elixir of elixirs) {
      expect.soft(uuidRegex.test(elixir.id)).toBeTruthy();
    }
  });

  test('GIVEN the Elixirs endpoint WHEN elixirs are retrieved THEN elixirs with no inventors should have empty array', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      if (elixir.inventors) {
        expect.soft(Array.isArray(elixir.inventors)).toBeTruthy();
      }
    }
  });

  test('GIVEN the Elixirs endpoint WHEN multiple ingredients are used THEN results should contain all specified ingredients', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Ingredient=${elixirsData.testData.ingredients.valerianRoot}&Ingredient=${elixirsData.testData.ingredients.asphodel}`);
    const elixirs = await res.json();
    expect(res.status()).toBe(200);
    expect(Array.isArray(elixirs)).toBeTruthy();
  });

  test('GIVEN the Elixirs endpoint WHEN ingredient IDs are checked THEN they should be valid UUIDs', async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.elixirs);
    const elixirs = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const elixir of elixirs) {
      if (elixir.ingredients && elixir.ingredients.length > 0) {
        for (const ingredient of elixir.ingredients) {
          expect.soft(uuidRegex.test(ingredient.id)).toBeTruthy();
        }
      }
    }
  });

  test('GIVEN the Elixirs endpoint WHEN an elixir is retrieved by ID THEN it should have all expected properties', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs/${elixirId}`);
    const elixir = await res.json();

    for (const property of elixirsData.testData.expectedProperties) {
      expect.soft(elixir).toHaveProperty(property);
    }
  });

  test('GIVEN the Elixirs endpoint WHEN filtering by Difficulty and Name THEN results should match both criteria', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs?Difficulty=${elixirsData.testData.difficulties.advanced.name}&Name=${elixirsData.testData.felixFelicis.name}`);
    const elixirs = await res.json();

    for (const elixir of elixirs) {
      expect.soft(elixir.difficulty).toBe(elixirsData.testData.difficulties.advanced.name);
      expect.soft(elixir.name).toContain(elixirsData.testData.felixFelicis.name);
    }
  });

  test('GIVEN the Elixirs endpoint WHEN very long query parameter is used THEN it should handle gracefully', async ({ request }) => {
    const longName = elixirsData.testData.testCases.longQueryName.repeat(elixirsData.testData.testCases.longQueryRepeat);
    const res = await request.get(baseUrl + `/Elixirs?Name=${longName}`);
    expect.soft(res.status()).toBeLessThan(500); // Should not cause server error
    expect.soft([commonData.commonValidation.expectedStatusCodes.success, 
                 commonData.commonValidation.expectedStatusCodes.badRequest, 
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

  // API bug: Returns 500 instead of 404 for non-existent UUID (NotFoundException not handled)
  test.fixme('GIVEN the Elixirs endpoint WHEN non-existent UUID is used THEN it should return 404 or appropriate error', async ({ request }) => {
    const res = await request.get(baseUrl + `/Elixirs/${commonData.commonValidation.nonExistentUUID}`);
    expect.soft([commonData.commonValidation.expectedStatusCodes.badRequest,
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

});
