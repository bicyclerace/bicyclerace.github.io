/**
 * @class RiderDemographicsChartViewController
 * @description
 * 
 * @param parentController
 * @constructor
 */
function RiderDemographicsChartViewController(parentController) {
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
    var _genderButton;
    var _ageButton;
    var _userTypeButton;

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
        _genderButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _genderButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _ageButton.getView().setFrame(contentBox.x + buttonsWidth, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _ageButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _userTypeButton.getView().setFrame(contentBox.x + buttonsWidth *2, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _userTypeButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

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
            case RiderDemographics.GENDER:
                self.getModel().getDBModel().getRidersGender(function(json) {
                    xValues = ["Male", "Female", "Unknown"];
                    yValues = [];
                    yValues.push(parseInt(json["Male"]));
                    yValues.push(parseInt(json["Female"]));
                    yValues.push(parseInt(json["Unknown"]));

                    _columnChart.getView().show();
                    _lineChart.getView().hide();
                    _columnChart.setData(xValues, yValues, "GENDER", "TRIPS COUNT", ["#3182bd"]);
                });
                break;
            case RiderDemographics.AGE:
                self.getModel().getDBModel().getRidersAge(function(json) {
                    xValues = [];
                    yValues = [];

                    var age;
                    json.forEach(function(year) {
                        age = endDate.getFullYear() - parseInt(year["birthyear"]);
                        xValues.push(age);
                        yValues.push(parseInt(year["count"]));
                    });

                    xValues.reverse();
                    //_lineChart.setXScale(d3.time.scale());
                    //_lineChart.setXTickFormat(d3.time.format("%yyyy"));
                    _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
                    _lineChart.setData(xValues, yValues, "AGE", "TRIPS COUNT", "#3182bd");
                });

                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;
            case RiderDemographics.USER_TYPE:
                self.getModel().getDBModel().getRidersUsertype(function(json) {
                    xValues = ["Subscriber", "Customer"];
                    yValues = [];
                    yValues.push(parseInt(json["Subscriber"]));
                    yValues.push(parseInt(json["Customer"]));

                    _columnChart.getView().show();
                    _lineChart.getView().hide();
                    _columnChart.setData(xValues, yValues, "USER TYPE", "TRIPS COUNT", ["#3182bd"]);
                });
                break;
        }
    };

    var addBehaviors = function() {
        _genderButton.onClick(function() {
            _chartType = RiderDemographics.GENDER;
            _genderButton.select();
            _ageButton.deselect();
            _userTypeButton.deselect();
            updateData();
        });

        _ageButton.onClick(function() {
            _chartType = RiderDemographics.AGE;
            _genderButton.deselect();
            _ageButton.select();
            _userTypeButton.deselect();
            updateData();
        });

        _userTypeButton.onClick(function() {
            _chartType = RiderDemographics.USER_TYPE;
            _genderButton.deselect();
            _ageButton.deselect();
            _userTypeButton.select();
            updateData();
        });
    };

    var init = function() {
        self.getView().addClass("rider-demographics-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add column chart
        _columnChart = new  UIColumnChartViewController(self);
        self.add(_columnChart);

        // Add line chart
        _lineChart = new UILineChartViewController(self);
        self.add(_lineChart);

        // Add buttons
        _genderButton = new UIButtonViewController(self);
        _genderButton.setTitle(RiderDemographics.GENDER);
        self.add(_genderButton);

        _ageButton = new UIButtonViewController(self);
        _ageButton.setTitle(RiderDemographics.AGE);
        self.add(_ageButton);

        _userTypeButton = new UIButtonViewController(self);
        _userTypeButton.setTitle(RiderDemographics.USER_TYPE);
        self.add(_userTypeButton);

        // Set start chart
        _chartType = RiderDemographics.GENDER;
        _genderButton.select();

        addBehaviors();
    } ();
}

var RiderDemographics = {
    GENDER: "Gender",
    AGE: "Age",
    USER_TYPE: "User type"
};

Utils.extend(RiderDemographicsChartViewController, ChartViewController);

// USEFUL
//var parseDate = d3.time.format("%d-%b-%y").parse;