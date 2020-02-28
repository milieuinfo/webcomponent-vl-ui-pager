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

    it('Als gebruiker zie ik dat als ik van de eerste pagina naar de volgende ga, dat de vorige-link dan verschijnt', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToNextPage();
        await assert.eventually.isTrue( (await pager._pageBackLink()).isDisplayed());
        await pager.reset();
    });

    it('Als gebruiker zie ik dat, als ik van pagina verwissel, de range wordt geüpdatet', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await assert.eventually.equal(pager.getRange(), "1-10");
        await pager.goToNextPage();
        await assert.eventually.equal(pager.getRange(), "11-20");
        await pager.reset();
    });

    it('Als gebruiker kan ik naar een pagina navigeren', async () => {
        const pager = await vlPagerPage.getDefaultPager();
        await pager.goToPage('7');
        await assert.eventually.equal(pager.getCurrentPage(), 7);
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
        await assert.eventually.equal(pager.getItemsPerpage(), 10);
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

        await assert.eventually.equal(pager.getRange(), "1-10");
        await pager.goToNextPage();
        await assert.eventually.equal(pager.getRange(), "11-20");
        await pager.goToPreviousPage();
        await assert.eventually.equal(pager.getRange(), "1-10");

    });

    
});
