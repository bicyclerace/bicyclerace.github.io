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

    var _selectionModel = self.getModel().getSelectionModel(),
        _timeModel = self.getModel().getTimeModel();

    // Line chart
    var _lineChart;


    // Padding
    var _padding = {left: 10, top: 20, right: 10, bottom: 10};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 425};

    /////////////////////////// PUBLIC METHODS ///////////////////////////

    /**
     *  NONE
     */
    this.onNoneStationSelected = function() {
        hidePopup();
    };


    /**
     *  SINGLE
     */
    this.onSingleStationSelected = function() {
        hidePopup();
    } ;

    ////////////////////

    /**
     *  TWO
     */
    this.onTwoStationSelected = function() {
        showPopup();
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
        hidePopup();
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

        _lineChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 6 - chartPad.top - chartPad.bottom);

        _lineChart.getView().setViewBox(0,
                0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * 6 - chartPad.top - chartPad.bottom);

        updateData();


        if(_selectionModel.getSelectedStations().length != 2) {
            hidePopup();
        }


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


        //CHART

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

        _lineChart.setXScale(d3.time.scale());
        _lineChart.setXTickFormat(null);
        _lineChart.setXTickAlignment(TickAlignment.MIDDLE);
        _lineChart.setXAxisLabel("DAY HOUR");
        _lineChart.setYAxisLabel("BIKES OUT");
        _lineChart.removeAllLines();
        _lineChart.addLine(xValues, yValuesFromAToB, ColorsModel.colors.inflow);
        _lineChart.addLine(xValues, yValuesFromBToA, ColorsModel.colors.outflow);
        _lineChart.getView().show();




    };

    var updateData = function() {
        var startDate = self.getModel().getTimeModel().getStartDate();
        var endDate = self.getModel().getTimeModel().getEndDate();

    };


    var addBehaviors = function() {
    };


    var init = function() {
        self.getView().addClass("compare-flow-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add line chart
        _lineChart = new  UILineChartViewController(self);
        _lineChart.setTitle("Overall number of rides from  27 Jun 2013 to  31 Dec 2013");
        self.add(_lineChart);



        self.setSize(PopupController.SIZE.DOUBLE);

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

