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

    async getSinglePager() {
        return this._getPager('#pager-single');
    }

    async getPagerZonderPaginaItems() {
        return this._getPager('#pager-no-pagination');
    }

    async getPagerEventListener() {
        return this._getPager('#pager-event-listener');
    }
    
    async load() {
        await super.load(Config.baseUrl + '/demo/vl-pager.html');
    }
}

module.exports = VlPagerPage;
