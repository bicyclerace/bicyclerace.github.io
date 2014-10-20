/**
 * @class: CompareTwoStationsLayerViewController
 * @description template class
 *
 * @param parentController
 */
function CompareTwoStationsLayerViewController(parentController) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var __debug = true;
    var _selectionModel = self.getModel().getSelectionModel();
    var _arrowMaxThickness = 2;


    //////////////////////////// PUBLIC METHODS ////////////////////////////



    ////////////////////


    this.onStationSelectedChanged = function() {

        //CLEAN UP
        self.getView().getSvg().html("");

        if(_selectionModel.getSelectedStations().length == 2) {
            var stationA = _selectionModel.getSelectedStations()[0];
            var stationB = _selectionModel.getSelectedStations()[1];
            databaseModel.getTwoStationsFlowByHour(
                stationA,
                stationB,
                self.drawTwoStationsFlow);
        }

    } ;


    ////////////// PRIVATE METHODS

    /** TWO STATIONS FLOW */
    this.drawTwoStationsFlow = function(flowData) {

        //CLEAN UP
        self.getView().getSvg().html("");


        if(_selectionModel.getSelectedStations().length != 2){
            if(__debug)console.log("NO MORE SINGLE STATION SELECTED");
            return;
        }

        var stationA = _selectionModel.getSelectedStations()[0];
        var stationB = _selectionModel.getSelectedStations()[1];

        var stationACoords = databaseModel.getStationCoordinates(stationA);
        var stationAPoint = self.project(stationACoords[0],stationACoords[1]);

        var stationBCoords = databaseModel.getStationCoordinates(stationB);
        var stationBPoint = self.project(stationBCoords[0],stationBCoords[1]);

        //Calculate sum and max flow value

        var flowAB = 0;
        var flowBA = 0;

        flowData.forEach(function(d){
            flowAB += parseInt(d.fromAtoB);
            flowBA += parseInt(d.fromBtoA);
        });

        var percAB = flowAB/(flowAB+flowBA) * _arrowMaxThickness;
        var percBA = flowBA/(flowAB+flowBA) * _arrowMaxThickness;

        var arrowFromAtoB = self.getView().getSvg()
            .append("polygon")
            .classed("compare-layer-view-controller-flow-arrow", true)
            .attr("fill", ColorsModel.colors.inflow)
            .attr("points",drawArrow(stationAPoint,stationBPoint,percAB,percBA,1) );
        ;

        var arrowFromBtoA = self.getView().getSvg()
            .append("polygon")
            .classed("compare-layer-view-controller-flow-arrow", true)
            .attr("fill", ColorsModel.colors.outflow)
            .attr("points",drawArrow(stationBPoint,stationAPoint,percBA,percAB,1) );
        ;


    };

    var drawArrow = function(start, end, thick, shift, margin){


        var length = vec2(end).subV(vec2(start)).length() - margin*2;
        var parallel = vec2(end).subV(vec2(start)).normalize();
        var perpendicular = parallel.clone().perpendicular().normalize();
        var arrowTip = 1;

        var newStart = vec2(start).addV(parallel.mulS(margin)).addV(perpendicular.mulS(shift));

        //FROM A TO B
        var v1 = vec2(newStart).addV(perpendicular.mulS(thick)) ,
            v2 = v1.addV(parallel.mulS(length-arrowTip)),
            v3 = vec2(newStart).addV(parallel.mulS(length)),
            v5 = vec2(newStart).subV(perpendicular.mulS(thick)),
            v4 = v5.addV(parallel.mulS(length-arrowTip))
            ;

        return  v1.toArray() + " " +
                v2.toArray() + " " +
                v3.toArray() + " " +
                v4.toArray() + " " +
                v5.toArray();
    };


    var init = function() {

        //Notifications
        self.getNotificationCenter().subscribe(self, self.onStationSelectedChanged,
                                               Notifications.selections.STATIONS_SELECTED_CHANGED);



    } ();
}

// Inheritance
Utils.extend(CompareTwoStationsLayerViewController, MapLayerController);