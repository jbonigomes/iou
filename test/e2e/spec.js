describe('Initial test', function() {
  it('Open the home page and create a new list', function() {
    browser.get('http://localhost:8100/#/app/home');

    element(by.css('.login-button')).click();

    // element(by.model('list.name')).sendKeys('Created from Protractor');


    var listsList = element.all(by.repeater('item in lists.lists'));

    element(by.css('.bar-footer .button')).click();

    // expect(listsList.count()).toEqual(3);
    // expect(listsList.get(3).getText()).toEqual('Created from Protractor');
  });
});
