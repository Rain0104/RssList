(function () {
    window.RSSChannelsApp = window.RSSChannelsApp || {};

    function Visualization() {
        this.chartContainer = document.querySelector('.chart_container');
        this.feedStatisticsContainer = document.querySelector('.feed_statistic_container');
        this.init();
    }

    Visualization.prototype = {

        init: function () {
            google.charts.load('current', {'packages': ['corechart']});
        },

        createChart: function (letters) {
            this.cleanChart();

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Letter');
            data.addColumn('number', 'Count');

            var transformed = [];
            for (var next in letters) {
                if (letters.hasOwnProperty(next)) {
                    transformed.push([next, letters[next]]);
                }
            }
            data.addRows(transformed);
            var chartHeight = this.chartContainer.getAttribute('height');
            var options = {
                'title': 'Letter Statistics',
                'height': chartHeight
            };

            this.feedStatisticsChart = new google.visualization.PieChart(this.chartContainer);
            this.feedStatisticsContainer.classList.remove('hidden');
            this.feedStatisticsChart.draw(data, options);
        },

        cleanChart: function() {
            if (this.feedStatisticsChart instanceof google.visualization.PieChart) {
                this.feedStatisticsChart.clearChart();
            }
        }


    };

    window.RSSChannelsApp.GoogleVisualization = new Visualization();
})();
