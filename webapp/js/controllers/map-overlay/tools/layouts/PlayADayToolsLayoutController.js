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

    var _dayCategoriesTool;

    // Calendar sizes
    var _calendarPickerController;

    var _calendarToolController;

    // Community grid
    var _gridShowButton;


    ////////////////////////////// PUBLIC METHODS //////////////////////////////
    /**
     * Subclasses should override this method
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {

        _gridShowButton.getView().setFrame(0, 150, 100, 100);
        _gridShowButton.getView().setViewBox(0, 0, 100, 100);

        var playToolBox = {
            width: 300,
            height: 150
        };
        var playToolWidth = 300;
        var height = 150;
        _playTimeViewController.getView()
            .setFrame(0, self.getView().getViewBoxHeight() - playToolBox.height, playToolBox.width, playToolBox.height);

        _weatherViewController.getView().setFrame(self.getView().getViewBoxWidth() -300, 0, 300, 300);
        //_weatherViewController.getView().setFrame("70%", 0, 300, 300);

        // hide the calendar
        _calendarPickerController.hideCalendarPickerWithoutAnimation();

        // Update selection tool
        var stationSize = {width: 400, height: 100, marginLeft: 10};

        _stationSelectionToolController.getView()
            .setFrame(self.getView().getViewBoxWidth() - stationSize.width,//playToolWidth + stationSize.marginLeft,
                self.getView().getViewBoxHeight() - stationSize.height,
            stationSize.width,
            stationSize.height);

        // Day categories tool
        var margin = 10;
        _dayCategoriesTool.getView().setFrame(
                playToolBox.width + margin,
            self.getView().getViewBoxHeight() - playToolBox.height,
            playToolBox.height,
            playToolBox.height);
        _dayCategoriesTool.getView().setViewBox(0, 0, playToolBox.height, playToolBox.height);

        // Call super method (updates children)
        superUpdateView.call(self);
    };





    ////////////////////////////// PRIVATE METHODS //////////////////////////////
    var draw = function() {


    };

    // PRIVATE METHODS
    var addBehaviors = function() {
        _gridShowButton.onClick(function() {
            var status = self.getModel().getMapModel().getGridStatus();
            self.getModel().getMapModel().setGridStatus(!status);
        });
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

        // Add day categories tool
        _dayCategoriesTool = new UIDayCategoriesViewController(self);
        self.add(_dayCategoriesTool);

        _gridShowButton = new UIButtonViewController(self);
        _gridShowButton.getView().addClass("community-grid-button");
        _gridShowButton.setImage("img/community-grid-icon.svg");
        self.add(_gridShowButton);

        addBehaviors();

        draw();

    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);