const VlPager = require('../components/vl-pager');
const { Page } = require('vl-ui-core').Test;
const { Config } = require('vl-ui-core').Test;

class VlPagerPage extends Page {
    async _getPager(selector) {
        return new VlPager(this.driver, selector);
    }

    async getDefaultPager() {
        return this._getPager('#pager-default');
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-pager.html');
    }
}

module.exports = VlPagerPage;
