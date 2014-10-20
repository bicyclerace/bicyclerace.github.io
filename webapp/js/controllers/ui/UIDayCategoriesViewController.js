/**
 * @class UIDayCategoriesViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIDayCategoriesViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _image;

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     * @override
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super
        super_dispose.call(self);

        self.getNotificationCenter().unsuscribeFromAll(self);
    };

    /**
     * Handler for TIME_OF_THE_DAY_CHANGED notification
     */
    this.timeChanged = function() {
        if(self.getModel().getTimeModel().isCurrentCategory(TimeModel.DayCategories.SUNRISE)) {
            _image.setImagePath("img/weather-icons2/Sunrise.svg");
        } else if(self.getModel().getTimeModel().isCurrentCategory(TimeModel.DayCategories.SUNSET)) {
            _image.setImagePath("img/weather-icons2/Sunset.svg");
        } else if(self.getModel().getTimeModel().isCurrentCategory(TimeModel.DayCategories.DAY_TIME)) {
            _image.setImagePath("img/weather-icons2/Sun.svg");
        } else {
            _image.setImagePath("img/weather-icons2/Moon.svg");
        }
    };

    //////////////////// PRIVATE METHODS ///////////////////////

    // Init
    var init = function() {
        self.getView().addClass("ui-day-categories-view-controller");

        _image = new UIImageViewController(self);
        _image.getView().setFrame(0, 0, "100%", "100%");
        self.add(_image);

        self.getNotificationCenter().subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);
        self.timeChanged();
    } ();
}

Utils.extend(UIDayCategoriesViewController, ViewController);
