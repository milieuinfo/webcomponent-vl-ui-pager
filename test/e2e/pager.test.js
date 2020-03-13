const { assert, driver } = require('vl-ui-core').Test.Setup;
const VlPagerPage = require('./pages/vl-pager.page');
const { By } = require('vl-ui-core').Test.Setup;

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

    it('Als gebruiker zie ik dat als ik van de eerste pagina naar de volgende ga, dat de vorige-link dan verschijnt', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.isFalse(pager.isPageBackDisplayed());
        await pager.goToNextPage();
        await assert.eventually.isTrue(pager.isPageBackDisplayed());
        await pager.reset();
    });

    it('Als gebruiker zie ik dat als ik van de laatste pagina naar de vorige ga, dat de volgende-link dan verschijnt', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        await assert.eventually.isFalse(pager.isPageNextDisplayed());
        await pager.goToPreviousPage();
        await assert.eventually.isTrue(pager.isPageNextDisplayed());
        await pager.reset();
    });

    it('Als gebruiker zie ik dat, als ik van pagina verwissel, de range wordt geüpdatet', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '1', '10');
        await pager.goToNextPage();
        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '11', '20');
        await pager.reset();
    });

    it('Als gebruiker kan ik naar een pagina navigeren', async () => {
        const pageNumber = 7;
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToPage(pageNumber);
        await assert.eventually.equal(pager.getCurrentPage(), pageNumber);
        await pager.reset();
    });

    it('Als gebruiker kan ik naar de laatste pagina en naar de eerste pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToLastPage();
        await assert.eventually.equal(pager.getCurrentPage(), 10);
        await pager.goToFirstPage();
        await assert.eventually.equal(pager.getCurrentPage(), 1);
        await pager.reset();
    });

    it('Als gebruiker zie ik kan het totaal aantal resultaten', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getTotalItems(), 100);
    });

    it('Als gebruiker zie ik hoeveel items zichtbaar zijn', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getItemsPerPage(), 10);
    });

    it ('Als gebruiker zie ik dat een default pager left gealigneerd is', async() => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.isTrue(pager.isAlignedLeft());
    });

    it('Als gebruiker zie ik een pager gecentreerd staat', async() => {
        const pager = await vlPagerPage.getPagerCenter();
        await assert.eventually.isTrue(pager.isAlignedCenter());
    });

    it('Als gebruiker zie ik een pager rechts gealigneerd staat', async() => {
        const pager = await vlPagerPage.getPagerRight();
        await assert.eventually.isTrue(pager.isAlignedRight());
    });

    it('Als gebruiker kan ik op volgende en vorige pagina klikken als de paginatie gedisabled is', async() => {
        const pager = await vlPagerPage.getPagerZonderPaginaItems();
        await assert.eventually.isTrue(pager.isPaginationDisabled());
        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '1', '10');
        await pager.goToNextPage();
        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '11', '20');
        await pager.goToPreviousPage();
        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '1', '10');
    });


    it('Als gebruiker zie ik de range en het totaal aantal items voor een single page resultaat', async() => {
        const pager = await vlPagerPage.getSinglePager();

        await assertRangeMinMaxIsEqualTo(await pager.getRange(), '1', '10');
        await assert.eventually.equal(pager.getItemsPerPage(), 10);
        await assert.eventually.equal(pager.getTotalItems(), 10);
        await assert.eventually.isFalse(pager.isPaginationDisabled());
    });

    it('Als gebruiker zie ik dat de pager elke keer als er data verandert een event uitstuurt', async() => {
        const pager = await vlPagerPage.getPagerEventListener();
        const logElement = await vlPagerPage.getPagerEventListenerLog()
        await assert.eventually.equal(logElement.getText(), "");
        await pager.goToNextPage();
        await assert.eventually.equal(logElement.getText(), '{"currentPage":2,"totalPage":10,"itemsPerPage":10,"totalItems":100}');
        await pager.goToPreviousPage();
        await assert.eventually.equal(logElement.getText(), '{"currentPage":1,"totalPage":10,"itemsPerPage":10,"totalItems":100}');
        await pager.goToPage(2);
        await assert.eventually.equal(logElement.getText(), '{"currentPage":2,"totalPage":10,"itemsPerPage":10,"totalItems":100}');
    });
    
    async function assertRangeMinMaxIsEqualTo(range, minimum, maximum) {
        await assert.equal(range.minimum, minimum);
        await assert.equal(range.maximum, maximum)
    }
});
