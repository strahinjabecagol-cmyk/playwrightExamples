import { test } from '../base.test'
import heroesData from '../data/heroes.json'

test.describe('Dynamic Table - Table Structure', () => {
    test('should have correct table headers', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        const expectedHeaders = ['Superhero', 'Status', 'Real Name'];
        await dynamicTablePage.verifyTableHeaders(expectedHeaders);
    });

    test('should have correct number of rows', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        await dynamicTablePage.verifyTableRowCount(8);
    });

    test('should display table with header and body', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        await dynamicTablePage.verifyTableIsVisible();
    });
});

test.describe('Dynamic Table - Hero Data Validation', () => {
    // Data-driven tests for all heroes
    for (const hero of heroesData) {
        test(`should verify ${hero.name} is present with correct email`, async ({ dynamicTablePage }) => {
            await dynamicTablePage.goto();
            await dynamicTablePage.verifyHeroExists(hero.name, hero.email);
        });

        test(`should verify all data for ${hero.name}`, async ({ dynamicTablePage }) => {
            await dynamicTablePage.goto();
            await dynamicTablePage.verifyHeroData(hero.name, hero.email, hero.status, hero.realName);
        });
    }
});

test.describe('Dynamic Table - Legacy Tests', () => {
    test('should find Spiderman in the dynamic table', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        await dynamicTablePage.checkIfSpidermanIsVisibleInTheTable();
    });

    test('should find Iron Man in the dynamic table', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        await dynamicTablePage.checkIfIronManIsVisibleInTheTable();
    });

    test('should find Hulk in the dynamic table', async ({ dynamicTablePage }) => {
        await dynamicTablePage.goto();
        await dynamicTablePage.checkIfHulkIsVisibleInTheTable();
    });
});