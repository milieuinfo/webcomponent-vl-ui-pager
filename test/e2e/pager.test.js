
const { assert, driver } = require('vl-ui-core').Test;
const VlPagerPage = require('./pages/vl-pager.page');

describe('vl-pager', async () => {
    const vlPagerPage = new VlPagerPage(driver);

    before(() => {
        return vlPagerPage.load();
    });

});
