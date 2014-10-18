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
    ////////////////////////////// PRIVATE ATTRIBUTES //////////////////////////////
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 2000, height: 880};

    // Tools
    var _playTimeViewController;
    var _weatherViewController;
    var _stationSelectionToolController;

    // Calendar sizes

    var _calendarPickerController;


    var _calendarToolController;




    ////////////////////////////// PUBLIC METHODS //////////////////////////////
    /**
     * Subclasses should override this method
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {
        var playToolWidth = 300;
        var height = 150;
        _playTimeViewController.getView().setFrame(0, self.getView().getViewBoxHeight() - height, playToolWidth, height);

        _weatherViewController.getView().setFrame(self.getView().getViewBoxWidth() -300, 0, 300, 300);

        // hide the calendar
        _calendarPickerController.hideCalendarPickerWithoutAnimation();

        // Update selection tool
        var stationSize = {width: 400, height: 100, marginLeft: 10};

        _stationSelectionToolController.getView()
            .setFrame(playToolWidth + stationSize.marginLeft, self.getView().getViewBoxHeight() - stationSize.height, stationSize.width, stationSize.height);

        // Call super method (updates children)
        superUpdateView.call(self);
    };





    ////////////////////////////// PRIVATE METHODS //////////////////////////////
    var draw = function() {


    };

    var init = function() {
        self.getView().addClass("play-day-tools-layout-view-controller");

        // Play time view controller
        _playTimeViewController = new UIPlayTimeViewController(self);
        self.add(_playTimeViewController);

        // Setup weather view controller
        _weatherViewController = new UIWeatherViewController(self);
        self.add(_weatherViewController);

        // Old
        _svgContainer
            .classed("DEBUG-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");

        _calendarPickerController = new CalendarPickerController(self);
        self.add(_calendarPickerController);
        _calendarToolController = new CalendarToolController(self, _calendarPickerController);
        self.add(_calendarToolController);

        // Stations selection tool
        _stationSelectionToolController = new UIStationsSelectionViewController(self);
        self.add(_stationSelectionToolController);

        draw();

    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);