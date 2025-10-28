import { expect, test } from '@playwright/test'

// Import test data
import commonData from '../../data/wizardWorld/common.json';
import wizardsData from '../../data/wizardWorld/wizards.json';

const baseUrl = commonData.baseUrl;

test.describe('Wizard World API - Wizards endpoint tests', () => {
  test("GIVEN the Wizards endpoint WHEN a request is made without parameters THEN it should return all wizards", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(Array.isArray(wizards)).toBeTruthy();
    expect.soft(wizards.length).toBeGreaterThan(wizardsData.validation.minWizardCount);
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN each wizard should have valid structure", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    for (const wizard of wizards) {
      expect.soft(typeof wizard.id).toBe('string');
      expect.soft(Array.isArray(wizard.elixirs)).toBeTruthy();
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN each wizard should have all required properties", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    for (const wizard of wizards) {
      for (const property of wizardsData.validation.requiredProperties) {
        expect.soft(wizard).toHaveProperty(property);
      }
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN each wizard should have a unique id", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    const ids = wizards.map((w: { id: string }) => w.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("GIVEN the Wizards endpoint WHEN a request is made with valid ID THEN it should return the correct wizard", async ({ request }) => {
    const res = await request.get(baseUrl + `/Wizards/${wizardsData.testData.zygmuntBudge.id}`);
    const wizard = await res.json();
    expect.soft(wizard.firstName).toBe(wizardsData.testData.zygmuntBudge.firstName);
    expect.soft(wizard.lastName).toBe(wizardsData.testData.zygmuntBudge.lastName);
  });

  test("GIVEN the Wizards endpoint WHEN a request is made with invalid ID THEN it should return 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Wizards/${commonData.commonValidation.invalidId}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN each wizard ID should be a valid UUID", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const wizard of wizards) {
      expect.soft(uuidRegex.test(wizard.id)).toBeTruthy();
    }
  });

  test("GIVEN the Wizards endpoint WHEN a specific wizard is retrieved by ID THEN it should return only that wizard", async ({ request }) => {
    const res = await request.get(baseUrl + `/Wizards/${wizardsData.testData.zygmuntBudge.id}`);
    const wizard = await res.json();

    expect.soft(wizard.id).toBe(wizardsData.testData.zygmuntBudge.id);
    expect.soft(typeof wizard).toBe('object');
    expect.soft(Array.isArray(wizard)).toBe(false);
  });

  test("GIVEN the Wizards endpoint WHEN a non-existent UUID is used THEN it should return 404 or 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Wizards/${commonData.commonValidation.nonExistentUUID}`);
    expect.soft([commonData.commonValidation.expectedStatusCodes.badRequest, 
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN famous wizards should be present", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    const wizardLastNames = wizards.map((w: { lastName: string }) => w.lastName);

    for (const famousWizard of wizardsData.testData.famousWizards) {
      const lastName = famousWizard.split(' ').pop();
      expect.soft(wizardLastNames).toContain(lastName);
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN each wizard should have at least one elixir", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    for (const wizard of wizards) {
      expect.soft(wizard.elixirs.length).toBeGreaterThanOrEqual(wizardsData.validation.minElixirsPerWizard);
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN elixirs should have valid structure", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    for (const wizard of wizards) {
      for (const elixir of wizard.elixirs) {
        expect.soft(typeof elixir.id).toBe('string');
        expect.soft(typeof elixir.name).toBe('string');
      }
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN elixir IDs should be valid UUIDs", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const wizard of wizards) {
      for (const elixir of wizard.elixirs) {
        expect.soft(uuidRegex.test(elixir.id)).toBeTruthy();
      }
    }
  });

  test("GIVEN the Wizards endpoint WHEN Zygmunt Budge is retrieved THEN he should be the inventor of Felix Felicis", async ({ request }) => {
    const res = await request.get(baseUrl + `/Wizards/${wizardsData.testData.zygmuntBudge.id}`);
    const wizard = await res.json();
    const elixirNames = wizard.elixirs.map((e: { name: string }) => e.name);

    for (const expectedElixir of wizardsData.testData.zygmuntBudge.expectedElixirs) {
      expect.soft(elixirNames).toContain(expectedElixir);
    }
  });

  test("GIVEN the Wizards endpoint WHEN Fred and George Weasley are checked THEN they should have the same elixirs", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    const fred = wizards.find((w: { firstName: string; lastName: string }) => 
      w.firstName === wizardsData.testData.weasleyTwins.fred.firstName && 
      w.lastName === wizardsData.testData.weasleyTwins.fred.lastName
    );
    const george = wizards.find((w: { firstName: string; lastName: string }) => 
      w.firstName === wizardsData.testData.weasleyTwins.george.firstName && 
      w.lastName === wizardsData.testData.weasleyTwins.george.lastName
    );

    expect.soft(fred).toBeDefined();
    expect.soft(george).toBeDefined();

    if (fred && george) {
      expect.soft(fred.elixirs.length).toBe(wizardsData.testData.weasleyTwins.expectedElixirCount);
      expect.soft(george.elixirs.length).toBe(wizardsData.testData.weasleyTwins.expectedElixirCount);
      
      const fredElixirIds = fred.elixirs.map((e: { id: string }) => e.id).sort();
      const georgeElixirIds = george.elixirs.map((e: { id: string }) => e.id).sort();
      expect.soft(fredElixirIds).toEqual(georgeElixirIds);
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN some wizards should have null firstName", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();
    const wizardsWithNullFirstName = wizards.filter((w: { firstName: null }) => w.firstName === null);

    expect.soft(wizardsWithNullFirstName.length).toBeGreaterThan(0);
    
    const lastNames = wizardsWithNullFirstName.map((w: { lastName: string }) => w.lastName);
    for (const expectedLastName of wizardsData.testData.wizardsWithNullFirstName) {
      expect.soft(lastNames).toContain(expectedLastName);
    }
  });

  test("GIVEN the Wizards endpoint WHEN a request is made THEN it should respond quickly and return JSON", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThan(commonData.commonValidation.performance.maxResponseTime);
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(res.headers()['content-type']).toContain(commonData.contentType);
  });

  test("GIVEN the Wizards and Elixirs endpoints WHEN cross-referenced THEN all wizard elixirs should exist in Elixirs endpoint", async ({ request }) => {
    const wizardsRes = await request.get(baseUrl + commonData.endpoints.wizards);
    const elixirsRes = await request.get(baseUrl + commonData.endpoints.elixirs);
    const wizards = await wizardsRes.json();
    const elixirs = await elixirsRes.json();

    const elixirIds = new Set(elixirs.map((e: { id: string }) => e.id));

    for (const wizard of wizards) {
      for (const elixir of wizard.elixirs) {
        expect.soft(elixirIds.has(elixir.id)).toBeTruthy();
      }
    }
  });

  test("GIVEN the Wizards endpoint WHEN all wizards are retrieved THEN lastName should not be empty", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.wizards);
    const wizards = await res.json();

    for (const wizard of wizards) {
      expect.soft(wizard.lastName.length).toBeGreaterThan(0);
      expect.soft(typeof wizard.lastName).toBe('string');
    }
  });

  test("GIVEN the Wizards endpoint WHEN unsupported HTTP method POST is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.post(baseUrl + commonData.endpoints.wizards, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Wizards endpoint WHEN unsupported HTTP method PUT is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.put(baseUrl + `/Wizards/${wizardsData.testData.zygmuntBudge.id}`, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Wizards endpoint WHEN unsupported HTTP method DELETE is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.delete(baseUrl + `/Wizards/${wizardsData.testData.zygmuntBudge.id}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });
});
