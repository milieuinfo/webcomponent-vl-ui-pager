
const { assert, driver } = require('vl-ui-core').Test;
const VlPagerPage = require('./pages/vl-pager.page');

describe('vl-pager', async () => {
    const vlPagerPage = new VlPagerPage(driver);

    before(() => {
        return vlPagerPage.load();
    });

    it('als ik kan op volgende klik dan zal de pager naar de volgende pagina gaan', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const page = await pager.getCurrentPageNumber();
        assert.isTrue(page == 1);

        await pager.volgende();
        const nextPage = await pager.getCurrentPageNumber();
        
        assert.isTrue(nextPage == 2);
        await pager.reset();
    });

    it('als ik van de eerste pagina naar de volgende ga, dan verschijnt de vorige-link', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.volgende();
        await (await pager._pageBackLink()).isDisplayed();
        await pager.reset();
    });

    it('als ik kan op vorige klik dan zal de pager naar de vorige pagina gaan', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const currentPage = await pager.getCurrentPageNumber();
        assert.isTrue(currentPage == 1);
        await pager.volgende();
        const nextPage = await pager.getCurrentPageNumber();
        assert.isTrue(nextPage == 2);
        await pager.vorige();
        const previousPage = await pager.getCurrentPageNumber();
        assert.isTrue(previousPage == 1);
    });

    it('als ik van pagina verwissel, worden de bounds geupdate', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const results = await pager.getTotalOfDisplayedResults();
        assert.isTrue(results == 10);
        await pager.volgende();
        const resultsAfterNavigation = await pager.getTotalOfDisplayedResults();
        assert.isTrue(resultsAfterNavigation == 20);
        await pager.reset();
    });

    it('ik kan naar een pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToPage('7');
        const currentPage = await pager.getCurrentPageNumber();
        assert.isTrue(currentPage == 7);
        await pager.reset();
    });

    it('ik kan naar de laatste pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        const currentPage = await pager.getCurrentPageNumber();
        assert.isTrue(currentPage == 10);
        await pager.reset();
    });

    it('ik kan naar de eerste pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        const currentPage = await pager.getCurrentPageNumber();
        assert.isTrue(currentPage == 10);
        await pager.goToFirstPage();
        const firstPage = await pager.getCurrentPageNumber();
        assert.isTrue(firstPage == 1);
    });

    it('ik kan het totale aantal resultaten opvragen', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const totalResults = await pager.getTotalResults();
        assert.isTrue(totalResults == 100);
    });

    it('ik kan het totale aantal zichtbare resultaten opvragen', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        const totalVisibileResults = await pager.getTotalOfDisplayedResults();
        assert.isTrue(totalVisibileResults == 10);
    });

});
