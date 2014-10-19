/**
 *
 * @param parentModel
 * @constructor
 */
function SelectionModel(parentModel) {
  // PRIVATE ATTRIBUTES
  var self = this;
  
  var _parentModel = parentModel;

  var _selectedStationsId = [];
  var _lastStationWasSelected = null;
  var _lastStationSelected = null;
  var _lastDoubleClickedStation = null;
    // PUBLIC METHODS

  this.isStationSelected = function(station_id) {
    return _.contains(_selectedStationsId, station_id);
  };


  this.getSelectedStations = function() {
    return _selectedStationsId.slice();
  };


  this.toggleStationSelection = function(station_id) {
      if(self.isStationSelected(station_id)) {
          _lastStationWasSelected = false;
          _selectedStationsId = _.without(_selectedStationsId, station_id);
      } else {
          _selectedStationsId.push(station_id);
          _lastStationSelected = station_id;
          _lastStationWasSelected = true;
      }

      fireStationSelectedEvents();
  };


  this.getSelectedStations = function() {
        return _selectedStationsId.slice();
  };



  this.selectAllStations = function() {
      _selectedStationsId = [];
      var stations = databaseModel.getStations();
      for(var i in stations){
          var s = stations[i];
          _selectedStationsId.push(s.station_id);
      }

      fireStationSelectedEvents();
  };


  this.deselectAllStations = function() {
      _selectedStationsId = [];

      fireStationSelectedEvents();
  };


  this.extendStationSelectionToCommunity = function() {
      console.log("not implemented yet")
      if(_lastStationWasSelected == true){

      } else if(_lastStationWasSelected == false){

      }

      fireStationSelectedEvents();
  };


  this.setDoubleClickStation = function(station_id) {
      _lastDoubleClickedStation = station_id;
      parentModel.getNotificationCenter().dispatch(Notifications.selections.DOUBLE_CLICK_ON_STATION);
  };

  this.getDoubleClickStation = function() {
     return _lastDoubleClickedStation;
  };

  // PRIVATE METHODS
  var fireStationSelectedEvents = function() {
      parentModel.getNotificationCenter().dispatch(Notifications.selections.STATIONS_SELECTED_CHANGED);

      if(_selectedStationsId.length == 0) {
          parentModel.getNotificationCenter().dispatch(Notifications.selections.NONE_STATION_SELECTED);
      }else if(_selectedStationsId.length == 1) {
          parentModel.getNotificationCenter().dispatch(Notifications.selections.ONE_STATION_SELECTED);
      } else if (_selectedStationsId.length == 2) {
          parentModel.getNotificationCenter().dispatch(Notifications.selections.TWO_STATIONS_SELECTED);
      } else if (_selectedStationsId.length > 2) {
          parentModel.getNotificationCenter().dispatch(Notifications.selections.MANY_STATIONS_SELECTED);
      }

  }  ;

  
  var init = function() {
  } ();
  
  
}