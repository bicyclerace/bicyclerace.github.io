/**
 * @class PlayADayToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PlayADayToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController || undefined);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 2000, height: 880};

    // Tools
    var _playTimeViewController;

    // Calendar sizes

    var _calendarPickerController;


    var _calendarToolController;

    // PUBLIC METHODS
    /**
     * Subclasses should override this method
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {
        var width = 300;
        var height = 150;
        _playTimeViewController.getView().setFrame(0, self.getView().getViewBoxHeight() - height, width, height);

        // hide the calendar
        _calendarPickerController.hideCalendarPickerWithoutAnimation();

        // Call super method (updates children)
        superUpdateView.call(self);
    };

    // PRIVATE METHODS
    var draw = function() {


    };

    var init = function() {
        self.getView().addClass("play-day-tools-layout-view-controller");

        // Play time view controller
        _playTimeViewController = new UIPlayTimeViewController(self);
        self.add(_playTimeViewController);

        // Old
        _svgContainer
            .classed("DEBUG-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");

        _calendarPickerController = new CalendarPickerController(self);
        self.add(_calendarPickerController);
        _calendarToolController = new CalendarToolController(self, _calendarPickerController);
        self.add(_calendarToolController);

        draw();

    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);