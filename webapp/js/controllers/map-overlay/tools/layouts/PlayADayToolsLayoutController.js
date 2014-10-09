/**
 * @class PlayADayToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PlayADayToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 3200, height: 1000};

    // Tools
    var _playDayBox = {x: 10, y: 10, height: 200};
    var _playToolController;

    var _calendarPickerBox = {x: 10, y: 450, height: 600};
    var _calendarPickerController;

    var _calendarToolBox = {x: 10, y: 250, height: 200};
    var _calendarToolController;

    // PUBLIC METHODS

    // PRIVATE METHODS
    var draw = function() {
        // Adding play a day tool
        var playDaySvg =
            _svgContainer.append("svg")
                .classed("play-day-tool-controller", true);

        _playToolController = new PlayDayToolController(self, playDaySvg);
        playDaySvg
            .attr("width", _playToolController.getAspectRatio() * _playDayBox.height)
            .attr("height", _playDayBox.height);


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


    };

    var init = function() {
        _svgContainer
            .classed("play-day-tool-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        draw();
    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);