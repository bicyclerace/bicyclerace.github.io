/**
 * Class for the calendar tool
 */
function CalendarPickerController(parentController) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    var _daysTexts = {};
    var _daysBackgrounds = {};

    // UI
    var _viewBoxWidth = 300;
    var _viewBoxHeight = 300;

    var _frame = {x: 0, y: 580-400, width:400, height: 400};
    var _padding = {top: 10, left: 50, bottom: 10, right: 20};
    var _titleHeight = 40;

    var _monthLabel;

    // PUBLIC METHODS
    this.getAspectRatio = function() {
        return _viewBoxWidth / _viewBoxHeight;
    };

    /**
     * Show the picker
     */
    this.showCalendarPicker = function() {
        //self.getView().getSvg().transition().attr("y",580-_frame.height).attr("height","100%");
        $(self.getView().getSvg()[0]).show(200);
    };

    /**
     * Hide the  picker
     */
    this.hideCalendarPicker = function () {
        //self.getView().getSvg().transition().attr("y",580).attr("height",0);
        $(self.getView().getSvg()[0]).hide(200);
    };

    /**
     * Hide the  picker
     */
    this.hideCalendarPickerWithoutAnimation = function () {
        //self.getView().getSvg().attr("height",0);
        $(self.getView().getSvg()[0]).hide();
    };

    /**
     * Change currently displayed day or month
     */
    this.onDayChanged = function() {

        var currentDate = self.getModel().getTimeModel().getDate();
        draw(currentDate);

        for(var k in _daysTexts){
            _daysTexts[k].classed("selected",false);
            _daysBackgrounds[k].classed("selected",false);
        }

        _daysTexts[currentDate.getDate()].classed("selected", true);
        _daysBackgrounds[currentDate.getDate()].classed("selected", true);

        var currentMonth = currentDate.getMonth();
        _monthLabel.setText(TimeModel.monthNames[currentMonth].slice(0, 3));
    };


    // PRIVATE METHODS
    var draw = function(date) {
        self.getView().getSvg().html("");
        //make it hidden

        //white rect background
        self.getView().getSvg()
                .append("rect")
                .classed("calendar-picker-controller-background", true)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("x",0)
                .attr("y",0);

        //days
        _daysBackgrounds = {};
        _daysTexts = {};

        var daysPerLine = 6;
        var lines = 6;
        for(var i = 1; i <= TimeModel.daysInMonth(date.getMonth(), 2013); i++){
            var x = _padding.left + ((_viewBoxWidth - _padding.left - _padding.right) / daysPerLine)*(i%daysPerLine);
            var y = _padding.top*4 + _titleHeight + ((_viewBoxHeight - _padding.top - _padding.bottom - _titleHeight) / lines) *Math.floor(i/daysPerLine);

            var width = (_viewBoxWidth - _padding.left - _padding.right) / daysPerLine;
            var height = width;

            var textBackground =
                self.getView().getSvg()
                    .append("rect")
                    .datum(i)
                    .classed("calendar-picker-controller-text-background", true)
                    .attr("x",x - width/2)
                    .attr("y",y - height/2)
                    .attr("width",width)
                    .attr("height",height);


            _daysBackgrounds[i] = textBackground;


            var dayText =
                self.getView().getSvg()
                .append("text")
                .datum(i)
                .classed("calendar-picker-controller-text", true)
                .attr("x",x)
                .attr("y",y)
                .attr("text-anchor", "middle")
                .text(i)
                .on("click",
                function(day){
                    self.getModel().getTimeModel().setDayOfTheMonth(day);
                });

            _daysTexts[i] = dayText;

        }

        //month
        _monthLabel = new UILabelViewController(self);
        _monthLabel.getView().getSvg().classed("calendar-picker-controller-month-label",true);
        _monthLabel.getView().setFrame(0, _padding.top, _viewBoxWidth, _titleHeight );
        _monthLabel.setText("Jan");
        self.add(_monthLabel);

        //plus and minus
        var plusButton = new UIButtonViewController(self);
        plusButton.getView().getSvg().classed("calendar-picker-controller-month-button",true);
        plusButton.setTitle("+");
        plusButton.onClick(self.getModel().getTimeModel().nextMonth);
        plusButton.getView().setFrame(_viewBoxWidth/2 + 45, _padding.top + 10, 15, _titleHeight );
        self.add(plusButton);

        var minusButton = new UIButtonViewController(self);
        minusButton.getView().getSvg().classed("calendar-picker-controller-month-button",true);
        minusButton.setTitle("-");
        minusButton.onClick(self.getModel().getTimeModel().previousMonth);
        minusButton.getView().setFrame(_viewBoxWidth/2 - 50, _padding.top + 10, 15, _titleHeight );
        self.add(minusButton);
    };


    var init = function() {
        self.getView().getSvg().classed("calendar-picker-controller", true);
        self.getView().getSvg().style("pointer-events", "visiblePainted");
        self.getView().setViewBox(0,0,_viewBoxWidth, _viewBoxHeight);
        self.getView().setFrame(_frame.x,_frame.y,_frame.width,_frame.height);

        self.getNotificationCenter().subscribe(self, self.onDayChanged,
                Notifications.time.DATE_CHANGED);

        self.onDayChanged();
    } ();
}

Utils.extend(CalendarPickerController, ViewController);