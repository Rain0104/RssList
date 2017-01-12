(function () {

    function RSSList() {
        this.feednamiComponent = window.RSSChannelsApp.Feednami;
        this.activeChannelsList = [];
        this.listContainer = document.querySelector('.channels_list');
        this.addChannelForm = document.querySelector('.add_channel_form_container');
        this.channelsNumberContainer = document.querySelector('.channels_number');
        this.channelTemplate = document.querySelector('.channel_item_template');

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
            console.log(channelItem);
            var feeds = this.feednamiComponent.loadFeed(url);
            this.activeChannel = {title: title, feeds: feeds};
        },

        updateChannelsList: function () {
            localStorage.setItem('rssChannelsList', JSON.stringify(this.activeChannelsList));
            console.log('updated local storage');
        },

        addChannel: function (channel) {
            this.activeChannelsList.push(channel);
            this.updateChannelsList();
        },
        onCancelAddChannel: function () {
            this.addChannelForm.classList.add('hidden');
            // hide  form
        },
        onAddChannel: function () {
            // show  form
            this.addChannelForm.classList.remove('hidden');
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
            var len = this.activeChannelsList;
            for (var i = 0; i < len; i++) {
                if (this.activeChannelsList[i].title === title) {
                    return i;
                }
            }
        },

        onChannelEdit: function (name) {

        },

        onChannelStatistic: function () {

            this.channelStatistic = {feedsNumber: this.activeChannel.feeds.length};

        },

        getChannelAuthors: function () {
        },

        showMessage: function () {
        }
    };

    window.RSSChannelsApp.RSSList = new RSSList();

})();