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

  this.getActiveFilteredTrips = function() {


      //NOT EFFICIENT?
      return _activeTrips.filter(this.tripFilter);
  };

    /**
     * Returns true or false whether the trip match the filters or not
     * @param trip
     */
  this.tripFilter = function(trip) {
      var filterModel = parentModel.getFilterModel();

      //GENDER

      if(filterModel.getGenderFilter() == FilterModel.GENDER_FILTER.FEMALE) {
          if(trip.gender != "Female")
              return false;
      }
      if(filterModel.getGenderFilter() == FilterModel.GENDER_FILTER.MALE) {
          if(trip.gender != "Male")
              return false;
      }
      if(filterModel.getGenderFilter() == FilterModel.GENDER_FILTER.UNKNOWN) {
          if(trip.gender != "")
              return false;
      }

      //AGE
      var ageFilter = filterModel.getAgeFilter();

      if(ageFilter != FilterModel.AGE_FILTER.ALL){
          var birthyear = parseInt(trip.birthyear);
          if(birthyear == 0)
              return false;
          var age = 2013 -  birthyear;

          var ageRange = FilterModel.ageFilterToRange(ageFilter);

          if(age < ageRange[0] || age > ageRange[1]){
              return false;
          }
      }

      // USER TYPE
      if(filterModel.getUserTypeFilter() == FilterModel.USER_TYPE_FILTER.CUSTOMER) {
          if(trip.usertype != "Customer")
              return false;
      }
      if(filterModel.getUserTypeFilter() == FilterModel.USER_TYPE_FILTER.SUBSCRIBER) {
          if(trip.usertype != "Subscriber")
              return false;
      }


      return true;
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
  
  
};