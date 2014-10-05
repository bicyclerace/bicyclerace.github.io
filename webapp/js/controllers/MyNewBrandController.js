
function BrandNew (parent, htmlContainer) {
    ViewController.call(this,parent);
    var self = this;

    var _ANDThanksMAXForThisCodeStyleHintmyPrivateVariable;

    var privateFUnction = function() {

    }


    self.callbackToTHeEvent = function(notification) {



        console.log("bau");
        self.getNotificationCenter().dispatch(Notifications.newGroupOfNotifications.SOMETHINGS_HAS_HAPPENED);


    };


    var init = function() {

            self.getNotificationCenter().subscribe(self,self.callbackToTHeEvent, Notifications.mapController.STATION_HAS_BEEN_SELECTED,"one");


    }();



}

Utils.extend(BrandNew, ViewController);