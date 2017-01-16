(function () {

    function RSSList() {
        this.feednamiComponent = window.RSSChannelsApp.Feednami;
        this.helperComponent = window.RSSChannelsApp.Helper;
        this.googleVisualizationComponent = window.RSSChannelsApp.GoogleVisualization;
        this.activeChannelsList = [];
        this.listContainer = document.querySelector('.channels_list');
        this.feedsContainer = document.querySelector('.feeds_list_container');
        this.feedsList = document.querySelector('.feeds_list');
        this.addChannelFormContainer = document.querySelector('.add_channel_form_container');
        this.channelsNumberContainer = document.querySelector('.channels_number');
        this.channelTemplate = document.querySelector('.channel_item_template');
        this.feedTemplate = document.querySelector('.feed_item_template');
        this.feedMessage = document.querySelector('.feed_message');
        this.channelStatisticContainer = document.querySelector('.channel_statistic_container');
        this.channelStatisticInfo = document.querySelector('.statistic');
        this.channelStatisticTitle = document.querySelector('.channel_statistic_title');
        this.channelMessage = document.querySelector('.channel_statistic_message');
        this.channelFeedsNumber = document.querySelector('.channel_feeds_number');
        this.channelFeedsAuthors = document.querySelector('.channel_feeds_authors');
        this.addChannelButton = document.querySelector('.add');
        this.addChannelMessage = document.querySelector('.add_channel_msg');
        this.addChannelForm = document.querySelector('.new_channel_form');
        this.feedStatisticsContainer = document.querySelector('.feed_statistic_container');
        this.newChannelNameInput = this.addChannelForm.querySelector('input[name="newChannelName"]');
        this.newChannelUrlInput = this.addChannelForm.querySelector('input[name="newChannelUrl"]');
        this.activeFeeds = [];
        this.activeChannel = {};
        this.defaultRSSList = [
            {title: 'Mozzila Hacks', url: 'http://hacks.mozilla.org/feed/'},
            {title: 'Lea Verou', url: 'http://feeds2.feedburner.com/leaverou'},
            {title: 'John Papa', url: 'http://feeds.feedburner.com/johnpapa/'},
            {title: 'html5rocks', url: 'http://feeds.feedburner.com/html5rocks'},
            {title: 'Echo js', url: 'http://http://www.echojs.com/rss'}];
        this.feedStatisticsChart = {};
        this.init();
    }

    RSSList.prototype = {
        init: function () {
            var rssList = localStorage.getItem('rssChannelsList');
            if (rssList) {
                this.activeChannelsList = JSON.parse(rssList);
            } else {
                localStorage.setItem('rssChannelsList', JSON.stringify(this.defaultRSSList));
                this.activeChannelsList = this.defaultRSSList;
            }
            this.showChannelsNumber();
            this.showChannelsList();
        },

        showChannelsNumber: function () {
            var channelsNumber = this.activeChannelsList.length;
            this.channelsNumberContainer.textContent = channelsNumber;
        },

        showChannelsList: function () {
            var len = this.activeChannelsList.length;
            for (var i = 0; i < len; i++) {
                var channelInfo = this.activeChannelsList[i];
                this.createChannelItem(channelInfo);
            }
        },

        createChannelItem: function (channelInfo) {
            var channelItem = this.channelTemplate.content.querySelector('.channel_item');
            var channelName = this.channelTemplate.content.querySelector('.channel_name');
            var channelNameContainer = this.channelTemplate.content.querySelector('.channel_name_container');
            var channelRemoveButton = this.channelTemplate.content.querySelector('.remove');
            var channelEditButton = this.channelTemplate.content.querySelector('.edit');
            var channelStatisticButton = this.channelTemplate.content.querySelector('.statistic');
            channelName.textContent = channelInfo.title;
            channelItem.setAttribute('data-channel-url', channelInfo.url);
            channelItem.setAttribute('data-channel-title', channelInfo.title);
            channelNameContainer.setAttribute('data-channel-url', channelInfo.url);
            channelNameContainer.setAttribute('data-channel-title', channelInfo.title);
            channelRemoveButton.setAttribute('data-channel-title', channelInfo.title);
            channelEditButton.setAttribute('data-channel-title', channelInfo.title);
            channelEditButton.setAttribute('data-channel-url', channelInfo.url);
            channelStatisticButton.setAttribute('data-channel-url', channelInfo.url);
            channelStatisticButton.setAttribute('data-channel-title', channelInfo.title);
            var clone = document.importNode(this.channelTemplate.content, true);
            this.listContainer.appendChild(clone);
        },

        createFeedItem: function (feed, index) {
            var feedITitle = this.feedTemplate.content.querySelector('.feed_title');
            var feedIAuthor = this.feedTemplate.content.querySelector('.feed_author');
            var feedIContent = this.feedTemplate.content.querySelector('.feed_content_container');
            var feedStatisticButton = this.feedTemplate.content.querySelector('.statistic');

            feedStatisticButton.setAttribute('data-feed-index', index);
            feedITitle.textContent = feed.title;
            feedIAuthor.textContent = feed.author;
            this.helperComponent.removeElementChild(feedIContent);
            if (feed.summary) {
                feedIContent.innerHTML += feed.summary;
                this.helperComponent.showElement(feedStatisticButton);
            } else {
                feedIContent.innerHTML += 'Summary is empty';
                this.helperComponent.hideElement(feedStatisticButton);
            }

            feedIContent.innerHTML += '<br/><a href=' + feed.link + '>' + feed.title + '</a>';

            var clone = document.importNode(this.feedTemplate.content, true);
            this.feedsList.appendChild(clone);
        },

        onChannelItemClick: function (channelItem) {
            var that = this;
            var url = channelItem.getAttribute('data-channel-url');
            var title = channelItem.getAttribute('data-channel-title');
            this.helperComponent.removeElementChild(this.feedsList);
            this.activeFeeds = [];
            var feeds = this.feednamiComponent.loadFeed(url);
            this.helperComponent.setEmptyContent(this.feedMessage);
            this.helperComponent.hideElement(this.feedStatisticsContainer);
            this.googleVisualizationComponent.cleanChart();

            feeds.then(function (res) {
                that.activeFeeds = res;
                that.helperComponent.showElement(that.feedsContainer);
                var len = res.length;
                for (var i = 0; i < len; i++) {
                    var feed = res[i];
                    that.createFeedItem(feed, i);
                }
            }).catch(function (err) {
                that.showFeedMessage(err);
            });
        },

        onCancelAddChannel: function () {
            this.newChannelNameInput.value = '';
            this.newChannelUrlInput.value = '';
            this.helperComponent.setEmptyContent(this.addChannelMessage);
            this.helperComponent.hideElement(this.addChannelFormContainer);
            this.helperComponent.showElement(this.addChannelButton);
        },

        onAddChannel: function () {
            this.helperComponent.showElement(this.addChannelFormContainer);
            this.helperComponent.hideElement(this.addChannelButton);
        },

        onChannelRemove: function (event, channelItem) {
            event.stopPropagation();
            var parent = event.target.parentNode.parentNode;
            var title = channelItem.getAttribute('data-channel-title');
            var index = this.findChannel(title);
            this.activeChannelsList.splice(index, 1);
            parent.parentNode.removeChild(parent);
            this.helperComponent.updateChannelsList();
        },

        onFeedStatistic: function (event, feedItem) {
            var feedIndex = feedItem.getAttribute('data-feed-index');
            var feed = this.activeFeeds[feedIndex].summary;
            this.googleVisualizationComponent.createChart(this.helperComponent.getFeedLetters(feed));
        },

        onChannelStatistic: function (event, channelItem) {
            var that = this;
            var url = channelItem.getAttribute('data-channel-url');
            var title = channelItem.getAttribute('data-channel-title');
            var feeds = this.feednamiComponent.loadFeed(url);
            this.clearStatistic();
            this.channelStatisticTitle.textContent = title;
            this.helperComponent.showElement(this.channelStatisticContainer);
            feeds.then(function (res) {
                var authorsNumber = that.helperComponent.getChannelAuthors(res);
                var feedsNumber = res.length;
                that.helperComponent.showElement(that.channelStatisticInfo);
                that.channelStatisticContainer = document.querySelector('.channel_statistic_container');
                that.channelFeedsNumber.textContent = feedsNumber;
                that.channelFeedsAuthors.textContent = authorsNumber
            }).catch(function (err) {
                that.showChannelMessage(err.message);
            });
        },

        onChannelEdit: function (event, channelItem) {
            var title = channelItem.getAttribute('data-channel-title');
            var url = channelItem.getAttribute('data-channel-url');
            var controlsContainer = event.target.parentNode;
            var form = controlsContainer.parentNode.querySelector('.edit_channel_form');
            var titleContainer = controlsContainer.parentNode.querySelector('.channel_name_container');
            var editTitleInput = form.querySelector('input[name="editChannelName"]');
            var editUrlInput = form.querySelector('input[name="editChannelUrl"]');
            editTitleInput.value = title;
            editUrlInput.value = url;
            this.helperComponent.hideElement(titleContainer);
            this.helperComponent.hideElement(controlsContainer);
            this.helperComponent.showElement(form);
        },

        onEditCancel: function (event) {
            event.stopPropagation();
            var form = event.target.parentNode;
            var controlsContainer = form.parentNode.querySelector('.channel_controls');
            var titleContainer = form.parentNode.querySelector('.channel_name_container');
            var editTitleInput = form.querySelector('input[name="editChannelName"]');
            var editUrlInput = form.querySelector('input[name="editChannelUrl"]');
            var msgContainer = form.querySelector('.edit_channel_msg');
            this.helperComponent.setEmptyContent(msgContainer);
            editTitleInput.value = '';
            editUrlInput.value = '';
            this.helperComponent.showElement(titleContainer);
            this.helperComponent.showElement(controlsContainer);
            this.helperComponent.hideElement(form);
        },

        addChannel: function () {
            var channel = {title: this.newChannelNameInput.value, url: this.newChannelUrlInput.value};
            if (this.helperComponent.validateChannelInputsValues(channel, this.addChannelMessage.textContent)) {
                this.activeChannelsList.push(channel);
                this.showChannelsNumber();
                this.createChannelItem(channel);
                this.helperComponent.updateChannelsList();
                this.onCancelAddChannel();
            }
        },

        editChannel: function (event) {
            event.stopPropagation();
            var form = event.target.parentNode;
            var controlsContainer = form.parentNode.querySelector('.channel_controls');
            var titleContainer = form.parentNode.querySelector('.channel_name_container');
            var title = titleContainer.querySelector('.channel_name');
            var editTitleInput = form.querySelector('input[name="editChannelName"]');
            var editUrlInput = form.querySelector('input[name="editChannelUrl"]');
            var msgContainer = form.querySelector('.edit_channel_msg');
            var channelItem = form.parentNode;
            var updatedChannel = {title: editTitleInput.value, url: editUrlInput.value};
            channelItem.setAttribute('data-channel-title', updatedChannel.title);
            channelItem.setAttribute('data-channel-url', updatedChannel.url);
            this.helperComponent.setEmptyContent(msgContainer);
            if (this.helperComponent.validateChannelInputsValues(updatedChannel, msgContainer)) {
                title.textContent = editTitleInput.value;
                this.activeChannelsList.splice(this.activeChannel.index, 1, updatedChannel);
                this.helperComponent.updateChannelsList();
                titleContainer.setAttribute('data-channel-url', updatedChannel.url);
                titleContainer.setAttribute('data-channel-title', updatedChannel.title);
                editTitleInput.value = '';
                editUrlInput.value = '';
                this.helperComponent.showElement(titleContainer);
                this.helperComponent.showElement(controlsContainer);
                this.helperComponent.hideElement(form);
            }
        },

        findChannel: function (title) {
            var len = this.activeChannelsList.length;
            var index = null;
            for (var i = 0; i < len; i++) {
                if (this.activeChannelsList[i].title === title) {
                    return index = i;
                }
            }
            return index;
        },

        showChannelMessage: function (msg) {
            this.channelMessage.textContent = msg;
        },

        showFeedMessage: function (err) {
            this.feedMessage.textContent = err.message;
        },

        clearStatistic: function () {
            this.helperComponent.setEmptyContent(this.channelFeedsNumber);
            this.helperComponent.setEmptyContent(this.channelFeedsAuthors);
            this.helperComponent.hideElement(this.channelStatisticInfo);
            this.helperComponent.setEmptyContent(this.channelMessage);
        },

        onChartClose: function () {
            this.helperComponent.hideElement(this.feedStatisticsContainer);
            this.googleVisualizationComponent.cleanChart();
        },

        onChannelStatisticClose: function () {
            this.helperComponent.hideElement(this.channelStatisticContainer);
        },

        onFeedsClose: function () {
            this.helperComponent.hideElement(this.feedsContainer);
        }
    };

    window.RSSChannelsApp.RSSList = new RSSList();

})();