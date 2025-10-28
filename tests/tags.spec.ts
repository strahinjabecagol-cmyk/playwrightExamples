import { test } from '../base.test'
import peopleData from '../data/people.json';

test('shold remove placeholder tags and add new ones', async ({ tagsPage }) => {
    await tagsPage.goto();
    await tagsPage.removeExistingTags();
    await tagsPage.checkIfThereAreNoTags();
    await tagsPage.addNewTag(peopleData[0]);
    await tagsPage.checkIfTagExists(peopleData[0]);
    await tagsPage.addNewTag(peopleData[1]);
    await tagsPage.checkIfTagExists(peopleData[1]);

});

test('should  remove placeholder tags and add 10 new ones', async ({ tagsPage }) => {
    await tagsPage.goto();
    await tagsPage.removeExistingTags();
    await tagsPage.checkIfThereAreNoTags();
    for (let person of peopleData) {
        await tagsPage.addNewTag(person);
        await tagsPage.checkIfTagExists(person);
    }

});
