/**
 *
 * @param parentController
 * @constructor
 */
function BikesOutChartViewController(parentController) {
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
    var _dayOfWeekButton;
    var _hourOfDayButton;
    var _dayOfYearButton;

    // Padding
    var _padding = {left: 10, top: 20, right: 10, bottom: 10};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 425};

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        var parentWidth = self.getParentController().getView().getViewBoxWidth();
        var parentHeight = self.getParentController().getView().getViewBoxHeight();

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
        _dayOfWeekButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _dayOfWeekButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _hourOfDayButton.getView().setFrame(contentBox.x + buttonsWidth, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _hourOfDayButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _dayOfYearButton.getView().setFrame(contentBox.x + buttonsWidth *2, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _dayOfYearButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        // Update charts
        var chartPad = {left: 0, right: 0, top: 30, bottom: 0};
        _columnChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
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
            case NumberOfBikesOut.DAY_OF_WEEK:
                self.getModel().getDBModel().getTripsCountByDayOfTheWeek(startDate, endDate, function(json) {
                    xValues = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    var tmp = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    yValues = [];
                    json.forEach(function(day) {
                        var index = tmp.indexOf(day["day_name"]);
                        yValues[index] = day["count"];
                    });
                    _columnChart.getView().show();
                    _lineChart.getView().hide();
                    _columnChart.setData(xValues, yValues, "WEEK DAY", "BIKES OUT", ["#3182bd"]);
                });

                break;
            case NumberOfBikesOut.HOUR_OF_DAY:
                self.getModel().getDBModel().getTripsCountByHourOfTheDay(startDate, endDate, function(json) {
                    xValues = [];
                    var hours = 24;
                    for(var h = 1; h < hours; h++) {
                        xValues.push(new Date(0,0,0,h,0));
                    }

                    yValues = [];
                    json.forEach(function(hour) {
                        yValues.push(hour["count"]);
                    });
                    _lineChart.setXScale(d3.time.scale());
                    _lineChart.setXTickFormat(null);
                    _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
                    _lineChart.setXAxisLabel("DAY HOUR");
                    _lineChart.setYAxisLabel("BIKES OUT");
                    _lineChart.removeAllLines();
                    _lineChart.addLine(xValues, yValues, "#3182bd");
                });
                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;
            case NumberOfBikesOut.DAY_OF_YEAR:
                self.getModel().getDBModel().getTripsCountByDayOfTheYear(startDate, endDate, function(json) {
                    xValues = [];
                    var days = TimeModel.daysBetween(startDate, endDate);
                    var tmpDate = new Date(startDate);
                    for(var d = 0; d < days; d++) {
                        tmpDate.setDate(tmpDate.getDate() +1);
                        xValues.push(new Date(tmpDate));
                    }

                    yValues = [];
                    json.forEach(function(day) {
                        yValues.push(parseInt(day["count"]));
                    });
                    _lineChart.setXScale(d3.time.scale());
                    _lineChart.setXTickFormat(d3.time.format("%b"));
                    _lineChart.setXTickAlignment(TickAlignment.LEFT);
                    _lineChart.setXAxisLabel("YEAR");
                    _lineChart.setYAxisLabel("BIKES OUT");
                    _lineChart.removeAllLines();
                    _lineChart.addLine(xValues, yValues, "#3182bd");
                });

                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;
        }
    };

    var addBehaviors = function() {
        _dayOfWeekButton.onClick(function() {
            _chartType = NumberOfBikesOut.DAY_OF_WEEK;
            _dayOfWeekButton.select();
            _hourOfDayButton.deselect();
            _dayOfYearButton.deselect();
            updateData();
        });

        _hourOfDayButton.onClick(function() {
            _chartType = NumberOfBikesOut.HOUR_OF_DAY;
            _dayOfWeekButton.deselect();
            _hourOfDayButton.select();
            _dayOfYearButton.deselect();
            updateData();
        });

        _dayOfYearButton.onClick(function() {
            _chartType = NumberOfBikesOut.DAY_OF_YEAR;
            _dayOfWeekButton.deselect();
            _hourOfDayButton.deselect();
            _dayOfYearButton.select();
            updateData();
        });
    };

    var init = function() {
        self.getView().addClass("bikes-out-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add column chart
        _columnChart = new  UIColumnChartViewController(self);
        self.add(_columnChart);

        // Add line chart
        _lineChart = new UILineChartViewController(self);
        self.add(_lineChart);

        // Add buttons
        _dayOfWeekButton = new UIButtonViewController(self);
        _dayOfWeekButton.setTitle(NumberOfBikesOut.DAY_OF_WEEK);
        self.add(_dayOfWeekButton);

        _hourOfDayButton = new UIButtonViewController(self);
        _hourOfDayButton.setTitle(NumberOfBikesOut.HOUR_OF_DAY);
        self.add(_hourOfDayButton);

        _dayOfYearButton = new UIButtonViewController(self);
        _dayOfYearButton.setTitle(NumberOfBikesOut.DAY_OF_YEAR);
        self.add(_dayOfYearButton);

        // Set start chart
        _chartType = NumberOfBikesOut.DAY_OF_WEEK;
        _dayOfWeekButton.select();

        addBehaviors();
    } ();
}

var NumberOfBikesOut = {
    DAY_OF_WEEK: "Day of week",
    HOUR_OF_DAY: "Hours of day",
    DAY_OF_YEAR: "Day of year"
};

Utils.extend(BikesOutChartViewController, ChartViewController);

// USEFUL
//var parseDate = d3.time.format("%d-%b-%y").parse;