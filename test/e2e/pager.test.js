const { assert, driver } = require('vl-ui-core').Test.Setup;
const VlPagerPage = require('./pages/vl-pager.page');

describe('vl-pager', async () => {
    const vlPagerPage = new VlPagerPage(driver);

    before(() => {
        return vlPagerPage.load();
    });

    it('Als gebruiker kan ik naar de volgende pagina gaan en ook terug naar de vorige', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getCurrentPage(), 1);

        await pager.goToNextPage();
        await assert.eventually.equal(pager.getCurrentPage(), 2);

        await pager.goToPreviousPage();
        await assert.eventually.equal(pager.getCurrentPage(), 1);
        
        await pager.reset();
    });

    it('als ik van de eerste pagina naar de volgende ga, dan verschijnt de vorige-link', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToNextPage();
        await assert.eventually.isTrue( (await pager._pageBackLink()).isDisplayed());
        await pager.reset();
    });

    it('als ik van pagina verwissel, worden de bounds geüpdatet', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const results = await pager.getTotalOfDisplayedResults();
        await assert.eventually.equal(pager.getTotalOfDisplayedResults(), 10);
        await pager.goToNextPage();
        const resultsAfterNavigation = await pager.getTotalOfDisplayedResults();
        assert.isTrue(resultsAfterNavigation == 20);
        await pager.reset();
    });

    it('ik kan naar een pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToPage('7');
        const currentPage = await pager.getCurrentPage();
        assert.isTrue(currentPage == 7);
        await pager.reset();
    });

    it('ik kan naar de laatste pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        const currentPage = await pager.getCurrentPage();
        assert.isTrue(currentPage == 10);
        await pager.reset();
    });

    it('ik kan naar de eerste pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        const currentPage = await pager.getCurrentPage();
        assert.isTrue(currentPage == 10);
        await pager.goToFirstPage();
        const firstPage = await pager.getCurrentPage();
        assert.isTrue(firstPage == 1);
    });

    it('Als gebruiker zie ik kan het totaal aantal resultaten', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getTotalItems(), 100);
    });

    it('Als gebruiker zie ik hoeveel items zichtbaar zijn', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getItemsPerpage(), 10);
    });
});
