/**
 * @class: CompareLayerViewController
 * @description template class
 *
 * @param parentController
 */
function CompareLayerViewController(parentController) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;


    var __debug = true;
    var _selectionModel = self.getModel().getSelectionModel();
    var _maxFlowStroke = 2;
    var _baseOpacity = 0.15;

    var _legendaModel = self.getModel().getLegendaModel();

    //cached
    var _flowData = null;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {

    };


    /**
     *  NONE
     */
    this.onNoneStationSelected = function() {
        //CLEAN UP
        self.getView().getSvg().html("");

        self.getModel().getLegendaModel().clearEntries();
    };


    /**
     *  SINGLE
     */
    this.onSingleStationSelected = function() {
        if(__debug)console.log("SINGLE MODE");

        var station_id = _selectionModel.getSelectedStations()[0];

        var timeModel = self.getModel().getTimeModel();
        databaseModel.getSingleStationInflowAndOutflow(
                        station_id,
                        timeModel.getStartDate(),timeModel.getEndDate(),
                        self.drawSingleStationFlow);


        //Legenda
        self.getModel().getLegendaModel().clearEntries();
        self.getModel().getLegendaModel().setEntries(
            [
                {name:"inflow" , color:ColorsModel.colors.inflow},
                {name:"outflow" , color:ColorsModel.colors.outflow}
            ]
        );

        self.getModel().getLegendaModel().setSelectedEntries(["inflow"]);
    } ;

    ////////////////////

    /**
     *  TWO
     */
    this.onTwoStationSelected = function() {
        if(__debug)console.log("TWO MODE");
        //CLEAN UP
        self.getView().getSvg().html("");

        self.getModel().getLegendaModel().clearEntries();

        //MOVED IN CompareTwoStationsLayerViewController
    } ;

    ////////////////////

    /**
     *  MANY
     */
    this.onManyStationSelected = function() {
        if(__debug)console.log("MANY MODE");
        //CLEAN UP
        self.getView().getSvg().html("");

        self.getModel().getLegendaModel().clearEntries();
    } ;

    ///////////////////

    /**
     * LEGENDA SELECTION CHANGED
     */
    this.onLegendaSelectedEntriesChanged = function() {
        if(__debug)console.log("LEGENDA CHANGED");
        redrawCurrentMode();
    };


    ////////////// PRIVATE METHODS

    this.drawSingleStationFlow = function(flowData) {

        _flowData = flowData;

        //CLEAN UP
        self.getView().getSvg().html("");
        if(__debug)console.log("Flow Data: " + flowData);

        if(_selectionModel.getSelectedStations().length != 1){
            if(__debug)console.log("NO MORE SINGLE STATION SELECTED");
            return;
        }

        var station_id = _selectionModel.getSelectedStations()[0];

        var startPointCoords = databaseModel.getStationCoordinates(station_id);
        var startPoint = self.project(startPointCoords[0],startPointCoords[1]);

        //Calculate max flow value
        var maxFlowObject = _.max(flowData, function(d){return Math.max(parseInt(d.inflow),parseInt(d.outflow));});
        var maxFlowValue = Math.max(parseInt(maxFlowObject.inflow),parseInt(maxFlowObject.outflow));
        if(__debug)console.log("MAX FLOW " + maxFlowValue);

        var lineColor = ColorsModel.colors.inflow;

        for(var f in flowData){

            var flow = flowData[f];
            var endPointCoords = databaseModel.getStationCoordinates(flow.station_id);
            var endPoint = self.project(endPointCoords[0],endPointCoords[1]);

            //INFLOW

            if(_legendaModel.isEntrySelected("inflow")){
                var perc = (flow.inflow/maxFlowValue);


                self.getView().getSvg()
                    .append("line")
                    .classed("compare-layer-flow-line",true)
                    .attr("x1",startPoint.x)
                    .attr("y1",startPoint.y)
                    .attr("x2",endPoint.x)
                    .attr("y2",endPoint.y)
                    .attr("opacity",_baseOpacity + (1-_baseOpacity)*perc)
                    .attr("stroke-width", _maxFlowStroke*perc)
                    .attr("stroke", lineColor);
            }



            //OUTFLOW
            if(_legendaModel.isEntrySelected("outflow")) {
                var perc = (flow.outflow / maxFlowValue);

                self.getView().getSvg()
                    .append("line")
                    .classed("compare-layer-flow-line", true)
                    .attr("x1", startPoint.x)
                    .attr("y1", startPoint.y)
                    .attr("x2", endPoint.x)
                    .attr("y2", endPoint.y)
                    .attr("opacity", _baseOpacity + (1 - _baseOpacity) * perc)
                    .attr("stroke-width", _maxFlowStroke * perc)
                    .attr("stroke", ColorsModel.colors.outflow);
            }

        }
    };

    var redrawCurrentMode = function() {
        var selection_count = _selectionModel.getSelectedStations().length;
        if(selection_count == 0){

        } else if (selection_count == 1) {
            self.drawSingleStationFlow(_flowData);
        } else if (selection_count == 2) {

        } else if (selection_count > 2) {

        }
    };



    var init = function() {
        //deselect all stations
        _selectionModel.deselectAllStations();


        //Notifications
        self.getNotificationCenter().subscribe(self, self.onNoneStationSelected,
                                               Notifications.selections.NONE_STATION_SELECTED);
        self.getNotificationCenter().subscribe(self, self.onSingleStationSelected,
                                               Notifications.selections.ONE_STATION_SELECTED);

        self.getNotificationCenter().subscribe(self, self.onTwoStationSelected,
                                               Notifications.selections.TWO_STATIONS_SELECTED);

        self.getNotificationCenter().subscribe(self, self.onManyStationSelected,
                                               Notifications.selections.MANY_STATIONS_SELECTED);


        self.getNotificationCenter().subscribe(self, self.onLegendaSelectedEntriesChanged,
                                               Notifications.legenda.SELECTED_ENTRIES_CHANGED);




    } ();
}

// Inheritance
Utils.extend(CompareLayerViewController, MapLayerController);