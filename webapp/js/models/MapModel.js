/**
 *
 * @param parentModel
 * @constructor
 */
function MapModel(parentModel) {
  // PRIVATE ATTRIBUTES
  var self = this;
  
  var _parentModel = parentModel;
  
  // This is the default latitude and longitude of the Map center.

//    latitude:41.869912359714654, longitude:-87.64772415161133
  var  _focusPoint = { latitude:41.876320, longitude:-87.572841 };
  
  
  // PUBLIC METHODS
  
  
  /**
   * 
   * @returns {Array} [latitude, longitude]
   */ 
  this.getFocusPoint = function() {
    return [
      _focusPoint.latitude, 
      _focusPoint.longitude
    ];
  };
  
  
  
  // PRIVATE METHODS
  
  var init = function() {
  } ();
  
  
}