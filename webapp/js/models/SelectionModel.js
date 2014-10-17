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

    // PUBLIC METHODS

  this.isStationSelected = function(station_id) {
    return _.contains(_selectedStationsId, station_id);
  };


  this.getSelectedStations = function() {
    return _selectedStationsId.slice();
  };


  this.toggleStationSelection = function(station_id) {
      if(self.isStationSelected(station_id)) {
          _selectedStationsId = _.without(_selectedStationsId, station_id);
      } else {
          _selectedStationsId.push(station_id);
      }

      fireStationSelectedEvents();
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