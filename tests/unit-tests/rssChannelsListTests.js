var RSSListHelper = window.RSSChannelsApp.Helper;

QUnit.test('Get only letters from feed', function (assert) {
    var feed = '<p>The <code>@NgModule</code> is a new decorator that has recently been added in Angular.</p>';
    var feedWithSpaces = '     hello    ';
    var feedWithNumber = '1234567890';
    var resultFeedWithTags = {
        a: 7,
        b: 1,
        c: 4,
        d: 7,
        e: 11,
        g: 2,
        h: 3,
        i: 2,
        l: 3,
        m: 1,
        n: 6,
        o: 5,
        p: 2,
        r: 4,
        s: 2,
        t: 5,
        u: 2,
        w: 1,
        y: 1
    };
    var resultFeedWithSpaces = {
        e: 1,
        h: 1,
        l: 2,
        o: 1
    };

    assert.deepEqual(RSSListHelper.getFeedLetters(feed), resultFeedWithTags, 'Feed with tags');
    assert.deepEqual(RSSListHelper.getFeedLetters(feedWithSpaces), resultFeedWithSpaces, 'Feed with spaces');
    assert.deepEqual(RSSListHelper.getFeedLetters(feedWithNumber), {}, 'Feed with numbers');
});

QUnit.test('Get authors number', function (assert) {

    var feedsWithOneAuthor = [{author: 'John Papa'}, {author: "John Papa"}, {author: "John Papa"}, {author: "John Papa"}, {author: "John Papa"}];
    var feedsWithFewAuthor = [{author: 'Paul Lewis'}, {author: 'danielisaksson'}, {author: 'Addy Osmani'}, {author: 'Paul Lewis'}];

    assert.deepEqual(RSSListHelper.getChannelAuthors(feedsWithOneAuthor), 1, 'Feeds with 1 author');
    assert.deepEqual(RSSListHelper.getChannelAuthors(feedsWithFewAuthor), 3, 'Feeds with few authors');

});

QUnit.test('validate Url', function (assert) {

    var validUrl = 'http://hacks.mozilla.org/feed/';
    var invalidUrl = 'kjhjjkh111';

    assert.deepEqual(RSSListHelper.validateUrl(validUrl), true, 'valid url');
    assert.deepEqual(RSSListHelper.validateUrl(invalidUrl), false, 'invalid url');
});
