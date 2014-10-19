/**
 *
 * @param parentModel
 * @constructor
 */
function PlayADayModel(parentModel) {
  // PRIVATE ATTRIBUTES
  var self = this;
  
  var _parentModel = parentModel;

  var _activeTrips = [];

  // PUBLIC METHODS

  this.addTrip = function(trip) {
        _activeTrips.push(trip);
      _parentModel.getNotificationCenter().dispatch(Notifications.playADay.TRIPS_DATA_CHANGED);
  };


  this.removeTrip = function(trip) {
      _activeTrips = _.without(_activeTrips, trip);
      _parentModel.getNotificationCenter().dispatch(Notifications.playADay.TRIPS_DATA_CHANGED);
  };


  this.getActiveTrips = function() {
      return _activeTrips.slice();
  };


  this.getStationInflow = function(station_id) {
      return _.filter(_activeTrips,function(t){return t.to_station_id == station_id;}).length;
  };


  this.getStationOutflow = function(station_id) {
      return _.filter(_activeTrips,function(t){return t.from_station_id == station_id;}).length;
  };



  // PRIVATE METHODS


  
  var init = function() {
  } ();
  
  
}