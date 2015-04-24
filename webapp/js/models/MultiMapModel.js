/**
 *
 * @constructor
 */
function MultiMapModel () {

    var _openedMaps = [false, false];

    this.toggleMap = function(id) {

        if(_openedMaps[id]) {
            divvyApp.getMainWindowController().removeMap(id);
            _openedMaps[id] = false;
        } else {
            _openedMaps[id] = divvyApp.getMainWindowController().addMap();
        }

        sharedNotificationCenter.dispatch(Notifications.mapContainerController.MAP_CONFIGURATION_CHANGED);
    };


    this.getOpenedMaps = function() {
        return _openedMaps.slice();
    };

    this.getAvailableMapsCount = function() {
        return _openedMaps.length;
    };




}

var multiMapModel = multiMapModel || new MultiMapModel();