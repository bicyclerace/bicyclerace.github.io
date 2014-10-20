/**
 * @class RidesDistributionChartViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function RidesDistributionChartViewController(parentController) {
    // Call super constructor
    ChartViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;

    // Type of visualization
    var _chartType;

    // Column chart
    var _columnChart;

    // Line chart
    var _lineChart;

    // Buttons
    var _distanceButton;
    var _timeButton;
    var _bikeButton;

    // Metrics
    var _milesButton;
    var _kmButton;

    var _distanceMetric;

    var DistanceMetrics = {
        MILES: "Miles",
        KM: "km"
    };

    // Padding
    var _padding = {left: 10, top: 20, right: 10, bottom: 10};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 425};

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        //var parentWidth = self.getParentController().getView().getViewBoxWidth();
        //var parentHeight = self.getParentController().getView().getViewBoxHeight();

        var contentBox = {
            x: _padding.left,
            y: _padding.top,
            width: self.getView().getViewBoxWidth() - _padding.left - _padding.right,
            height: self.getView().getViewBoxHeight() - _padding.top - _padding.bottom
        };

        var heightParts = 6;
        var heightUnit = contentBox.height / heightParts;

        // Update buttons
        var buttonsWidth = contentBox.width / 3;
        _distanceButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _distanceButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _timeButton.getView().setFrame(contentBox.x + buttonsWidth, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _timeButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _bikeButton.getView().setFrame(contentBox.x + buttonsWidth *2, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _bikeButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        // Update metric buttons
        var distButton = {width: buttonsWidth/4, height: heightUnit};
        var start = {
            x: contentBox.width - (distButton.width * 3),
            y: contentBox.y
        };
        _milesButton.getView().setFrame(start.x, start.y, distButton.width, distButton.height);
        _milesButton.getView().setViewBox(0, 0, distButton.width, distButton.height);

        _kmButton.getView().setFrame(start.x + distButton.width, start.y, distButton.width, distButton.height);
        _kmButton.getView().setViewBox(0, 0, distButton.width, distButton.height);





        // Update charts
        var chartPad = {left: 0, right: 0, top: 30, bottom: 0};
        _columnChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _columnChart.getView().setViewBox(0,
                0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setViewBox(0,
                0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        updateData();

        // Call super
        super_updateView.call(self);
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var updateData = function() {
        var startDate = self.getModel().getTimeModel().getStartDate();
        var endDate = self.getModel().getTimeModel().getEndDate();
        var xValues;
        var yValues;

        switch(_chartType) {
            case RidesDistribution.TRIP_DISTANCE:
                self.getModel().getDBModel().getDistanceDistribution(function(json) {
                    xValues = [];
                    yValues = [];
                    json.forEach(function(group) {
                        var distance = parseInt(group["distance"]);
                        if(distance <= 10000) {
                            if(_distanceMetric == DistanceMetrics.MILES) {
                                distance = distance * 0.000621371;
                            } else {
                                distance = distance / 1000;
                            }
                            xValues.push(distance);
                            yValues.push(parseInt(group["count"]));
                        }
                    });

                    _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
                    _lineChart.removeAllLines();
                    _lineChart.setTitle("TRIPS COUNT BY DISTANCE");
                    _lineChart.setXAxisLabel("DISTANCE");
                    _lineChart.setYAxisLabel("TRIPS COUNT");
                    _lineChart.removeAllLines();
                    _lineChart.addLine(xValues, yValues, "#3182bd");
                });

                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;
            case RidesDistribution.TRIP_TIME:
                self.getModel().getDBModel().getTripsDurationDistribution(function(json) {
                    xValues = [];
                    yValues = [];
                    var aggregateCount = 0;
                    json.forEach(function(group) {
                        var minutes = parseInt(group["duration_in_minutes"]);
                        var count = parseInt(group["count"]);
                        if(minutes <= 60) {
                            xValues.push(group["duration_in_minutes"]);
                            yValues.push(count);
                        } else {
                            aggregateCount += count;
                        }
                    });
                    xValues.push(">60");
                    yValues.push(aggregateCount);

                    _columnChart.setTitle("TRIPS COUNT BY TIME");
                    _columnChart.setData(xValues, yValues, "TIME", "TRIPS COUNT", ["#3182bd"]);
                });

                _columnChart.getView().show();
                _lineChart.getView().hide();
                break;
            case RidesDistribution.BIKE_DISTANCE:
                self.getModel().getDBModel().getDistanceByBikeDistribution(function(json) {
                    xValues = [];
                    yValues = [];
                    json.forEach(function(group) {
                        var distance = parseInt(group["distance"]);
                        //if(distance <= 10000) {
                            if(_distanceMetric == DistanceMetrics.MILES) {
                                distance = distance * 0.000621371;
                            } else {
                                distance = distance / 1000;
                            }
                            xValues.push(distance);
                            yValues.push(parseInt(group["count"]));
                        //}
                    });

                    _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
                    _lineChart.removeAllLines();
                    _lineChart.setTitle("BIKES COUNT BY DISTANCE");
                    _lineChart.setXAxisLabel("DISTANCE");
                    _lineChart.setYAxisLabel("BIKES COUNT");
                    _lineChart.removeAllLines();
                    _lineChart.addLine(xValues, yValues, "#3182bd");
                });

                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;
        }
    };

    var addBehaviors = function() {
        _distanceButton.onClick(function() {
            _chartType = RidesDistribution.TRIP_DISTANCE;
            _distanceButton.select();
            _timeButton.deselect();
            _bikeButton.deselect();
            _kmButton.getView().show();
            _milesButton.getView().show();
            updateData();
        });

        _timeButton.onClick(function() {
            _chartType = RidesDistribution.TRIP_TIME;
            _distanceButton.deselect();
            _timeButton.select();
            _bikeButton.deselect();
            _kmButton.getView().hide();
            _milesButton.getView().hide();
            updateData();
        });

        _bikeButton.onClick(function() {
            _chartType = RidesDistribution.BIKE_DISTANCE;
            _distanceButton.deselect();
            _timeButton.deselect();
            _bikeButton.select();
            _kmButton.getView().show();
            _milesButton.getView().show();
            updateData();
        });

        _milesButton.onClick(function() {
            _milesButton.select();
            _kmButton.deselect();
            _distanceMetric = DistanceMetrics.MILES;
            updateData();
        });

        _kmButton.onClick(function() {
            _milesButton.deselect();
            _kmButton.select();
            _distanceMetric = DistanceMetrics.KM;
            updateData();
        });
    };

    var init = function() {
        self.getView().addClass("rides-distribution-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add column chart
        _columnChart = new  UIColumnChartViewController(self);
        self.add(_columnChart);

        // Add line chart
        _lineChart = new UILineChartViewController(self);
        self.add(_lineChart);

        // Add buttons
        _distanceButton = new UIButtonViewController(self);
        _distanceButton.setTitle(RidesDistribution.TRIP_DISTANCE);
        self.add(_distanceButton);

        _timeButton = new UIButtonViewController(self);
        _timeButton.setTitle(RidesDistribution.TRIP_TIME);
        self.add(_timeButton);

        _bikeButton = new UIButtonViewController(self);
        _bikeButton.setTitle(RidesDistribution.BIKE_DISTANCE);
        self.add(_bikeButton);

        // Setup change unit button
        _milesButton = new UIButtonViewController(self);
        _milesButton.setTitle("Miles");
        _milesButton.select();
        self.add(_milesButton);

        _kmButton = new  UIButtonViewController(self);
        _kmButton.setTitle("Km");
        self.add(_kmButton);

        // Set start chart
        _chartType = RidesDistribution.TRIP_DISTANCE;
        _distanceButton.select();

        // Set chart distance metric
        _distanceMetric = DistanceMetrics.MILES;

        self.setSize(PopupController.SIZE.DOUBLE);

        addBehaviors();
    } ();
}

var RidesDistribution = {
    TRIP_DISTANCE: "Trip distance",
    TRIP_TIME: "Trip time",
    BIKE_DISTANCE: "Bike distance"
};


Utils.extend(RidesDistributionChartViewController, ChartViewController);

// USEFUL
//var parseDate = d3.time.format("%d-%b-%y").parse;