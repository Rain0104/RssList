(function () {

    function RSSList() {
        this.feednamiComponent = window.RSSChannelsApp.Feednami;
        this.activeChannelsList = [];
        this.listContainer = document.querySelector('.channels_list');
        this.addChannelFormContainer = document.querySelector('.add_channel_form_container');
        this.channelsNumberContainer = document.querySelector('.channels_number');
        this.channelTemplate = document.querySelector('.channel_item_template');
        this.feedTemplate = document.querySelector('.feed_item_template');
        this.feedMessage = document.querySelector('.feed_message');
        this.channelStatisticContainer = document.querySelector('.channel_statistic_container');
        this.channelStatisticInfo = document.querySelector('.statistic');
        this.channelMessage = document.querySelector('.channel_statistic_message');
        this.channelFeedsNumber = document.querySelector('.channel_feeds_number');
        this.channelFeedsAuthors = document.querySelector('.channel_feeds_authors');
        this.addChannelButton = document.querySelector('.add');
        this.addChannelMessage = document.querySelector('.add_channel_msg');
        this.addChannelForm = document.querySelector('.new_channel_form');
        this.newChannelNameInput = this.addChannelForm.querySelector('input[name="newChannelName"]');
        this.newChannelUrlInput = this.addChannelForm.querySelector('input[name="newChannelUrl"]');
        this.activeFeeds = {};
        this.defaultRSSList = [
            {title: 'Mozzila Hacks', url: 'http://hacks.mozilla.org/feed/'},
            {title: 'Lea Verou', url: 'http://feeds2.feedburner.com/leaverou'},
            {title: 'John Papa', url: 'http://feeds.feedburner.com/johnpapa/'},
            {title: 'html5rocks', url: 'http://feeds.feedburner.com/html5rocks'},
            {title: 'Echo js', url: 'http://http://www.echojs.com/rss'}];
        this.init();
    }

    RSSList.prototype = {
        init: function () {
            localStorage.clear();
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
            var clone = document.importNode(this.channelTemplate.content, true);
            this.listContainer.appendChild(clone);
        },

        onChannelItemClick: function (channelItem) {
            var than = this;
            var url = channelItem.getAttribute('data-channel-url');
            var title = channelItem.getAttribute('data-channel-title');

            var feeds = this.feednamiComponent.loadFeed(url);
            this.hideFeedMessage();
            feeds.then(function (res) {
                var len = res.length;
                for (var i = 0; i < len; i++) {
                    var feed = res[i];
                    than.createFeedItem(feed);
                }
            }).catch(function (err) {
                than.showFeedMessage(err);
            });
        },

        hideFeedMessage: function () {
            this.feedMessage.textContent = '';
        },

        showFeedMessage: function (err) {
            console.log(err);
            this.feedMessage.textContent = err;
        },

        createFeedItem: function (feed) {
            console.log(feed);
        },

        updateChannelsList: function () {
            localStorage.setItem('rssChannelsList', JSON.stringify(this.activeChannelsList));
            console.log('updated local storage');
        },

        validateChannelInputsValues: function (channel, msgContainer) {
            if (!channel.title || !channel.url) {
                msgContainer.textContent = 'Please fill all inputs';
            } else if (this.findChannel(channel.title) !== null) {
                msgContainer.textContent = 'Please write other title';
            } else if (!this.validateUrl(channel.url)) {
                msgContainer.textContent = 'Please write valid url';
            } else {
                return true
            }
        },

        validateUrl: function (userInputUrl) {
            var res = userInputUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (res === null) {
                return false;
            } else {
                return true;
            }
        },

        onCancelAddChannel: function () {
            this.newChannelNameInput.value = '';
            this.newChannelUrlInput.value = '';
            this.addChannelMessage.textContent = '';
            this.addChannelFormContainer.classList.add('hidden');
            this.addChannelButton.classList.remove('hidden');
        },

        onAddChannel: function () {
            this.addChannelFormContainer.classList.remove('hidden');
            this.addChannelButton.classList.add('hidden');
        },

        addChannel: function () {
            var channel = {title: this.newChannelNameInput.value, url: this.newChannelUrlInput.value};
            if (this.validateChannelInputsValues(channel, this.addChannelMessage.textContent)) {
                this.activeChannelsList.push(channel);
                this.showChannelsNumber();
                this.createChannelItem(channel);
                this.updateChannelsList();
                this.onCancelAddChannel();
            }
        },

        onChannelRemove: function (event, channelItem) {
            event.stopPropagation();
            var parent = event.target.parentNode.parentNode;
            var title = channelItem.getAttribute('data-channel-title');
            var index = this.findChannel(title);
            this.activeChannelsList.splice(index, 1);
            parent.parentNode.removeChild(parent);
            this.updateChannelsList();
        },

        findChannel: function (title) {
            var len = this.activeChannelsList.length;
            var index = null;
            for (var i = 0; i < len; i++) {
                if (this.activeChannelsList[i].title === title) {
                    console.log('found', i);
                    return index = i;
                }
            }
            return index;
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
            titleContainer.classList.add('hidden');
            controlsContainer.classList.add('hidden');
            form.classList.remove('hidden');
        },

        onEditCancel: function (event) {
            event.stopPropagation();
            var form = event.target.parentNode;
            var controlsContainer = form.parentNode.querySelector('.channel_controls');
            var titleContainer = form.parentNode.querySelector('.channel_name_container');
            var editTitleInput = form.querySelector('input[name="editChannelName"]');
            var editUrlInput = form.querySelector('input[name="editChannelUrl"]');
            var msgContainer = form.querySelector('.edit_channel_msg');
            msgContainer.textContent = '';
            editTitleInput.value = '';
            editUrlInput.value = '';
            titleContainer.classList.remove('hidden');
            controlsContainer.classList.remove('hidden');
            form.classList.add('hidden');
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
            msgContainer.textContent = '';
            if (this.validateChannelInputsValues(updatedChannel, msgContainer)) {
                title.textContent = editTitleInput.value;
                this.activeChannelsList.splice(this.activeChannel.index, 1, updatedChannel);
                this.updateChannelsList();
                titleContainer.setAttribute('data-channel-url', updatedChannel.url);
                titleContainer.setAttribute('data-channel-title', updatedChannel.title);
                editTitleInput.value = '';
                editUrlInput.value = '';
                titleContainer.classList.remove('hidden');
                controlsContainer.classList.remove('hidden');
                form.classList.add('hidden');
            }
        },


        onChannelStatistic: function (event, channelItem) {
            var that = this;
            var url = channelItem.getAttribute('data-channel-url');
            var feeds = this.feednamiComponent.loadFeed(url);
            this.hideChannelMessage();
            that.channelFeedsNumber.textContent = '';
            that.channelFeedsAuthors.textContent = '';
            this.channelStatisticInfo.classList.add('hidden');
            this.channelStatisticContainer.classList.remove('hidden');
            feeds.then(function (res) {
                var authorsNumber = that.getChannelAuthors(res);
                var feedsNumber = res.length;
                that.channelStatisticInfo.classList.remove('hidden');
                that.channelStatisticContainer = document.querySelector('.channel_statistic_container');
                that.channelFeedsNumber.textContent = feedsNumber;
                that.channelFeedsAuthors.textContent = authorsNumber
            }).catch(function (err) {
                that.showChannelMessage(err.message);
            });
        },

        onChannelStatisticClose: function () {
            this.channelMessagesNumber = '';
            this.channelMessagesAuthors = '';
            this.channelStatisticContainer.classList.remove('add');
        },

        hideChannelMessage: function () {
            this.channelMessage.textContent = '';
        },


        showChannelMessage: function (msg) {
            this.channelMessage.textContent = msg;
        },

        onFeedStatistic: function (event, title) {

        },

        getChannelAuthors: function (feeds) {
            var len = feeds.length;
            var authorsArray = [];
            for (var i = 0; i < len; i++) {
                var author = feeds[i].author;
                if (authorsArray.indexOf(author) === -1) {
                    authorsArray.push(author);
                }
            }
            return authorsArray.length;
        }
    };

    window.RSSChannelsApp.RSSList = new RSSList();

})();