/**
 *
 * @param parentModel
 * @constructor
 */
function FilterModel(parentModel) {
  // PRIVATE ATTRIBUTES
  var self = this;
  
  var _parentModel = parentModel;

  var _userTypeFilter = FilterModel.USER_TYPE_FILTER.ALL;
  var _genderFilter = FilterModel.GENDER_FILTER.ALL;
  var _ageFilter = FilterModel.AGE_FILTER.ALL;

  // PUBLIC METHODS

  this.setAgeFilter = function(filter) {
    _ageFilter = filter;
    parentModel.getNotificationCenter().dispatch(Notifications.filter.ON_FILTER_CHANGED);
  };

  this.setUserTypeFilter = function(filter) {
    _userTypeFilter = filter;
    parentModel.getNotificationCenter().dispatch(Notifications.filter.ON_FILTER_CHANGED);
  };

  this.setGenderFilter = function(filter) {
    _genderFilter = filter;
    parentModel.getNotificationCenter().dispatch(Notifications.filter.ON_FILTER_CHANGED);
  };

  this.getUserTypeFilter = function() {
      return _userTypeFilter;
  };

  this.getAgeFilter = function() {
      return _ageFilter;
  };

  this.getGenderFilter = function() {
      return _genderFilter;
  };

  // PRIVATE METHODS
  var init = function() {
  } ();

}

FilterModel.USER_TYPE_FILTER = {
    ALL : "ALL",
    CUSTOMER : "Customer",
    SUBSCRIBER : "Subscriber"
};

FilterModel.GENDER_FILTER = {
    ALL : "ALL",
    MALE : "Male",
    FEMALE : "Female",
    UNKNOWN : "Unknown"
};

FilterModel.AGE_FILTER = {
    ALL : "ALL",
    RANGE_16_20 : "16-20",
    RANGE_21_30 : "21-30",
    RANGE_31_50 : "31-50",
    RANGE_51_80 : "51-80",
    RANGE_80 : ">80"
};

FilterModel.toArray = function(dict){
    var list = [];
    for(var k in dict){
        list.push(dict[k]);
    }
    return list;
};

FilterModel.ageFilterToRange = function(filter) {
  if(filter == "ALL"){
      return [0,999];
  } else if (filter == FilterModel.AGE_FILTER.RANGE_16_20) {
      return [16,20];
  } else if (filter == FilterModel.AGE_FILTER.RANGE_21_30) {
      return [21,30];
  } else if (filter == FilterModel.AGE_FILTER.RANGE_31_50) {
      return [31,50];
  } else if (filter == FilterModel.AGE_FILTER.RANGE_51_80) {
      return [51,80];
  } else if (filter == FilterModel.AGE_FILTER.RANGE_80) {
      return [80,999];
  }
};
