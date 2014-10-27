/**
 * @class CompareFlowChartViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function CompareFlowChartViewController(parentController) {
    // Call super constructor
    ChartViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;

    var ChartType = {
      NONE : "none",
      TWO_FLOW: "two_flow"
    };

    // Type of visualization
    var _chartType = ChartType.NONE;

    // Column chart
    var _columnChart;

    // Line chart
    var _lineChart;
    var _compareTwoLineChart;

    // Buttons
    var _genderButton;
    var _ageButton;
    var _userTypeButton;

    // Arriving, leaving buttons
    var _leavingButton;
    var _arrivingButton;

    var _arrivingLeaving;

    var ArrivingLeaving = {
        LEAVING: "Leaving",
        ARRIVING: "Arriving"
    };


    var _selectionModel = self.getModel().getSelectionModel(),
        _timeModel = self.getModel().getTimeModel();



    // Padding
    var _padding = {left: 10, top: 20, right: 10, bottom: 10};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 425};

    /////////////////////////// PUBLIC METHODS ///////////////////////////

    /**
     *  NONE
     */
    this.onNoneStationSelected = function() {
        showHideComponents();
    };


    /**
     *  SINGLE
     */
    this.onSingleStationSelected = function() {
        showHideComponents();
        updateStationDemographicData();
    } ;

    ////////////////////

    /**
     *  TWO
     */
    this.onTwoStationSelected = function() {
        showHideComponents();
        var stationA = _selectionModel.getSelectedStations()[0];
        var stationB = _selectionModel.getSelectedStations()[1];
        databaseModel.getTwoStationsFlowByHour(
            stationA,
            stationB,
            showTwoStationsData);
    } ;

    ////////////////////

    /**
     *  MANY
     */
    this.onManyStationSelected = function() {
        showHideComponents();
        updateGroupOfStationsData();
    } ;

    ///////////////////

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

        // Update charts
        var chartPad = {left: 0, right: 0, top: 30, bottom: 0};

        _compareTwoLineChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 6 - chartPad.top - chartPad.bottom);

        _compareTwoLineChart.getView().setViewBox(0,
                0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 6 - chartPad.top - chartPad.bottom);

        //SINGLE STATION
        // Update buttons
        var buttonsWidth = contentBox.width / 3;
        _genderButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _genderButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _ageButton.getView().setFrame(contentBox.x + buttonsWidth, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _ageButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        _userTypeButton.getView().setFrame(contentBox.x + buttonsWidth *2, contentBox.y + heightUnit *5, buttonsWidth, heightUnit);
        _userTypeButton.getView().setViewBox(0, 0, buttonsWidth, heightUnit);

        var widthProportion = 0.7;
        // Update charts
        _columnChart.getView().setFrame(contentBox.x + ((1-widthProportion)/2)*(contentBox.width - chartPad.left - chartPad.right) ,
                contentBox.y + chartPad.top,
                contentBox.width*widthProportion - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _columnChart.getView().setViewBox(0,
            0,
                contentBox.width*widthProportion - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setViewBox(0,
            0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 5 - chartPad.top - chartPad.bottom);

        // Update metric buttons
        var distButton = {width: buttonsWidth/4, height: heightUnit};
        var start = {
            x: contentBox.width - (distButton.width * 3),
            y: contentBox.y
        };
        _leavingButton.getView().setFrame(start.x, start.y, distButton.width, distButton.height);
        _leavingButton.getView().setViewBox(0, 0, distButton.width, distButton.height);

        _arrivingButton.getView().setFrame(start.x + distButton.width, start.y, distButton.width, distButton.height);
        _arrivingButton.getView().setViewBox(0, 0, distButton.width, distButton.height);


        showHideComponents();
        // Call super
        super_updateView.call(self);
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////

    var hidePopup = function() {
        d3.select(self.getView().getSvg().node().parentNode).attr("opacity",0);
    };

    var showPopup = function() {
        d3.select(self.getView().getSvg().node().parentNode).attr("opacity",1);
    };

    var showTwoStationsData = function(data) {

        var selectedStations = _selectionModel.getSelectedStations()[0];
        var stationA = selectedStations[0],
            stationB = selectedStations[1];


        //CHART FOR TWO STATION

        var xValues = [];
        var yValuesFromAToB = [];
        var yValuesFromBToA = [];

        var hours = 24;
        for(var h = 1; h < hours; h++) {
            xValues.push(new Date(0,0,0,h,0));
        }

        for(var i = 0; i < 24;i++){
            yValuesFromAToB.push(0);
            yValuesFromBToA.push(0);
        }

        data.forEach(function(hour) {
            var h = hour.hour_of_the_day;
            yValuesFromAToB[h] = hour.fromAtoB;
            yValuesFromBToA[h] = hour.fromBtoA;
        });

        _compareTwoLineChart.setXScale(d3.time.scale());
        _compareTwoLineChart.setXTickFormat(null);
        _compareTwoLineChart.setXTickAlignment(TickAlignment.MIDDLE);
        _compareTwoLineChart.setXAxisLabel("DAY HOUR");
        _compareTwoLineChart.setYAxisLabel("BIKES OUT");
        _compareTwoLineChart.removeAllLines();
        _compareTwoLineChart.addLine(xValues, yValuesFromAToB, ColorsModel.colors.inflow);
        _compareTwoLineChart.addLine(xValues, yValuesFromBToA, ColorsModel.colors.outflow);
        _compareTwoLineChart.getView().show();




    };


    var updateStationDemographicData = function() {

        var stationId = _selectionModel.getSelectedStations()[0];

        var startDate = self.getModel().getTimeModel().getStartDate();
        var endDate = self.getModel().getTimeModel().getEndDate();
        var xValues;
        var yValues;

        var updateGender = function(json) {
            xValues = ["Male", "Female", "Unknown"];
            yValues = [];
            yValues.push(parseInt(json["Male"]));
            yValues.push(parseInt(json["Female"]));
            yValues.push(parseInt(json["Unknown"]));

            _columnChart.setTitle("TRIPS COUNT BY GENDER");
            _columnChart.setData(xValues, yValues, "GENDER", "TRIPS COUNT", ["#67A9CF", "#E9A3C9", "#bababa"]);
        };

        var updateAge = function(json) {
            xValues = [];
            yValues = [];

            var age;
            json.forEach(function(year) {
                age = endDate.getFullYear() - parseInt(year["birthyear"]);
                xValues.push(age);
                yValues.push(parseInt(year["count"]));
            });

            xValues.reverse();
            _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
            _lineChart.removeAllLines();
            _lineChart.setTitle("TRIPS COUNT BY AGE");
            _lineChart.setXAxisLabel("AGE");
            _lineChart.setYAxisLabel("TRIPS COUNT");
            _lineChart.addLine(xValues, yValues, "#3182bd");
        };

        var updateUserType = function(json) {
            xValues = ["Subscriber", "Customer"];
            yValues = [];
            yValues.push(parseInt(json["Subscriber"]));
            yValues.push(parseInt(json["Customer"]));

            _columnChart.getView().show();
            _lineChart.getView().hide();
            _columnChart.setTitle("TRIPS COUNT BY USER TYPE");
            _columnChart.setData(xValues, yValues, "USER TYPE", "TRIPS COUNT", ["#8dd3c7", "#fb8072"]);
        };


        switch(_chartType) {
            case RiderDemographics.GENDER:

                if(_arrivingLeaving == ArrivingLeaving.ARRIVING)
                    databaseModel.getRidersGenderArrivingByStation(stationId, updateGender);
                else
                    databaseModel.getRidersGenderLeavingByStation(stationId, updateGender);

                _columnChart.getView().show();
                _lineChart.getView().hide();
                break;

            case RiderDemographics.AGE:

                if(_arrivingLeaving == ArrivingLeaving.ARRIVING)
                    databaseModel.getRidersAgeArrivingByStation(stationId, updateAge);
                else
                    databaseModel.getRidersAgeLeavingByStation(stationId, updateAge);

                _columnChart.getView().hide();
                _lineChart.getView().show();
                break;

            case RiderDemographics.USER_TYPE:

                if(_arrivingLeaving == ArrivingLeaving.ARRIVING)
                    databaseModel.getRidersUsertypeArrivingByStation(stationId, updateUserType);
                else
                    databaseModel.getRidersUsertypeLeavingByStation(stationId, updateUserType);
                break;
        }
    };


    var updateGroupOfStationsData = function() {
        var selectedStations = _selectionModel.getSelectedStations();

        var data = {internal:0, external:0};

        databaseModel.getStationsFlow(20000,function(json){

            for(var i in json) {
                var result = json[i];
                if(_.contains(selectedStations, result.from_station_id)
                    && _.contains(selectedStations, result.to_station_id)) {
                    data.internal += parseInt(result.flow);
                } else if(_.contains(selectedStations, result.from_station_id)
                    || _.contains(selectedStations, result.to_station_id)) {
                    data.external += parseInt(result.flow);
                }
            }

            xValues = ["Selected", "Deselected"];
            yValues = [];
            yValues.push(data.internal);
            yValues.push(data.external);

            _columnChart.getView().show();
            _lineChart.getView().hide();
            _columnChart.setTitle("TRIPS COUNT");
            _columnChart.setData(xValues, yValues, "TRIP TYPE", "TRIPS", ["#8dd3c7", "#fb8072"]);
        });
    };

    var addBehaviors = function() {

            _genderButton.onClick(function() {
                _chartType = RiderDemographics.GENDER;
                _genderButton.select();
                _ageButton.deselect();
                _userTypeButton.deselect();
                updateStationDemographicData();
            });

            _ageButton.onClick(function() {
                _chartType = RiderDemographics.AGE;
                _genderButton.deselect();
                _ageButton.select();
                _userTypeButton.deselect();
                updateStationDemographicData();
            });

            _userTypeButton.onClick(function() {
                _chartType = RiderDemographics.USER_TYPE;
                _genderButton.deselect();
                _ageButton.deselect();
                _userTypeButton.select();
                updateStationDemographicData();
            });

        _leavingButton.onClick(function() {
            _leavingButton.select();
            _arrivingButton.deselect();
            _arrivingLeaving = ArrivingLeaving.LEAVING;
            updateStationDemographicData();
        });

        _arrivingButton.onClick(function() {
            _leavingButton.deselect();
            _arrivingButton.select();
            _arrivingLeaving = ArrivingLeaving.ARRIVING;
            updateStationDemographicData();
        });

    };


    var showHideComponents = function() {
        var selected = _selectionModel.getSelectedStations().length;

        var demographicsComponents = [  _columnChart,
                                        _lineChart,
                                        _genderButton,
                                        _ageButton,
                                        _arrivingButton,
                                        _leavingButton,
                                        _userTypeButton];
        
        switch (selected) {
            case 0:
                demographicsComponents.forEach(function(c){c.getView().hide()});
                _compareTwoLineChart.getView().hide();
                hidePopup();
                break;
            case 1:
                demographicsComponents.forEach(function(c){c.getView().show()});
                _compareTwoLineChart.getView().hide();
                showPopup();
                break;
            case 2:
                demographicsComponents.forEach(function(c){c.getView().hide()});
                _compareTwoLineChart.getView().show();
                showPopup();
                break;
            //Many mode
            default:
                demographicsComponents.forEach(function(c){c.getView().hide()});
                _compareTwoLineChart.getView().hide();
                _columnChart.getView().show();
                showPopup();
        }

    };


    var init = function() {
        self.getView().addClass("compare-flow-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add line chart
        _compareTwoLineChart = new  UILineChartViewController(self);
        _compareTwoLineChart.setTitle("Overall number of rides from  27 Jun 2013 to  31 Dec 2013");
        self.add(_compareTwoLineChart);

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

        //arrival, leaving
        _leavingButton = new UIButtonViewController(self);
        _leavingButton.setTitle("Arriving");
        _leavingButton.select();
        self.add(_leavingButton);

        _arrivingButton = new  UIButtonViewController(self);
        _arrivingButton.setTitle("Leaving");
        self.add(_arrivingButton);

        _arrivingLeaving = ArrivingLeaving.ARRIVING;
        
        self.setSize(PopupController.SIZE.SINGLE);

        //Notifications
        self.getNotificationCenter().subscribe(self, self.onNoneStationSelected,
            Notifications.selections.NONE_STATION_SELECTED);

        self.getNotificationCenter().subscribe(self, self.onSingleStationSelected,
            Notifications.selections.ONE_STATION_SELECTED);

        self.getNotificationCenter().subscribe(self, self.onTwoStationSelected,
            Notifications.selections.TWO_STATIONS_SELECTED);

        self.getNotificationCenter().subscribe(self, self.onManyStationSelected,
            Notifications.selections.MANY_STATIONS_SELECTED);



        addBehaviors();
    } ();
}




Utils.extend(CompareFlowChartViewController, ChartViewController);

