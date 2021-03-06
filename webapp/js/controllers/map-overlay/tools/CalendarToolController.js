/**
 * Class for the calendar tool
 */
function CalendarToolController(parentController, calendarPickerController) {
    ViewController.call(this, parentController);
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

    var _frame = {x: 0, y: 580, width:400 ,height: 200};
    var _padding = {top: 20, left: 25, bottom: 20, right: 30};

    // PUBLIC METHODS
    this.onDateChanged = function() {
         var currentDate = self.getModel().getTimeModel().getDate();
        _dateText.text(TimeModel.monthNames[currentDate.getMonth()].slice(0,3) + " " + currentDate.getDate());
    };

    // PRIVATE METHODS
    var draw = function() {



        _dateText =
            self.getView().getSvg()
            .append("text")
            .classed("calendar-tool-controller-day-text", true)
            .attr("x",_viewBoxWidth - _padding.right)
            .attr("y",47 + _padding.top)
            .attr("text-anchor","end")
            .text("");


        _backgroundButton =
            self.getView().getSvg()
                .append("rect")
                .classed("calendar-tool-controller-calendar-button-background", true)
                .classed("selected", false)
                .attr("width", _viewBoxHeight + _padding.left)
                .attr("height", "100%")
                .attr("opacity", 0)
                .attr("x",-15)
                .attr("y",0);

        _calendarButton =
            self.getView().getSvg()
                .append("image")
                .classed("calendar-tool-controller-calendar-button", true)
                .attr("xlink:href", "img/calendar-tool-controller-calendar-button.svg")
                .attr("width", _viewBoxHeight - _padding.top - _padding.bottom)
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
        self.getView().getSvg().classed("calendar-tool-controller", true);
        self.getView().getSvg().style("pointer-events", "visiblePainted");
        self.getView().setViewBox(0,0,_viewBoxWidth, _viewBoxHeight);
        self.getView().setFrame(_frame.x,_frame.y,_frame.width,_frame.height);

        self.getNotificationCenter().subscribe(self, self.onDateChanged,
            Notifications.time.DATE_CHANGED);

        draw();
        self.onDateChanged();
    } ();
}

Utils.extend(CalendarToolController, ViewController);