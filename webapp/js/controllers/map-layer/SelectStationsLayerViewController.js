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
    var _selectionModel = self.getModel().getSelectionModel();
    var _stationButtons = {};

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {

    };


    this.onStationSelectionChanged = function() {

        var selectedStations = _selectionModel.getSelectedStations();
        console.log("bau " + selectedStations);
        //deselect all
        for(var i in _stationButtons){
            _stationButtons[i].setImage("img/select-stations-layer-deselected.svg");
        }

        //select few
        for(var j in selectedStations) {
            var id = selectedStations[j];
            _stationButtons[id].setImage("img/select-stations-layer-selected.svg");

            _stationButtons[id].getView().bringToFront();

        }
    };

    ////////////// PRIVATE METHODS


    var onStationClicked = function(station) {
        if(__debug)console.log("selected " + station.station_id);
        _selectionModel.toggleStationSelection(station.station_id);
    };


    var draw = function() {

        var stations = databaseModel.getStations();

        //Draw Stations
        for(var s in stations){
            var station = stations[s];
            var coord = databaseModel.getStationCoordinates(station.station_id);
            var p = self.project(coord[0], coord[1]);

            //add station
            var stationButton = new UIButtonViewController(self);
            stationButton.setImage("img/select-stations-layer-deselected.svg");
            stationButton.getView().setFrame(p.x, p.y, 3, 5);
            stationButton.getView().setViewBox(0,0,3,5);
            stationButton.onClick(onStationClicked, station);
            self.add(stationButton);
            _stationButtons[station.station_id] = stationButton;

        }
    };



    var init = function() {
        self.getNotificationCenter().subscribe(self, self.onStationSelectionChanged,
            Notifications.selections.STATIONS_SELECTED_CHANGED);
        draw();
    } ();
}

// Inheritance
Utils.extend(SelectStationLayerViewController, MapLayerController);