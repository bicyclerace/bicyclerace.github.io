/**
 *
 * @param parentModel
 * @constructor
 */
function LegendaModel(parentModel) {
  // PRIVATE ATTRIBUTES
  var self = this;
  
  var _parentModel = parentModel;
  var _entries = [];
  var _selectedEntries = [];

  // PUBLIC METHODS

    /**
     *
     * @param entries = [{color: .. , name: ..]
     */
  this.setEntries = function (entries) {
    _entries = entries;
      parentModel.getNotificationCenter().dispatch(Notifications.legenda.LEGENDA_CHANGED);
  };


  this.clearEntries = function() {
      _entries = [];
      parentModel.getNotificationCenter().dispatch(Notifications.legenda.LEGENDA_CHANGED);
  }  ;


  this.getEntries = function() {
      return _entries;
  };

  this.setSelectedEntries = function(entriesNames) {
      _selectedEntries = _.filter(_entries,function(v){return _.contains(entriesNames, v.name);});
      parentModel.getNotificationCenter().dispatch(Notifications.legenda.SELECTED_CHANGED);
  }  ;

    /**
     * Select or deselect an entry
     * @param entryName
     */
  this.toggleEntry = function(entryName) {
      var entry = _.filter(_entries,function(v){return v.name == entryName;})[0];

      if(_.contains(_selectedEntries,entry)) {
          //remove
          _selectedEntries = _.without(_selectedEntries, entry);
      } else {
          //add
          _selectedEntries.push(entry);
      }

      parentModel.getNotificationCenter().dispatch(Notifications.legenda.SELECTED_ENTRIES_CHANGED);
  };


  this.getSelectedEntries = function() {
      return _selectedEntries.slice();
  };


  this.isEntrySelected = function(name) {
      return _.filter(_selectedEntries,function(v){return v.name == name;}).length > 0;
  };

  // PRIVATE METHODS


  
  var init = function() {
  } ();
  
  
}