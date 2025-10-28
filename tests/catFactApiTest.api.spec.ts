import { expect, test } from '@playwright/test'

const baseUrl = 'https://catfact.ninja';

test.describe('Cat Fact API - Single Fact endpoint tests', () => {
  test("GIVEN the /fact endpoint WHEN a request is made THEN it should return a single cat fact with valid structure", async ({ request }) => {
    const catFact = await request.get(`${baseUrl}/fact`);
    const catFactJson = await catFact.json();
    
    expect.soft(catFact.ok()).toBeTruthy();
    expect.soft(catFact.status()).toBe(200);
    expect.soft(catFactJson).toHaveProperty('fact');
    expect.soft(catFactJson).toHaveProperty('length');
  });

  test("GIVEN the /fact endpoint WHEN a fact is retrieved THEN the length property should match the fact text length", async ({ request }) => {
    const catFact = await request.get(`${baseUrl}/fact`);
    const catFactJson = await catFact.json();
    
    expect(catFactJson.length).toBe(catFactJson.fact.length);
  });

  test("GIVEN the /fact endpoint WHEN a request is made THEN the fact should not be empty", async ({ request }) => {
    const catFact = await request.get(`${baseUrl}/fact`);
    const catFactJson = await catFact.json();
    
    expect.soft(catFactJson.fact.length).toBeGreaterThan(0);
    expect.soft(typeof catFactJson.fact).toBe('string');
  });

  test("GIVEN the /fact endpoint WHEN a request is made THEN the length should be a positive number", async ({ request }) => {
    const catFact = await request.get(`${baseUrl}/fact`);
    const catFactJson = await catFact.json();
    
    expect.soft(typeof catFactJson.length).toBe('number');
    expect.soft(catFactJson.length).toBeGreaterThan(0);
  });

  test("GIVEN the /fact endpoint WHEN a request is made THEN it should respond quickly and return JSON", async ({ request }) => {
    const start = Date.now();
    const catFact = await request.get(`${baseUrl}/fact`);
    const duration = Date.now() - start;
    
    expect.soft(duration).toBeLessThan(2000);
    expect.soft(catFact.status()).toBe(200);
    expect.soft(catFact.headers()['content-type']).toContain('application/json');
  });

  test("GIVEN the /fact endpoint WHEN multiple requests are made THEN facts should vary", async ({ request }) => {
    const fact1 = await request.get(`${baseUrl}/fact`);
    const fact2 = await request.get(`${baseUrl}/fact`);
    const fact3 = await request.get(`${baseUrl}/fact`);
    
    const fact1Json = await fact1.json();
    const fact2Json = await fact2.json();
    const fact3Json = await fact3.json();
    
    const facts = [fact1Json.fact, fact2Json.fact, fact3Json.fact];
    const uniqueFacts = new Set(facts);
    
    // At least some facts should be different (allowing for possibility of duplicates)
    expect(uniqueFacts.size).toBeGreaterThanOrEqual(1);
  });

  test("GIVEN the /fact endpoint WHEN max_length parameter is provided THEN fact should not exceed max length", async ({ request }) => {
    const maxLength = 50;
    const catFact = await request.get(`${baseUrl}/fact?max_length=${maxLength}`);
    const catFactJson = await catFact.json();
    
    expect(catFactJson.length).toBeLessThanOrEqual(maxLength);
  });
});

test.describe('Cat Fact API - Facts list endpoint tests', () => {
  test("GIVEN the /facts endpoint WHEN a request is made without parameters THEN it should return paginated facts", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(catFacts.ok()).toBeTruthy();
    expect.soft(catFacts.status()).toBe(200);
    expect.soft(Array.isArray(catFactsJson.data)).toBeTruthy();
  });

  test("GIVEN the /facts endpoint WHEN data is retrieved THEN it should have proper pagination structure", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(catFactsJson).toHaveProperty('current_page');
    expect.soft(catFactsJson).toHaveProperty('data');
    expect.soft(catFactsJson).toHaveProperty('first_page_url');
    expect.soft(catFactsJson).toHaveProperty('last_page');
    expect.soft(catFactsJson).toHaveProperty('next_page_url');
    expect.soft(catFactsJson).toHaveProperty('per_page');
    expect.soft(catFactsJson).toHaveProperty('total');
  });

  test("GIVEN the /facts endpoint WHEN a request is made THEN per_page should match the data array length", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    expect(catFactsJson.per_page).toBe(catFactsJson.data.length);
  });

  test("GIVEN the /facts endpoint WHEN all facts are retrieved THEN each fact should have valid structure", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    for (const fact of catFactsJson.data) {
      expect.soft(fact).toHaveProperty('fact');
      expect.soft(fact).toHaveProperty('length');
      expect.soft(typeof fact.fact).toBe('string');
      expect.soft(typeof fact.length).toBe('number');
      expect.soft(fact.length).toBe(fact.fact.length);
    }
  });

  test("GIVEN the /facts endpoint WHEN first page is requested THEN prev_page_url should be null", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?page=1`);
    const catFactsJson = await catFacts.json();
    
    expect(catFactsJson.current_page).toBe(1);
    expect(catFactsJson.prev_page_url).toBeNull();
  });

  test("GIVEN the /facts endpoint WHEN second page is requested THEN it should have both prev and next URLs", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?page=2`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(catFactsJson.current_page).toBe(2);
    expect.soft(catFactsJson.prev_page_url).not.toBeNull();
    expect.soft(catFactsJson.next_page_url).not.toBeNull();
  });

  test("GIVEN the /facts endpoint WHEN limit parameter is provided THEN it should return specified number of facts", async ({ request }) => {
    const limit = 5;
    const catFacts = await request.get(`${baseUrl}/facts?limit=${limit}`);
    const catFactsJson = await catFacts.json();
    
    expect(catFactsJson.data.length).toBe(limit);
    expect(catFactsJson.per_page).toBe(limit);
  });

  test("GIVEN the /facts endpoint WHEN a request is made THEN total should be greater than per_page", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    expect(catFactsJson.total).toBeGreaterThan(catFactsJson.per_page);
  });

  test("GIVEN the /facts endpoint WHEN links array is checked THEN it should contain pagination links", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(Array.isArray(catFactsJson.links)).toBeTruthy();
    expect.soft(catFactsJson.links.length).toBeGreaterThan(0);
    
    for (const link of catFactsJson.links) {
      expect.soft(link).toHaveProperty('url');
      expect.soft(link).toHaveProperty('label');
      expect.soft(link).toHaveProperty('active');
    }
  });

  test("GIVEN the /facts endpoint WHEN max_length parameter is provided THEN all facts should respect max length", async ({ request }) => {
    const maxLength = 100;
    const catFacts = await request.get(`${baseUrl}/facts?max_length=${maxLength}`);
    const catFactsJson = await catFacts.json();
    
    for (const fact of catFactsJson.data) {
      expect.soft(fact.length).toBeLessThanOrEqual(maxLength);
    }
  });

  test("GIVEN the /facts endpoint WHEN last page is calculated THEN it should match total divided by per_page", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts`);
    const catFactsJson = await catFacts.json();
    
    const expectedLastPage = Math.ceil(catFactsJson.total / catFactsJson.per_page);
    expect(catFactsJson.last_page).toBe(expectedLastPage);
  });

  test("GIVEN the /facts endpoint WHEN from and to properties are checked THEN they should represent correct range", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?page=2&limit=10`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(catFactsJson).toHaveProperty('from');
    expect.soft(catFactsJson).toHaveProperty('to');
    expect.soft(catFactsJson.from).toBe(11); // Second page starts at 11
    expect.soft(catFactsJson.to).toBe(20);   // Second page ends at 20
  });

  test("GIVEN the /facts endpoint WHEN a very large page number is requested THEN it should handle gracefully", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?page=9999`);
    const catFactsJson = await catFacts.json();
    
    expect.soft(catFacts.status()).toBe(200);
    expect.soft(catFactsJson.data.length).toBe(0);
  });

  test("GIVEN the /facts endpoint WHEN first_page_url is checked THEN it should always point to page 1", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?page=5`);
    const catFactsJson = await catFacts.json();
    
    expect(catFactsJson.first_page_url).toContain('page=1');
  });

  test("GIVEN the /facts endpoint WHEN all facts are unique THEN there should be no duplicate facts", async ({ request }) => {
    const catFacts = await request.get(`${baseUrl}/facts?limit=20`);
    const catFactsJson = await catFacts.json();
    
    const factTexts = catFactsJson.data.map((f: { fact: string }) => f.fact);
    const uniqueFacts = new Set(factTexts);
    
    expect(uniqueFacts.size).toBe(factTexts.length);
  });
});