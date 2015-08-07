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

    var _useLetterLabel = false;

    var _selectableStations = true;

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
            _stationButtons[id].setTitle("");
            _stationButtons[id].getView().bringToFront();
        }


        //A and B label for two selections
        if(_useLetterLabel && selectedStations.length == 2 ){
            for(var j in selectedStations) {
                if(j == 0){
                    _stationButtons[id].setTitle("A");
                } else if (j == 1) {
                    _stationButtons[id].setTitle("B");
                }
            }
        }
    };

    ////////////// PRIVATE METHODS


    var onStationClicked = function(station) {
        if(__debug)console.log("selected " + station.station_id);
        _selectionModel.toggleStationSelection(station.station_id);
    };

    var onStationDoubleClicked = function(station) {
        if(__debug)console.log("double-selected " + station.station_id);
        _selectionModel.setDoubleClickStation(station.station_id);
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

            stationButton.getView().setFrame(p.x - (_stationWidth/2), p.y - (_stationHeight/2), _stationWidth, _stationHeight);
            stationButton.getView().setViewBox(0,0, _stationWidth, _stationHeight);

            if(_selectableStations){
                stationButton.onClick(onStationClicked, station);
                stationButton.onDoubleClick(onStationDoubleClicked, station);
            }


            self.add(stationButton);
            _stationButtons[station.station_id] = stationButton;

        }
    };



    var init = function() {

        self.getView().getSvg().classed("select-stations-layer-view-controller", true);

        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();

        if(visualizationType == VisualizationType.PLAY_A_DAY ||
            visualizationType == VisualizationType.COMPARE  ||
            visualizationType == VisualizationType.DAY_PATTERNS ) {

            _stationHeight = 2;
            _stationWidth = 2;
            _deselectImage = "img/select-stations-layer-circle-deselected.svg";
            _selectImage = "img/select-stations-layer-circle-selected.svg"
        }
        else {
            //Default

            _stationHeight = 5;
            _stationWidth = 3;
            _deselectImage = "img/select-stations-layer-deselected.svg";
            _selectImage = "img/select-stations-layer-selected.svg"
        }


        //MORE SPECIFIC
        if(visualizationType == VisualizationType.DAY_PATTERNS) {
            _selectableStations = false;
        }

        self.getNotificationCenter().subscribe(self, self.onStationSelectionChanged,
            Notifications.selections.STATIONS_SELECTED_CHANGED);
        draw();
    } ();


}

// Inheritance
Utils.extend(SelectStationLayerViewController, MapLayerController);