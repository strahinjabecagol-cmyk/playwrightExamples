import { expect, test } from '@playwright/test'

// Import test data
import commonData from '../../data/wizardWorld/common.json';
import housesData from '../../data/wizardWorld/houses.json';

const baseUrl = commonData.baseUrl;

test.describe('Wizard World API - Houses endpoint tests', () => {
  test("GIVEN the Houses endpoing WHEN a request is made without parameters THAN it should return 4 items", async ({ request }) => {
    const houses = await request.get(baseUrl + commonData.endpoints.houses);
    const housesJson = await houses.json();
    expect(housesJson.length).toBe(housesData.expectedCount);

  });

  test("GIVEN the Houses endpoing WHEN a request is made without parameters THAN it should return proper house names", async ({ request }) => {
    const houses = await request.get(baseUrl + commonData.endpoints.houses);
    const housesJson = await houses.json();
    const houseNames = housesJson.map((h: { name: any; }) => h.name);
    
    for (const expectedName of housesData.expectedHouseNames) {
      expect(houseNames).toContain(expectedName);
    }
  });


  test("GIVEN the Houses endpoing WHEN a request is made without parameters THAN a house name should match specific house color", async ({ request }) => {
    const houses = await request.get(baseUrl + commonData.endpoints.houses);
    const housesJson = await houses.json();

    for (const house of housesJson) {
      if (house.name === housesData.houses.gryffindor.name) {
        expect(house.houseColours).toBe(housesData.houses.gryffindor.houseColours);
        expect(house.founder).toBe(housesData.houses.gryffindor.founder);
        expect(house.animal).toBe(housesData.houses.gryffindor.animal);
        expect(house.element).toBe(housesData.houses.gryffindor.element);
        expect(house.ghost).toBe(housesData.houses.gryffindor.ghost);
        expect(house.commonRoom).toBe(housesData.houses.gryffindor.commonRoom);
      }
      if (house.name === housesData.houses.ravenclaw.name) {
        expect(house.houseColours).toBe(housesData.houses.ravenclaw.houseColours);
        expect(house.founder).toBe(housesData.houses.ravenclaw.founder);
        expect(house.animal).toBe(housesData.houses.ravenclaw.animal);
        expect(house.element).toBe(housesData.houses.ravenclaw.element);
        expect(house.ghost).toBe(housesData.houses.ravenclaw.ghost);
        expect(house.commonRoom).toBe(housesData.houses.ravenclaw.commonRoom);
      }
      if (house.name === housesData.houses.hufflepuff.name) {
        expect(house.houseColours).toBe(housesData.houses.hufflepuff.houseColours);
        expect(house.founder).toBe(housesData.houses.hufflepuff.founder);
        expect(house.animal).toBe(housesData.houses.hufflepuff.animal);
        expect(house.element).toBe(housesData.houses.hufflepuff.element);
        expect(house.ghost).toBe(housesData.houses.hufflepuff.ghost);
        expect(house.commonRoom).toBe(housesData.houses.hufflepuff.commonRoom);
      }
      if (house.name === housesData.houses.slytherin.name) {
        expect(house.houseColours).toBe(housesData.houses.slytherin.houseColours);
        expect(house.founder).toBe(housesData.houses.slytherin.founder);
        expect(house.animal).toBe(housesData.houses.slytherin.animal);
        expect(house.element).toBe(housesData.houses.slytherin.element);
        expect(house.ghost).toBe(housesData.houses.slytherin.ghost);
        expect(house.commonRoom).toBe(housesData.houses.slytherin.commonRoom);
      }

    }
  });
  test("GIVEN the Houses endpoing WHEN a request is made with id parameter THAN it should return the selected house", async ({ request }) => {
    const house = await request.get(baseUrl + `/Houses/${housesData.houses.slytherin.id}`);
    const houseJson = await house.json();
    expect(houseJson.name).toBe(housesData.houses.slytherin.name);

  });
  test("GIVEN the Houses endpoint WHEN data is returned THEN each house should have valid structure", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();

    for (const house of houses) {
      expect.soft(typeof house.id).toBe('string');
      expect.soft(typeof house.name).toBe('string');
      expect.soft(typeof house.houseColours).toBe('string');
      expect.soft(typeof house.founder).toBe('string');
      expect.soft(Array.isArray(house.heads)).toBeTruthy();
      expect.soft(Array.isArray(house.traits)).toBeTruthy();
    }
  });
  test("GIVEN the Houses endpoint WHEN houses are retrieved THEN each head should have a valid first and last name", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();

    for (const house of houses) {
      for (const head of house.heads) {
        expect.soft(typeof head.firstName).toBe('string');
        expect.soft(typeof head.lastName).toBe('string');
      }
    }
  });


  test("GIVEN the Houses endpoint WHEN houses are retrieved THEN each house should have at least one trait", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();

    for (const house of houses) {
      expect.soft(house.traits.length).toBeGreaterThan(0);
    }
  });

  test("GIVEN the Houses endpoint WHEN an invalid ID is used THEN it should return 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Houses/${commonData.commonValidation.invalidId}`);
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.badRequest);
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each house ID should be a valid UUID", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const house of houses) {
      expect.soft(uuidRegex.test(house.id)).toBeTruthy();
    }
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each house should have unique ID", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const ids = houses.map((h: { id: string }) => h.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("GIVEN the Houses endpoint WHEN Gryffindor is retrieved THEN it should have expected traits", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const gryffindor = houses.find((h: { name: string }) => h.name === housesData.houses.gryffindor.name);

    expect.soft(gryffindor).toBeDefined();
    const traitNames = gryffindor.traits.map((t: { name: string }) => t.name);
    
    for (const expectedTrait of housesData.houses.gryffindor.traits) {
      expect.soft(traitNames).toContain(expectedTrait);
    }
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN trait IDs should be valid UUIDs", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const house of houses) {
      for (const trait of house.traits) {
        expect.soft(uuidRegex.test(trait.id)).toBeTruthy();
        expect.soft(typeof trait.name).toBe('string');
      }
    }
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN head IDs should be valid UUIDs", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const uuidRegex = new RegExp(commonData.commonValidation.uuidRegex, 'i');

    for (const house of houses) {
      for (const head of house.heads) {
        expect.soft(uuidRegex.test(head.id)).toBeTruthy();
      }
    }
  });

  test("GIVEN the Houses endpoint WHEN a non-existent UUID is used THEN it should return 404 or 400", async ({ request }) => {
    const res = await request.get(baseUrl + `/Houses/${commonData.commonValidation.nonExistentUUID}`);
    expect.soft([commonData.commonValidation.expectedStatusCodes.badRequest, 
                 commonData.commonValidation.expectedStatusCodes.notFound]).toContain(res.status());
  });

  test("GIVEN the Houses endpoint WHEN a request is made THEN it should respond quickly and return JSON", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThan(commonData.commonValidation.performance.maxResponseTime);
    expect.soft(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.success);
    expect.soft(res.headers()['content-type']).toContain(commonData.contentType);
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each house should have all required properties", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();

    for (const house of houses) {
      for (const property of housesData.requiredProperties) {
        expect.soft(house).toHaveProperty(property);
      }
    }
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each element should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const elements = houses.map((h: { element: string }) => h.element);
    const uniqueElements = new Set(elements);
    expect(uniqueElements.size).toBe(elements.length);
    
    for (const expectedElement of housesData.expectedElements) {
      expect.soft(elements).toContain(expectedElement);
    }
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each animal should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const animals = houses.map((h: { animal: string }) => h.animal);
    const uniqueAnimals = new Set(animals);
    expect(uniqueAnimals.size).toBe(animals.length);
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each ghost should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const ghosts = houses.map((h: { ghost: string }) => h.ghost);
    const uniqueGhosts = new Set(ghosts);
    expect(uniqueGhosts.size).toBe(ghosts.length);
  });

  test("GIVEN the Houses endpoint WHEN all houses are retrieved THEN each commonRoom should be unique", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();
    const commonRooms = houses.map((h: { commonRoom: string }) => h.commonRoom);
    const uniqueCommonRooms = new Set(commonRooms);
    expect(uniqueCommonRooms.size).toBe(commonRooms.length);
  });

  test("GIVEN the Houses endpoint WHEN each house is checked THEN every house should have at least one head", async ({ request }) => {
    const res = await request.get(baseUrl + commonData.endpoints.houses);
    const houses = await res.json();

    for (const house of houses) {
      expect.soft(house.heads.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("GIVEN the Houses endpoint WHEN a specific house is retrieved by ID THEN it should return only that house", async ({ request }) => {
    const res = await request.get(baseUrl + `/Houses/${housesData.houses.slytherin.id}`);
    const house = await res.json();
    
    expect.soft(house.id).toBe(housesData.houses.slytherin.id);
    expect.soft(house.name).toBe(housesData.houses.slytherin.name);
    expect.soft(typeof house).toBe('object');
    expect.soft(Array.isArray(house)).toBe(false);
  });

  test("GIVEN the Houses endpoint WHEN unsupported HTTP method POST is used THEN it should return 405 Method Not Allowed", async ({ request }) => {
    const res = await request.post(baseUrl + commonData.endpoints.houses, { data: {} });
    expect(res.status()).toBe(commonData.commonValidation.expectedStatusCodes.methodNotAllowed);
  });
});
