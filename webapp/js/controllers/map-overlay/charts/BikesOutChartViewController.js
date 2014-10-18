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
    var _chartType = NumberOfBikesOut.DAY_OF_WEEK;

    // Column chart
    var _columnChart;

    // Buttons
    var _dayOfWeekButton;
    var _hourOfDayButton;
    var _dayOfYearButton;

    // Paddings
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

        // Update chart
        var chartPad = {left: 0, right: 0, top: 30, bottom: 0};
        _columnChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);
        updateData();

        // Call super
        super_updateView.call(self);
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var updateData = function() {
        switch(_chartType) {
            case NumberOfBikesOut.DAY_OF_WEEK:
                console.log(NumberOfBikesOut.DAY_OF_WEEK);
                var startDate = self.getModel().getTimeModel().getStartDate();
                var endDate = self.getModel().getTimeModel().getEndDate();
                self.getModel().getDBModel().getTripsCountByDayOfTheWeek(startDate, endDate, function(json) {
                    var xValues = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    var tmp = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    var yValues = [];
                    json.forEach(function(day) {
                        var index = tmp.indexOf(day["day_name"]);
                        yValues[index] = day["count"];
                    });
                    _columnChart.setData(xValues, yValues, "WEEK DAY", "BIKES OUT", ["#a6bddb"]);
                });

                break;
            case NumberOfBikesOut.HOUR_OF_DAY:
                console.log(NumberOfBikesOut.HOUR_OF_DAY);
                _columnChart.setData(["male", "female"], [500, 1000], "DAY HOUR", "BIKES OUT", ["#000000", "#000000"]);
                break;
            case NumberOfBikesOut.DAY_OF_YEAR:
                console.log(NumberOfBikesOut.DAY_OF_YEAR);
                _columnChart.setData(["male", "female"], [500, 1000], "YEAR DAY", "BIKES OUT", ["#000000", "#000000"]);
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

        // Add chart
        _columnChart = new  UIColumnChartViewController(self);
        self.add(_columnChart);

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