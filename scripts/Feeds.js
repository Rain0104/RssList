(function () {
    window.RSSChannelsApp = window.RSSChannelsApp || {};

    function Feed() {
        this.feednami = window.feednami;
    }

    Feed.prototype = {

        loadFeed: function (url) {
            this.feednami.load(url, function (result) {
                if (result.error) {
                    console.log(result.error);
                    return result;

                } else {
                    var entries = result.feed.entries;
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        console.log(entry.title);
                    }
                    return entries;
                }
            })
        }
    };

    window.RSSChannelsApp.Feednami = new Feed();
})();
