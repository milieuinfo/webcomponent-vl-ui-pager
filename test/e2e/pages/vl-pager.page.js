const VlPager = require('../components/vl-pager');
const { Page } = require('vl-ui-core');
const { Config } = require('vl-ui-core');

class VlPagerPage extends Page {
    async _getPager(selector) {
        return new VlPager(this.driver, selector);
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-pager.html');
    }
}

module.exports = VlPagerPage;
