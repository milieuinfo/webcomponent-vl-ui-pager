const VlPager = require('../components/vl-pager');
const {Page} = require('vl-ui-core').Test;
const {Config} = require('vl-ui-core').Test;
const {VlHeader} = require('vl-ui-header').Test;
const {VlFooter} = require('vl-ui-footer').Test;
const {VlElement} = require('vl-ui-core').Test;

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

  async getPagerEventListenerLog() {
    return new VlElement(this.driver, '#pager-event-listener-log');
  }

  async getPagerCenter() {
    return this._getPager('#pager-center');
  }

  async getPagerRight() {
    return this._getPager('#pager-right');
  }

  async load() {
    await super.load(Config.baseUrl + '/demo/vl-pager.html');
    //header en footer verwijderen, want anders verspringt de pagina eens die geladen wordt
    //beter vervangen door een event om te checken wanneer die geladen is
    const header = await new VlHeader(this.driver);
    const footer = await new VlFooter(this.driver);
    await header.remove();
    await footer.remove();
  }
}

module.exports = VlPagerPage;
