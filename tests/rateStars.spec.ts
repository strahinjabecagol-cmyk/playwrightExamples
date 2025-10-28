import { test } from '../base.test'

test('Should rate it 1 star and expect 1/5 and I just hate it text', async ({ rateStarsPage }) => {
    await rateStarsPage.goto();
    await rateStarsPage.clickStar1();
    await rateStarsPage.checkIfTheTextSpanMatches('I just hate it');
    await rateStarsPage.checkIfTheRatingSpanMatches('1 out of 5');

});

test('Should rate it 2 star and expect 2/5 and I don\'t like it', async ({ rateStarsPage }) => {
    await rateStarsPage.goto();
    await rateStarsPage.clickStar2();
    await rateStarsPage.checkIfTheTextSpanMatches('I don\'t like it');
    await rateStarsPage.checkIfTheRatingSpanMatches('2 out of 5');

});

test('Should rate it 3 star and expect 3/5 and This is awesome', async ({ rateStarsPage }) => {
    await rateStarsPage.goto();
    await rateStarsPage.clickStar3();
    await rateStarsPage.checkIfTheTextSpanMatches('This is awesome');
    await rateStarsPage.checkIfTheRatingSpanMatches('3 out of 5');

});

test('Should rate it 4 star and expect 4/5 and I just like it', async ({ rateStarsPage }) => {
    await rateStarsPage.goto();
    await rateStarsPage.clickStar4();
    await rateStarsPage.checkIfTheTextSpanMatches('I just like it');
    await rateStarsPage.checkIfTheRatingSpanMatches('4 out of 5');

});

test('Should rate it 5 star and expect 5/5 and I just love it', async ({ rateStarsPage }) => {
    await rateStarsPage.goto();
    await rateStarsPage.clickStar5();
    await rateStarsPage.checkIfTheTextSpanMatches('I just love it');
    await rateStarsPage.checkIfTheRatingSpanMatches('5 out of 5');

});
