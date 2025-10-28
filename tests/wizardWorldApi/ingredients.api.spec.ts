import { expect, test } from '@playwright/test'

// Import test data
import commonData from '../../data/wizardWorld/common.json';
import ingredientsData from '../../data/wizardWorld/ingredients.json';

const baseUrl = commonData.baseUrl;

test.describe('Wizard World API - Ingredients endpoint tests', () => {
  test("GIVEN the Ingredients endpoint WHEN a request is made without parameters THEN it should return all ingredients", async ({ request }) => {
    const ingredients = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredientsJson = await ingredients.json();
    expect.soft(ingredientsJson.length).toBeGreaterThan(0);
    expect.soft(Array.isArray(ingredientsJson)).toBeTruthy();
  });

  test("GIVEN the Ingredients endpoint WHEN an invalid ID is used THEN it should return 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Ingredients/${commonData.commonValidation.invalidId}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test("GIVEN the Ingredients endpoint WHEN a request is made THEN each ingredient should have valid structure", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();

    for (const i of ingredients) {
      expect.soft(typeof i.id).toBe('string');
      expect.soft(typeof i.name).toBe('string');
    }
  });

  test("GIVEN the Ingredients endpoint WHEN all ingredients are retrieved THEN each ingredient should have a unique id", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();
    const ids = ingredients.map((i: { id: string }) => i.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("GIVEN the Ingredients endpoint WHEN all ingredients are retrieved THEN ingredient names should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();
    const names = ingredients.map((i: { name: string }) => i.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test("GIVEN the Ingredients endpoint WHEN a request is made with valid ID THEN it should return the correct ingredient", async ({ request }) => {
    const res = await request.get(baseUrl + `/Ingredients/${ingredientsData.testData.valerianRoot.id}`);
    const ingredient = await res.json();
    expect.soft(ingredient.name).toBe(ingredientsData.testData.valerianRoot.name);
  });

  test("GIVEN the Ingredients endpoint WHEN a request is made THEN it should respond quickly and return JSON", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThan(commonData.commonValidation.performance.maxResponseTime);
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(res.headers()['content-type']).toContain(commonData.contentType);
  });

  test("GIVEN the Ingredients endpoint WHEN all ingredients are retrieved THEN each ingredient ID should be a valid UUID", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const ingredient of ingredients) {
      expect.soft(uuidRegex.test(ingredient.id)).toBeTruthy();
    }
  });

  test("GIVEN the Ingredients endpoint WHEN a specific ingredient is retrieved by ID THEN it should return only that ingredient", async ({ request }) => {
    const res = await request.get(baseUrl + `/Ingredients/${ingredientsData.testData.valerianRoot.id}`);
    const ingredient = await res.json();

    expect.soft(ingredient.id).toBe(ingredientsData.testData.valerianRoot.id);
    expect.soft(typeof ingredient).toBe('object');
    expect.soft(Array.isArray(ingredient)).toBe(false);
  });

  test("GIVEN the Ingredients endpoint WHEN a non-existent UUID is used THEN it should return 404 or 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Ingredients/${commonData.commonValidation.nonExistentUUID}`);
    expect.soft([commonData.commonValidation.expectedStatusCodes.badRequest, 
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

  test("GIVEN the Ingredients endpoint WHEN all ingredients are retrieved THEN they should have proper naming format", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();

    for (const ingredient of ingredients) {
      expect.soft(ingredient.name.length).toBeGreaterThan(0);
      expect.soft(typeof ingredient.name).toBe('string');
    }
  });

  test("GIVEN the Ingredients endpoint WHEN ingredient is checked THEN it should have only id and name properties", async ({ request }) => {
    const res = await request.get(baseUrl + `/Ingredients/${ingredientsData.testData.valerianRoot.id}`);
    const ingredient = await res.json();

    for (const property of ingredientsData.validation.expectedProperties) {
      expect.soft(ingredient).toHaveProperty(property);
    }
    const keys = Object.keys(ingredient);
    expect.soft(keys.length).toBe(ingredientsData.validation.propertyCount);
  });

  test("GIVEN the Ingredients endpoint WHEN searching for known ingredients THEN common ones should exist", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.ingredients);
    const ingredients = await res.json();
    const names = ingredients.map((i: { name: string }) => i.name);

    for (const knownIngredient of ingredientsData.testData.knownIngredients) {
      expect.soft(names).toContain(knownIngredient);
    }
  });

  test("GIVEN the Ingredients and Elixirs endpoints WHEN cross-referenced THEN all elixir ingredients should exist in Ingredients endpoint", async ({ request }) => {
    const ingredientsRes = await request.get(baseUrl + commonData.endpoints.ingredients);
    const elixirsRes = await request.get(baseUrl + commonData.endpoints.elixirs);
    const ingredients = await ingredientsRes.json();
    const elixirs = await elixirsRes.json();

    const ingredientIds = new Set(ingredients.map((i: { id: string }) => i.id));

    for (const elixir of elixirs) {
      if (elixir.ingredients && elixir.ingredients.length > 0) {
        for (const ingredient of elixir.ingredients) {
          expect.soft(ingredientIds.has(ingredient.id)).toBeTruthy();
        }
      }
    }
  });

  test("GIVEN the Ingredients endpoint WHEN unsupported HTTP method POST is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.post(baseUrl + commonData.endpoints.ingredients, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Ingredients endpoint WHEN unsupported HTTP method PUT is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.put(baseUrl + `/Ingredients/${ingredientsData.testData.valerianRoot.id}`, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Ingredients endpoint WHEN unsupported HTTP method DELETE is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.delete(baseUrl + `/Ingredients/${ingredientsData.testData.valerianRoot.id}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });
});
