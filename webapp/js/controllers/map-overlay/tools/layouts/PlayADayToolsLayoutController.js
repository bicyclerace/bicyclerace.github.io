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
    var _calendarPickerBox = {x: 10, y: 450, height: 600};
    var _calendarPickerController;

    var _calendarToolBox = {x: 10, y: 250, height: 200};
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


        // Call super method (updates children)
        superUpdateView.call(self);
    };

    // PRIVATE METHODS
    var draw = function() {
        // Add calendar


        var calendarPickerSvg = _svgContainer.append("svg");
        var calendarToolSvg = _svgContainer.append("svg");


        _calendarPickerController = new CalendarPickerController(self, calendarPickerSvg);
        _calendarToolController = new CalendarToolController(self, calendarToolSvg, _calendarPickerController);

        calendarToolSvg
            .attr("x", _calendarToolBox.x)
            .attr("y", _calendarToolBox.y)
            .attr("width", _calendarToolController.getAspectRatio() * _calendarToolBox.height)
            .attr("height", _calendarToolBox.height);

        calendarPickerSvg
            .attr("x", _calendarPickerBox.x)
            .attr("y", _calendarPickerBox.y)
            .attr("width", _calendarPickerController.getAspectRatio() * _calendarPickerBox.height)
            .attr("height", _calendarPickerBox.height);

        _calendarPickerController.hideCalendarPickerWithoutAnimation();

        //self.getView().getSvg().append(_svgContainer);

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
        draw();

    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);