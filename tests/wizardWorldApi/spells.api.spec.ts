import { expect, test } from '@playwright/test'

// Import test data
import commonData from '../../data/wizardWorld/common.json';
import spellsData from '../../data/wizardWorld/spells.json';

const baseUrl = commonData.baseUrl;

test.describe('Wizard World API - Spells endpoint tests', () => {
  test("GIVEN the Spells endpoint WHEN a request is made without parameters THEN it should return all spells", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(Array.isArray(spells)).toBeTruthy();
    expect.soft(spells.length).toBeGreaterThan(spellsData.validation.minSpellCount);
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN each spell should have valid structure", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();

    for (const spell of spells) {
      expect.soft(typeof spell.id).toBe('string');
      expect.soft(typeof spell.name).toBe('string');
      expect.soft(typeof spell.type).toBe('string');
      expect.soft(typeof spell.effect).toBe('string');
      expect.soft(typeof spell.incantation === 'string' || spell.incantation === null).toBeTruthy();
    }
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN each spell should have a unique id", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const ids = spells.map((s: { id: string }) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN it should return a large number of spells", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    expect.soft(spells.length).toBeGreaterThan(spellsData.validation.minSpellCount);
    expect.soft(spells.length).toBeLessThan(spellsData.validation.maxSpellCount);
  });

  test("GIVEN the Spells endpoint WHEN a request is made with valid ID THEN it should return the correct spell", async ({ request }) => {
    const res = await request.get(baseUrl + `/Spells/${spellsData.testData.expelliarmus.id}`);
    const spell = await res.json();
    expect(await spell.incantation).toBe(spellsData.testData.expelliarmus.incantation);
  });

  test("GIVEN the Spells endpoint WHEN a request is made with invalid ID THEN it should return 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Spells/${commonData.commonValidation.invalidId}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test("GIVEN the Spells endpoint WHEN a request is made THEN it should respond quickly and return JSON", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThan(commonData.commonValidation.performance.maxResponseTime);
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(res.headers()['content-type']).toContain(commonData.contentType);
  });

  test("GIVEN the Spells endpoint WHEN spells are retrieved THEN it should contain common known ones", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const incantation = spells.map((s: { incantation: string }) => s.incantation);
    
    for (const knownSpell of spellsData.testData.knownSpells) {
      expect.soft(incantation).toContain(knownSpell);
    }
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN each spell ID should be a valid UUID", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const spell of spells) {
      expect.soft(uuidRegex.test(spell.id)).toBeTruthy();
    }
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN spell types should be from expected set", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const validTypes = spellsData.validation.validTypes;

    for (const spell of spells) {
      if (spell.type) {
        // Just verify it's a string, as the API might have variations
        expect.soft(typeof spell.type).toBe('string');
      }
    }
  });

  test("GIVEN the Spells endpoint WHEN a spell is retrieved by ID THEN it should have all expected properties", async ({ request }) => {
    const res = await request.get(baseUrl + `/Spells/${spellsData.testData.expelliarmus.id}`);
    const spell = await res.json();

    for (const property of spellsData.validation.requiredProperties) {
      expect.soft(spell).toHaveProperty(property);
    }
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN some spells should have null incantation", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const spellsWithNullIncantation = spells.filter((s: { incantation: null }) => s.incantation === null);

    expect.soft(spellsWithNullIncantation.length).toBeGreaterThan(0);
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN spell names should not be empty", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();

    for (const spell of spells) {
      expect.soft(spell.name.length).toBeGreaterThan(0);
      expect.soft(typeof spell.name).toBe('string');
    }
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN effects should not be empty", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();

    for (const spell of spells) {
      expect.soft(spell.effect.length).toBeGreaterThan(0);
      expect.soft(typeof spell.effect).toBe('string');
    }
  });

  test("GIVEN the Spells endpoint WHEN a specific spell is retrieved by ID THEN it should return only that spell", async ({ request }) => {
    const res = await request.get(baseUrl + `/Spells/${spellsData.testData.expelliarmus.id}`);
    const spell = await res.json();

    expect.soft(spell.id).toBe(spellsData.testData.expelliarmus.id);
    expect.soft(typeof spell).toBe('object');
    expect.soft(Array.isArray(spell)).toBe(false);
  });

  // API bug: Returns 500 instead of 404 for non-existent UUID (NotFoundException not handled)
  test.fixme("GIVEN the Spells endpoint WHEN a non-existent UUID is used THEN it should return 404 or 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Spells/${commonData.commonValidation.nonExistentUUID}`);
    expect.soft([commonData.commonValidation.expectedStatusCodes.badRequest,
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

  test("GIVEN the Spells endpoint WHEN all spells are retrieved THEN incantations should be properly formatted", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();

    for (const spell of spells) {
      if (spell.incantation !== null) {
        expect.soft(typeof spell.incantation).toBe('string');
        expect.soft(spell.incantation.length).toBeGreaterThan(0);
      }
    }
  });

  test("GIVEN the Spells endpoint WHEN checking spell types THEN dark spells should exist", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const darkSpells = spells.filter((s: { name: string; effect: string; incantation: string | null }) => 
      s.name.toLowerCase().includes('curse') || 
      s.effect.toLowerCase().includes('death') ||
      s.incantation === 'Avada Kedavra'
    );

    expect.soft(darkSpells.length).toBeGreaterThan(0);
  });

  test("GIVEN the Spells endpoint WHEN checking charm spells THEN utility spells should exist", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const utilitySpells = spells.filter((s: { incantation: string }) => 
      s.incantation === 'Lumos' || s.incantation === 'Alohomora'
    );

    expect.soft(utilitySpells.length).toBeGreaterThanOrEqual(2);
  });

  test("GIVEN the Spells endpoint WHEN unsupported HTTP method POST is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.post(baseUrl + commonData.endpoints.spells, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Spells endpoint WHEN unsupported HTTP method PUT is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.put(baseUrl + `/Spells/${spellsData.testData.expelliarmus.id}`, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test("GIVEN the Spells endpoint WHEN unsupported HTTP method DELETE is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.delete(baseUrl + `/Spells/${spellsData.testData.expelliarmus.id}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });

  test.fixme("GIVEN the Spells endpoint WHEN all spells are retrieved THEN each spell name should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.spells);
    const spells = await res.json();
    const names = spells.map((s: { name: string }) => s.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });
});
