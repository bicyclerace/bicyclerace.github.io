/**
 * @class UIPlayTimeViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIPlayTimeViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Play button
    var _playButton;

    // Hours
    var _hoursLabel;
    var _hoursUpButton;
    var _hoursDownButton;

    // Minutes
    var _minutesLabel;
    var _minutesUpButton;
    var _minutesDownButton;

    // AM-PM buttons
    var _amButton;
    var _pmButton;

    // Layout
    var _defaultViewBox = {x: 0, y: 0, width: 600, height: 300};
    var _padding = {top: 10, bottom: 10, left: 10, right: 10};
    var _labelPadding = {top: 4, bottom: 4, left: 4, right: 4};

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     *
     */
    this.timeChanged = function() {
        var currentHours = self.getModel().getTimeModel().getHours();

        if(currentHours > 0 && currentHours <= 12) {
            _amButton.select();
            _pmButton.deselect();
        } else {
            _amButton.deselect();
            _pmButton.select();
        }

        currentHours = currentHours % 12;
        currentHours = currentHours == 0 ? 12 : currentHours;
        _hoursLabel.setText(currentHours.toLocaleString("us-US", {minimumIntegerDigits: 2}));

        var currentMinutes = self.getModel().getTimeModel().getMinutes();
        _minutesLabel.setText(currentMinutes.toLocaleString("us-US", {minimumIntegerDigits: 2}));
    };

    /**
     * @override
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {
        draw();
        self.timeChanged();
        // Call super method
        superUpdateView.call(self);
    };


    //////////////////// PRIVATE METHODS ///////////////////////
    var addBehaviours = function() {
        _playButton.onClick(function() {
            if(self.getModel().getTimeModel().getPlayState() != AnimationState.PLAY) {
                self.getModel().getTimeModel().setPlayState(AnimationState.PLAY);
                _playButton.setTitle("PAUSE");
            } else {
                self.getModel().getTimeModel().setPlayState(AnimationState.PAUSE);
                _playButton.setTitle("PLAY");
            }
        });

        _hoursUpButton.onClick(function() {
            var currentHours = self.getModel().getTimeModel().getHours();
            currentHours = (currentHours +1) % 24;
            self.getModel().getTimeModel().setHours(currentHours);
        });

        _hoursDownButton.onClick(function() {
            var currentHours = self.getModel().getTimeModel().getHours();
            currentHours = (currentHours +24 -1) % 24;
            self.getModel().getTimeModel().setHours(currentHours);
        });

        _minutesUpButton.onClick(function() {
            var currentMinutes = self.getModel().getTimeModel().getMinutes();
            currentMinutes = (currentMinutes +5) % 60;
            self.getModel().getTimeModel().setMinutes(currentMinutes);
        });

        _minutesDownButton.onClick(function() {
            var currentMinutes = self.getModel().getTimeModel().getMinutes();
            currentMinutes = (currentMinutes + 60 -5) % 60;
            self.getModel().getTimeModel().setMinutes(currentMinutes);
        });

        _amButton.onClick(function() {
            var currentHours = self.getModel().getTimeModel().getHours();
            currentHours = currentHours % 12;
            currentHours = currentHours == 0 ? 12 : currentHours;
            self.getModel().getTimeModel().setHours(currentHours);
        });

        _pmButton.onClick(function() {
            var currentHours = self.getModel().getTimeModel().getHours();
            currentHours = currentHours % 12;
            currentHours = currentHours == 0 ? 0 : currentHours + 12;
            self.getModel().getTimeModel().setHours(currentHours);
        });
    };

    var draw = function() {
        drawPlayButton();
        drawHours();
        drawMinutes();
        drawAMPM();
    };

    var drawPlayButton = function() {
        // Setup play button
        _playButton.getView()
            .setFrame(
            _padding.left,
            _padding.top,
                (_defaultViewBox.width - _padding.left - _padding.right) / 4
            , _defaultViewBox.height - _padding.top - _padding.bottom);
        _playButton.getView().setViewBox(0, 0, _playButton.getView().getFrameWidth(), _playButton.getView().getFrameHeight());
        _playButton.setTitle("PLAY");
    };

    var drawHours = function() {
        // Setup hours Label
        var width = ((_defaultViewBox.width - _padding.left - _padding.right) / 4);
        var height = ((_defaultViewBox.height - _padding.top - _padding.bottom) / 4);

        var labelWidth = width - _labelPadding.left - _labelPadding.right;
        var labelHeight = (height *2) - _labelPadding.top - _labelPadding.bottom;

        _hoursLabel.getView().setFrame(
                _padding.left + _labelPadding.left + width,
                _padding.top + _labelPadding.top + height,
                labelWidth,
                labelHeight
        );
        _hoursLabel.getView().setViewBox(0, 0, width, height * 2);
        _hoursLabel.setText(self.getModel().getTimeModel().getHours());

        // Setup hours buttons
        _hoursUpButton.getView().setFrame(
                _padding.left + width,
            _padding.top,
            width,
            height
        );
        _hoursUpButton.getView().setViewBox(0, 0, width, height);
        _hoursUpButton.setTitle("+");


        _hoursDownButton.getView().setFrame(
                _padding.left + width,
                _padding.top + height * 3,
            width,
            height
        );
        _hoursDownButton.getView().setViewBox(0, 0, width, height);
        _hoursDownButton.setTitle("-");
    };

    var drawMinutes = function() {
        // Setup minutes Label
        var width = ((_defaultViewBox.width - _padding.left - _padding.right) / 4);
        var height = ((_defaultViewBox.height - _padding.top - _padding.bottom) / 4);

        var labelWidth = width - _labelPadding.left - _labelPadding.right;
        var labelHeight = (height *2) - _labelPadding.top - _labelPadding.bottom;

        // Minutes label
        _minutesLabel.getView().setFrame(
                _padding.left + _labelPadding.left + width * 2,
                _padding.top + _labelPadding.top + height,
                labelWidth,
                labelHeight
        );
        _minutesLabel.getView().setViewBox(0, 0, width, height * 2);
        _minutesLabel.setText(self.getModel().getTimeModel().getMinutes());
        //self.getView().add(_minutesLabel.getView());


        // Setup minutes buttons
        _minutesUpButton.getView().setFrame(
            _padding.left + width *2,
            _padding.top,
            width,
            height
        );
        _minutesUpButton.getView().setViewBox(0, 0, width, height);
        _minutesUpButton.setTitle("+");
        //self.getView().add(_minutesUpButton.getView());

        _minutesDownButton.getView().setFrame(
                _padding.left + width * 2,
                _padding.top + height * 3,
            width,
            height
        );
        _minutesDownButton.getView().setViewBox(0, 0, width, height);
        _minutesDownButton.setTitle("-");
        //self.getView().add(_minutesDownButton.getView());
    };

    var drawAMPM = function() {
        // Setup minutes Label
        var width = ((_defaultViewBox.width - _padding.left - _padding.right) / 4);
        var height = ((_defaultViewBox.height - _padding.top - _padding.bottom) / 4);

        // Setup minutes buttons
        _amButton.getView().setFrame(
                _padding.left + width *3,
            _padding.top + height,
            width,
            height
        );
        _amButton.getView().setViewBox(0, 0, width, height);
        _amButton.setTitle("AM");
        //self.getView().add(_amButton.getView());


        _pmButton.getView().setFrame(
                _padding.left + width * 3,
                _padding.top + height * 2,
            width,
            height
        );
        _pmButton.getView().setViewBox(0, 0, width, height);
        _pmButton.setTitle("PM");
        //self.getView().add(_pmButton.getView());
    };

    var init = function() {
        // Add button css class
        self.getView().addClass("ui-play-time-view-controller");
        self.getView().setViewBox(0, 0, _defaultViewBox.width, _defaultViewBox.height);

        _playButton = new UIButtonViewController(self);
        self.add(_playButton);

        _hoursLabel = new UILabelViewController(self);
        self.add(_hoursLabel);

        _hoursUpButton = new UIButtonViewController(self);
        self.add(_hoursUpButton);

        _hoursDownButton = new UIButtonViewController(self);
        self.add(_hoursDownButton);

        _minutesLabel = new UILabelViewController(self);
        self.add(_minutesLabel);

        _minutesUpButton = new UIButtonViewController(self);
        self.add(_minutesUpButton);

        _minutesDownButton = new UIButtonViewController(self);
        self.add(_minutesDownButton);

        _amButton = new UIButtonViewController(self);
        self.add(_amButton);

        _pmButton = new UIButtonViewController(self);
        self.add(_pmButton);

        //draw();
        //self.timeChanged();

        // Subscribe
        self.getNotificationCenter()
            .subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);

        addBehaviours();
    } ();
}

Utils.extend(UIPlayTimeViewController, ViewController);