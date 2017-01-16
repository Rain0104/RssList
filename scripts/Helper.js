(function () {

    function Helper() {
    }

    Helper.prototype = {

        updateChannelsList: function () {
            localStorage.setItem('rssChannelsList', JSON.stringify(this.activeChannelsList));
        },


        validateUrl: function (userInputUrl) {
            var res = userInputUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (res === null) {
                return false;
            } else {
                return true;
            }
        },

        validateChannelInputsValues: function (channel, msgContainer) {
            if (!channel.title || !channel.url) {
                msgContainer.textContent = 'Please fill all inputs';
            } else if (this.findChannel(channel.title) !== null) {
                msgContainer.textContent = 'Please write other title';
            } else if (!this.helperComponent.validateUrl(channel.url)) {
                msgContainer.textContent = 'Please write valid url';
            } else {
                return true
            }
        },

        hideElement: function (element) {
            element.classList.add('hidden');
        },

        showElement: function (element) {
            element.classList.remove('hidden');
        },

        removeElementChild: function (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        },

        setEmptyContent: function (element) {
            element.textContent = '';
        },

        getFeedLetters: function (feedSummary) {
            var letters = {};
            var tmp = 0;
            for (var i = 0, nextChar = ''; nextChar = feedSummary.charAt(i).toLowerCase(); i++) {
                if (nextChar === '<') {
                    tmp++;
                } else if (nextChar === '>') {
                    tmp++;
                }
                if (nextChar.match(/[a-z]/i)) {
                    if (!letters.hasOwnProperty(nextChar)) {
                        letters[nextChar] = 0;
                    }
                    letters[nextChar]++;
                }
            }
            return letters;
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

    window.RSSChannelsApp.Helper = new Helper();
})();