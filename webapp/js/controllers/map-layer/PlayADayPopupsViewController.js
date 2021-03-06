/**
 * @class: PlayADayPopupsViewController
 * @description template class
 *
 * @param parentController
 */

function PlayADayPopupsViewController(parentController) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _selectionModel = self.getModel().getSelectionModel();
    var __debug = true;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    var super_dispose = this.dispose;
    this.dispose = function() {
        super_dispose.call(self);


        self.getNotificationCenter().unsuscribeFromAll(self);
    };


    this.onDoubleClickOnStation = function() {

        var stationId = _selectionModel.getDoubleClickStation();

        if(stationId) {
            openPopup(stationId);
        }


    };


    ////////////// PRIVATE METHODS

    var openPopup = function(stationId) {
        //SET UP POPUP
        var popup = new PlayADayPopupViewController(self, stationId);
        self.add(popup);


    };

    var draw = function() {

    };

    var registerToNotifications = function() {

        self.getNotificationCenter().subscribe(self, self.onDoubleClickOnStation,
            Notifications.selections.DOUBLE_CLICK_ON_STATION);


    };





    var init = function() {

        draw();
        registerToNotifications();

        self.getView().getSvg().classed("play-a-day-popups-layer-view-controller-svg", true);


    } ();
}

// Inheritance
Utils.extend(PlayADayPopupsViewController, MapLayerController);