/**
 * @class: SelectStationLayerViewController
 * @description template class
 *
 * @param parentController
 */
function SelectStationLayerViewController(parentController, layerGroup) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _stationSize;


    var __debug = true;



    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {

    };

    ////////////// PRIVATE METHODS

    var onStationSelected(station) {

    }


    var draw = function() {

        var stations = databaseModel.getStations();

        //Draw Stations
        for(var s in stations){
            var station = stations[s];
            var coord = databaseModel.getStationCoordinates(station.station_id);
            var p = self.project(coord[0], coord[1]);

            //add station
            self.getView().getSvg().append("image")
                .classed("select-stations-layer-station", true)
                .attr("selected",false)
                .attr("xlink:href", "img/select-stations-layer-deselected")
                .attr("x", _viewBoxWidth - _padding.right - _logoWith)
                .attr("y", _padding.top)
                .attr("width", _logoWith)
                .attr("height", _logoHeight)
                .on("click", function(){parentController.closePopup(self)});

            stationButton.setImage("")


        }
    };



    var init = function() {
        var timeModel = self.getModel().getTimeModel();
        databaseModel.getStationsInflowAndOutflow(timeModel.getStartDate(),timeModel.getEndDate(),self.drawInflowOutflow);

        draw();
    } ();
}

// Inheritance
Utils.extend(SelectStationLayerViewController, MapLayerController);