(function () {
    angular.module('analytics')
        .controller('analyticsController', ['$window', 'RoutesService', 'analyticsFactory', function ($window, routesService, analyticsFactory) {
            var vm = this;
            var pieChartHeight = 600;
            var barChartDefaultHeightWithLink = 580;
            var barChartDefaultHeightWithoutLink = 600;
            var barChartBaseHeight = 20;
            var loadingMessage = 'Получение данных…';
            var statusColors = [
                {
                    id: 5,
                    color: '#4800ff',
                },
                {
                    id: 4,
                    color: '#ED1700',
                },
                {
                    id: 3,
                    color: '#9C0015',
                },
                {
                    id: 2,
                    color: '#80C338',
                },
                {
                    id: 1,
                    color: ' #FFC300',
                }
            ];

            vm.pieChartConfig = getPieChartConfig();
            vm.barChartConfig = getBarChartConfig();
            vm.toggleResponsibles = toggleResponsibles;
            vm.showAll = false;
            vm.isMoreExist = false;

            init();

            function getPieChartConfig() {
                return {
                    options: {
                        chart: {
                            type: 'pie'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    distance: -100,
                                    color: 'white',
                                    formatter: function () {
                                        return this.y ? this.y : '';
                                    },
                                },
                                showInLegend: true,
                                point: {
                                    events: {
                                        click: function (event) {
                                            $window.location.href = this.url;
                                        }
                                    },
                                },
                                tooltip: {
                                    pointFormatter: function () {
                                        return this.y;
                                    }
                                },
                                slicedOffset: 5
                            }
                        },
                    },
                    title: {
                        text: ''
                    },
                    size: {
                        height: pieChartHeight
                    },
                    loading: loadingMessage,
                };
            }

            function getBarChartConfig() {
                return {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        plotOptions: {
                            bar: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (event) {
                                            $window.location.href = this.url;
                                        }
                                    },
                                },
                            },
                            series: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    formatter: function () {
                                        return this.y ? this.y : '';
                                    }
                                }
                            }
                        },
                        legend: {
                            enabled: false
                        },
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        labels: {
                            formatter: function () {
                                var maxLength = 40;
                                return this.value.length > maxLength ? this.value.substr(0, maxLength) + "…" : this.value;
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: '',
                        },
                    },
                    size: {
                        height: getBarChartHeight()
                    },
                    loading: loadingMessage,
                };
            }

            function init() {
                initPieChart();
                initBarChart();
            }

            function initPieChart() {
                analyticsFactory.getTasksCountByStatus().success(function (data) {
                    setPieChartData(data);
                });
            }

            function initBarChart() {
                analyticsFactory.getTasksCountByStatusAndResponsible(vm.showAll).success(function (data) {
                    vm.isMoreExist = data.isMoreExist;
                    setBarChartData(data.Result);
                });
            }

            function setPieChartData(data) {
                var seriesData = [];
                angular.forEach(data, function (item) {
                    this.push({
                        url: routesService.createMvc('Task', 'Index').url + '?showStatusId=' + item.StatusId,
                        name: item.StatusName,
                        y: item.TasksCount,
                        color: getStatusColorById(item.StatusId),
                        sliced: true,
                    });
                }, seriesData);

                vm.pieChartConfig.series = [{ data: seriesData }];
                vm.pieChartConfig.loading = false;
            }

            function getStatusColorById(id) {
                return _.find(statusColors, function (statusColor) {
                    return statusColor.id === id;
                }).color;
            }

            function setBarChartData(data) {
                var categories = [];
                var series = angular.copy(statusColors);
                angular.forEach(series, function (item) {
                    item.data = [];
                });

                angular.forEach(data, function (item) {
                    categories.push(item.ResponsibleName);
                    var failedSeries = _.find(series, function (ser) {
                        return ser.id === item.Failed.StatusId;
                    });
                    var inProcessSeries = _.find(series, function (ser) {
                        return ser.id === item.InProcess.StatusId;
                    });
                    var completedSeries = _.find(series, function (ser) {
                        return ser.id === item.Completed.StatusId;
                    });
                    var hotSeries = _.find(series, function (ser) {
                        return ser.id === item.Hot.StatusId;
                    });
                    var formalSeries = _.find(series, function (ser) {
                        return ser.id === item.Formal.StatusId;
                    });

                    setSeriesData(failedSeries, { name: item.Failed.StatusName, value: item.Failed.TasksCount, statusId: item.Failed.StatusId, responsibleId: item.ResponsibleId });
                    setSeriesData(inProcessSeries, { name: item.InProcess.StatusName, value: item.InProcess.TasksCount, statusId: item.InProcess.StatusId, responsibleId: item.ResponsibleId });
                    setSeriesData(completedSeries, { name: item.Completed.StatusName, value: item.Completed.TasksCount, statusId: item.Completed.StatusId, responsibleId: item.ResponsibleId });
                    setSeriesData(hotSeries, { name: item.Hot.StatusName, value: item.Hot.TasksCount, statusId: item.Hot.StatusId, responsibleId: item.ResponsibleId });
                    setSeriesData(formalSeries, { name: item.Formal.StatusName, value: item.Formal.TasksCount, statusId: item.Formal.StatusId, responsibleId: item.ResponsibleId });
                });

                vm.barChartConfig.xAxis.categories = categories;
                vm.barChartConfig.series = series;
                vm.barChartConfig.size.height = getBarChartHeight();
                vm.barChartConfig.loading = false;
            }

            function setSeriesData(series, data) {
                series.name = data.name;
                series.data.push({
                    y: data.value,
                    url: routesService.createMvc('Task', 'Index').url + '?showStatusId=' + data.statusId + '&showResponsibleId=' + data.responsibleId,
                });
            }

            function toggleResponsibles(showAll) {
                vm.barChartConfig.loading = true;
                vm.isMoreExist = true;
                vm.showAll = showAll;
                initBarChart();
            }

            function getBarChartHeight() {
                var defaultHeight = vm.isMoreExist || vm.showAll ? barChartDefaultHeightWithLink : barChartDefaultHeightWithoutLink;
                if (!vm.showAll || !vm.barChartConfig.xAxis.categories) {
                    return defaultHeight;
                }

                var height = barChartBaseHeight * vm.barChartConfig.xAxis.categories.length;
                return height < defaultHeight ? defaultHeight : height;
            }
        }]);
})();