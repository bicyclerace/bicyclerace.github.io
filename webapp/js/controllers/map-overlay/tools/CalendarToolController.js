/**
 * Class for the calendar tool
 */
function CalendarToolController(parentController, svgContainer, calendarPickerController) {
    ToolTileViewController.call(this, parentController, svgContainer);
    // PRIVATE ATTRIBUTES
    var self = this;

    var _calendarPickerController = calendarPickerController;
    var _isCalendarPickerVisible = false;

    //Components
    var _dateText,
        _calendarButton,
        _backgroundButton;

    // UI
    var _viewBoxWidth = 300;
    var _viewBoxHeight = 100;

    var _padding = {top: 10, left: 10, bottom: 10, right: 10};

    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {

        _dateText =
            self.getContentBox()
            .append("text")
            .classed("calendar-tool-controller-day-text", true)
            .attr("x",0)
            .attr("y",0)
            .text("Jan 21");


        _backgroundButton =
            self.getContentBox()
                .append("rect")
                .classed("calendar-tool-controller-calendar-button-background", true)
                .classed("selected", false)
                .attr("width", _viewBoxHeight + _padding.left*2)
                .attr("height", "100%")
                .attr("opacity", 0)
                .attr("x",-15)
                .attr("y",0);

        _calendarButton =
            self.getContentBox()
                .append("image")
                .classed("calendar-tool-controller-calendar-button", true)
                .attr("xlink:href", "img/calendar-tool-controller-calendar-button.svg")
                .attr("width", _viewBoxHeight - _padding.left - _padding.right)
                .attr("height", _viewBoxHeight - _padding.top - _padding.bottom)
                .attr("x", _padding.left)
                .attr("y", _padding.top)
                .on("click", toggleCalendarPicker);
    };


    var toggleCalendarPicker = function() {
        if(_isCalendarPickerVisible){
            _calendarPickerController.hideCalendarPicker();
            _calendarButton.classed("selected", false)
                    .attr("xlink:href", "img/calendar-tool-controller-calendar-button.svg");
            _backgroundButton.attr("opacity",0);
            _isCalendarPickerVisible = false;
        } else {
            _calendarPickerController.showCalendarPicker();
            _calendarButton.classed("selected", true)
                    .attr("xlink:href", "img/calendar-tool-controller-calendar-button-selected.svg");
            _backgroundButton.attr("opacity",1);
            _isCalendarPickerVisible = true;
        }
    };

    var init = function() {
        svgContainer.classed("calendar-tool-controller", true);
        self.setViewBox(_viewBoxWidth, _viewBoxHeight);

        //reset parent padding.
        self.setPadding(0,0,0,0);
        draw();
    } ();
}

Utils.extend(CalendarToolController, ToolTileViewController);