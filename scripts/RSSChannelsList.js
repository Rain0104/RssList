(function () {

    function RSSList() {
        this.feednamiComponent = window.RSSChannelsApp.Feednami;
        this.activeChannelsList = [];
        this.listContainer = document.querySelector('.channels_list');
        this.addChannelFormContainer = document.querySelector('.add_channel_form_container');
        this.channelsNumberContainer = document.querySelector('.channels_number');
        this.channelTemplate = document.querySelector('.channel_item_template');
        this.addChannelButton = document.querySelector('.add');
        this.addChannelMessage = document.querySelector('.add_channel_msg');

        this.addChannelForm = document.querySelector('.new_channel_form');
        this.newChannelNameInput = this.addChannelForm.querySelector('input[name="newChannelName"]');
        this.newChannelUrlInput = this.addChannelForm.querySelector('input[name="newChannelUrl"]');

        this.activeChannel = {};
        this.activeMessage = {};

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
            // localStorage.clear();
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
            var channelName = this.channelTemplate.content.querySelector('.channel_name');

            var channelItemContainer = this.channelTemplate.content.querySelector('.channel_item');

            var channelRemoveButton = this.channelTemplate.content.querySelector('.remove');

            var channelEditButton = this.channelTemplate.content.querySelector('.edit');

            var channelStatisticButton = this.channelTemplate.content.querySelector('.statistic');

            channelName.textContent = channelInfo.title;
            channelItemContainer.setAttribute('data-channel-url', channelInfo.url);
            channelItemContainer.setAttribute('data-channel-title', channelInfo.title);

            channelRemoveButton.setAttribute('data-channel-title', channelInfo.title);
            channelEditButton.setAttribute('data-channel-title', channelInfo.title);
            channelStatisticButton.setAttribute('data-channel-title', channelInfo.title);

            var clone = document.importNode(this.channelTemplate.content, true);

            this.listContainer.appendChild(clone);
        },

        onChannelItemClick: function (channelItem) {
            var url = channelItem.getAttribute('data-channel-url');
            var title = channelItem.getAttribute('data-channel-title');
            var feeds = this.feednamiComponent.loadFeed(url);
            this.activeChannel = {title: title, feeds: feeds};
        },

        updateChannelsList: function () {
            localStorage.setItem('rssChannelsList', JSON.stringify(this.activeChannelsList));
            console.log('updated local storage');
        },


        validateChannelInputsValues: function (channel) {
            if (!channel.title || !channel.url) {
                this.addChannelMessage.textContent = 'Please fill all inputs';
            } else if (this.findChannel(channel.title) !== null) {
                this.addChannelMessage.textContent = 'Please write other title';
            } else if (!this.validateUrl(channel.url)) {
                this.addChannelMessage.textContent = 'Please write valid url';
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
            if (this.validateChannelInputsValues(channel)) {
                this.activeChannelsList.push(channel);
                this.showChannelsNumber();
                this.createChannelItem(channel);
                this.updateChannelsList();
            }
        },

        onChannelRemove: function (event, channelItem) {
            event.stopPropagation();
            var parent = event.target.parentNode;
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

        onChannelEdit: function (name) {

        },

        onChannelStatistic: function () {
            this.channelStatistic = {feedsNumber: this.activeChannel.feeds.length};
        },

        getChannelAuthors: function () {
        }
    };

    window.RSSChannelsApp.RSSList = new RSSList();

})();