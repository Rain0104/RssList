(function () {
    window.RSSChannelsApp = window.RSSChannelsApp || {};

    function Feed() {
        this.feednami = window.feednami;
    }

    Feed.prototype = {

        loadFeed: function (url) {
            var that = this;
            var promise = new Promise(function (resolve, reject) {
                that.feednami.load(url, function (result) {
                    if (result.error) {
                        console.log(result.error);
                        reject(result.error);
                    } else {
                        resolve(result.feed.entries);
                    }
                });
            });
            return promise;
        }
    };

    window.RSSChannelsApp.Feednami = new Feed();
})();
