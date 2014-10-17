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
    var _stationHeight,
        _stationWidth;
    var _selectImage,
        _deselectImage;


    var __debug = true;
    var _selectionModel = self.getModel().getSelectionModel();
    var _stationButtons = {};

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {

    };


    this.onStationSelectionChanged = function() {

        var selectedStations = _selectionModel.getSelectedStations();
        //deselect all
        for(var i in _stationButtons){
            _stationButtons[i].setImage(_deselectImage);
        }

        //select few
        for(var j in selectedStations) {
            var id = selectedStations[j];
            _stationButtons[id].setImage(_selectImage);

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

            if(self.getModel().getSelectionModel().isStationSelected(station.station_id)) {
                stationButton.setImage(_selectImage);
            } else {
                stationButton.setImage(_deselectImage);
            }

            stationButton.getView().setFrame(p.x, p.y, 3, 5);
            stationButton.getView().setViewBox(0,0, _stationWidth, _stationHeight);
            stationButton.onClick(onStationClicked, station);
            self.add(stationButton);
            _stationButtons[station.station_id] = stationButton;

        }
    };



    var init = function() {

        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();

        if(visualizationType == VisualizationType.PLAY_A_DAY) {
            _stationHeight = 3;
            _stationWidth = 3;
            _deselectImage = "img/select-stations-layer-circle-deselected.svg";
            _selectImage = "img/select-stations-layer-circle-selected.svg"
        } else {
            //Default
            _stationHeight = 5;
            _stationWidth = 3;
            _deselectImage = "img/select-stations-layer-deselected.svg";
            _selectImage = "img/select-stations-layer-selected.svg"
        }

        self.getNotificationCenter().subscribe(self, self.onStationSelectionChanged,
            Notifications.selections.STATIONS_SELECTED_CHANGED);
        draw();
    } ();
}

// Inheritance
Utils.extend(SelectStationLayerViewController, MapLayerController);