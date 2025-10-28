import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";

export class RateStarsPage extends BasePom {
    readonly star1Element: Locator;
    readonly star2Element: Locator;
    readonly star3Element: Locator;
    readonly star4Element: Locator;
    readonly star5Element: Locator;
    readonly ratingTextElement: Locator;
    readonly ratingScoreElement: Locator;

    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/rating/';
        //selectors

        //elements
        this.star1Element = this.page.locator('label').first();
        this.star2Element = this.page.locator('label').nth(1);
        this.star3Element = this.page.locator('label').nth(2);
        this.star4Element = this.page.locator('label').nth(3);
        this.star5Element = this.page.locator('label').nth(4);
        this.ratingTextElement = this.page.locator('span').nth(1);
        this.ratingScoreElement = this.page.locator('.footer .numb');

    }

    async clickStar1() {
        await this.star1Element.click();

    }

    async clickStar2() {
        await this.star2Element.click();

    }

    async clickStar3() {
        await this.star3Element.click();

    }

    async clickStar4() {
        await this.star4Element.click();

    }

    async clickStar5() {
        await this.star5Element.click();

    }



    async checkIfTheTextSpanMatches(text: string) {
        //console.log(await this.getTheBeforeContentOfPseudoElement(this.ratingTextElement));
        this.expect(await this.getTheBeforeContentOfPseudoElement(this.ratingTextElement)).toContain(text);

    }

    async checkIfTheRatingSpanMatches(text: string) {
        //console.log(await this.getTheBeforeContentOfPseudoElement(this.ratingScoreElement));
        this.expect(await this.getTheBeforeContentOfPseudoElement(this.ratingScoreElement)).toContain(text);

    }

}


