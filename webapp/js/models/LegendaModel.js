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
  var _staticEntries = [];

  // PUBLIC METHODS

    /**
     *
     * @param entries = [{color: .. , name: ..]
     */
  this.setEntries = function (entries) {
    _entries = entries;
      parentModel.getNotificationCenter().dispatch(Notifications.legenda.LEGENDA_CHANGED);
  };

    /**
     * ENTRIES NON SELECTABLE
     * @param entries
     */
  this.setStaticEntries = function (entries) {
        _entries = entries;
        parentModel.getNotificationCenter().dispatch(Notifications.legenda.LEGENDA_CHANGED);
      _staticEntries = entries;
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


  this.isEntryStatic = function(name) {
        return _.filter(_staticEntries,function(v){return v.name == name;}).length > 0;
  };

  // PRIVATE METHODS


  
  var init = function() {
  } ();
  
  
}