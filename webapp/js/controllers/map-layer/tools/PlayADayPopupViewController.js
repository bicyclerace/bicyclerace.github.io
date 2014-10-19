/**
 * @class: MalLalyerPopupViewController
 * @description MalLalyerPopupViewController class implements an MVC controller. It contains also the UIView that it manages.
 *
 * @param parentController
 */
function PlayADayPopupViewController(parentController, stationId) {

    MapLayerPopupViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _stationId = stationId;
    var _barchart;


    /////////////////////////////// PUBLIC METHODS ///////////////////////////////

    this.onFlowChanged = function() {
        //update the data
        var playModel = self.getModel().getPlayADayModel();

        var inflow = playModel.getStationInflow(_stationId);
        var outflow = playModel.getStationOutflow(_stationId);
        var flow = inflow + outflow;
        _barchart.setData(["tot flow", "inflow", "outflow"],[flow,inflow,outflow],"FLOW","BIKES",
            [ColorsModel.colors.totalFlow, ColorsModel.colors.inflow, ColorsModel.colors.outflow]/*TODO COLORS*/);

    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////

    var draw = function() {
        var coord = databaseModel.getStationCoordinates(_stationId);
        self.setLatLng(coord[0],coord[1]);

        var popupWidth = self.getView().getFrameWidth();
        var popupHeight = self.getView().getFrameHeight();

        var titleHeight = 3;

        //STATION NAME
        var title = new UILabelViewController(self.getContentViewController());
        var stationName = databaseModel.getStations()[_stationId].station_name;
        title.setText(stationName);
        title.getView().getSvg().classed("popup-title", true);
        title.getView().setFrame(0,0,popupWidth,titleHeight);
        title.getView().setViewBox(0,0,popupWidth,titleHeight);
        self.getContentViewController().add(title);

        //SET UP BARCHART
        _barchart = new UIColumnChartViewController(self.getContentViewController());

        _barchart.getView().setFrame(0,titleHeight,popupWidth,popupHeight - titleHeight);
        _barchart.getView().setViewBox(0,0,600,300);
        self.getContentViewController().add(_barchart);
    };


    var init = function() {

        self.getNotificationCenter().subscribe(self,self.onFlowChanged,
            Notifications.playADay.TRIPS_DATA_CHANGED);

        draw();
    } ();
}

Utils.extend(MapLayerPopupViewController, ViewController);