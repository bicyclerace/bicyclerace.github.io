/**
 * Class for the calendar tool
 */
function CalendarPickerController(parentController, svgContainer) {
    ToolTileViewController.call(this, parentController, svgContainer);
    // PRIVATE ATTRIBUTES
    var self = this;


    // UI
    var _viewBoxWidth = 300;
    var _viewBoxHeight = 300;


    // PUBLIC METHODS
    this.getAspectRatio = function() {
        return _viewBoxWidth / _viewBoxHeight;
    };

    /**
     * Show the picker
     */
    this.showCalendarPicker = function() {
        self.getContentBox().transition().attr("height","100%");
    };

    /**
     * Hide the  picker
     */
    this.hideCalendarPicker = function () {
        self.getContentBox().transition().attr("height",0);
    };

    /**
     * Hide the  picker
     */
    this.hideCalendarPickerWithoutAnimation = function () {
        self.getContentBox().attr("height",0);
    };

    // PRIVATE METHODS
    var draw = function() {

        //make it hidden

        //white rect background
        self.getContentBox()
                .append("rect")
                .classed("calendar-picker-controller-background", true)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("x",0)
                .attr("y",0);

    };

    var init = function() {
        svgContainer.classed("calendar-picker-controller", true);
        self.setPadding(0,0,0,0);
        self.setViewBox(_viewBoxWidth, _viewBoxHeight);
        draw();
    } ();
}

Utils.extend(CalendarPickerController, ToolTileViewController);