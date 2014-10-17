/**
 * @class UIWeatherViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIWeatherViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Weather icon image
    var _weatherIcon;

    // Temperature labels
    var _fahrenheitLabel;
    var _celsiusLabel;


    // Layout
    var _defaultViewBox = {x: 0, y: 0, width: 300, height: 300};
    var _padding = {top: 20, bottom: 10, left: 10, right: 10};

    var  _weatherIconHeight = 180;



    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     *
     */
    this.timeChanged = function() {
        var currentDate = self.getModel().getTimeModel().getDate();
        var conditions = self.getModel().getWeatherModel().getConditionAtTime(currentDate);
        var imgPath = "img/weather-icons/";
        if(self.getModel().getTimeModel().isDay()) {
            imgPath += weatherIconMapping[conditions].day;
        } else {
            imgPath += weatherIconMapping[conditions].night;
        }
        _weatherIcon.setImagePath(imgPath);

        // Change fahrenheit label
        var fahrenheit = self.getModel().getWeatherModel().getFahrenheitAtTime(currentDate);
        _fahrenheitLabel.setText(fahrenheit + "F");

        // Change celsius label
        var celsius = self.getModel().getWeatherModel().getCelsiusAtTime(currentDate);
        _celsiusLabel.setText(celsius + "°C");
        /*
         currentHours = currentHours % 12;
         currentHours = currentHours == 0 ? 12 : currentHours;
         _hoursLabel.setText(currentHours.toLocaleString("us-US", {minimumIntegerDigits: 2}));

         var currentMinutes = self.getModel().getTimeModel().getMinutes();
         _minutesLabel.setText(currentMinutes.toLocaleString("us-US", {minimumIntegerDigits: 2}));
         */
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

    };

    var draw = function() {
        drawWeatherIcon();
        drawFahrenheit();
        drawCelsius();
    };

    var drawWeatherIcon = function() {
        _weatherIcon.getView().setFrame(
            _padding.left,
            _padding.top,
            _defaultViewBox.width - _padding.left - _padding.right,
            _weatherIconHeight
        );

        _weatherIcon.getView().setViewBox(0, 0, _weatherIcon.getView().getFrameWidth(), _weatherIcon.getView().getFrameHeight());
        _weatherIcon.setImagePath("img/weather-icons/none.svg");
    };

    var drawFahrenheit = function() {
        var labelWidth = (_defaultViewBox.width - _padding.left - _padding.right) /2;
        _fahrenheitLabel.getView().setFrame(
            _padding.left,
            _padding.top + _weatherIconHeight,
            labelWidth,
            _defaultViewBox.height - _weatherIconHeight
        );

        _fahrenheitLabel.getView()
            .setViewBox(0, 0, _fahrenheitLabel.getView().getFrameWidth(), _fahrenheitLabel.getView().getFrameHeight());
        _fahrenheitLabel.setText("NA");
    };

    var drawCelsius = function() {
        var labelWidth = (_defaultViewBox.width - _padding.left - _padding.right) /2;
        _celsiusLabel.getView().setFrame(
            _defaultViewBox.width - _padding.right - labelWidth,
            _padding.top + _weatherIconHeight,
            labelWidth,
            _defaultViewBox.height - _weatherIconHeight
        );

        _celsiusLabel.getView()
            .setViewBox(0, 0, _celsiusLabel.getView().getFrameWidth(), _celsiusLabel.getView().getFrameHeight());
        _celsiusLabel.setText("NA");
    };

    var init = function() {
        // Add button css class
        self.getView().addClass("ui-weather-view-controller");
        self.getView().setViewBox(0, 0, _defaultViewBox.width, _defaultViewBox.height);

        // Setup weather
        _weatherIcon = new UIImageViewController(self);
        self.add(_weatherIcon);

        // Setup fahrenheit label
        _fahrenheitLabel = new UILabelViewController(self);
        self.add(_fahrenheitLabel);

        // Setup celsius label
        _celsiusLabel = new UILabelViewController(self);
        self.add(_celsiusLabel);

        // Subscribe
        self.getNotificationCenter()
            .subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);

        addBehaviours();
    } ();
}

Utils.extend(UIWeatherViewController, ViewController);

var weatherIconMapping = {
    "Drizzle" : {day:"rainy.svg", night:"rainy.svg"},
    "Light Drizzle" : {day:"rainy.svg", night:"rainy.svg"},
    "Heavy Drizzle" : {day:"rainy.svg", night:"rainy.svg"},
    "Rain" : {day:"rainy2.svg", night:"rainy2.svg"},
    "Light Rain" : {day:"rainy2.svg", night:"rainy2.svg"},
    "Heavy Rain" : {day:"rainy2.svg", night:"rainy2.svg"},
    "Snow" : {day:"snowy.svg", night:"snowy.svg"},
    "Light Snow" : {day:"snowy.svg", night:"snowy.svg"},
    "Heavy Snow" : {day:"snowy3.svg", night:"snowy3.svg"},
    "Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Ice Crystals" : {day:"snowy.svg", night:"snowy.svg"},
    "Light Ice Crystals" : {day:"snowy.svg", night:"snowy.svg"},
    "Heavy Ice Crystals" : {day:"snowy3.svg", night:"snowy3.svg"},
    "Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Mist" : {day:"weather.svg", night:"weather2.svg"},
    "Light Mist" : {day:"weather.svg", night:"weather2.svg"},
    "Heavy Mist" : {day:"lines.svg", night:"lines.svg"},
    "Fog" : {day:"none.svg", night:"none.svg"},
    "Light Fog" : {day:"none.svg", night:"none.svg"},
    "Heavy Fog" : {day:"none.svg", night:"none.svg"},
    "Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Light Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Heavy Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Smoke" : {day:"none.svg", night:"none.svg"},
    "Light Smoke" : {day:"none.svg", night:"none.svg"},
    "Heavy Smoke" : {day:"none.svg", night:"none.svg"},
    "Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Light Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Heavy Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Sand" : {day:"none.svg", night:"none.svg"},
    "Light Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Sand" : {day:"none.svg", night:"none.svg"},
    "Haze" : {day:"none.svg", night:"none.svg"},
    "Light Haze" : {day:"none.svg", night:"none.svg"},
    "Heavy Haze" : {day:"none.svg", night:"none.svg"},
    "Spray" : {day:"none.svg", night:"none.svg"},
    "Light Spray" : {day:"none.svg", night:"none.svg"},
    "Heavy Spray" : {day:"none.svg", night:"none.svg"},
    "Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Light Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Heavy Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Light Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Heavy Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Light Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Heavy Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Light Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Light Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Light Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Heavy Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Light Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Light Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Light Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},
    "Freezing Drizzle" : {day:"none.svg", night:"none.svg"},
    "Light Freezing Drizzle" : {day:"none.svg", night:"none.svg"},
    "Heavy Freezing Drizzle" : {day:"none.svg", night:"none.svg"},
    "Freezing Rain" : {day:"none.svg", night:"none.svg"},
    "Light Freezing Rain" : {day:"none.svg", night:"none.svg"},
    "Heavy Freezing Rain" : {day:"none.svg", night:"none.svg"},
    "Freezing Fog" : {day:"none.svg", night:"none.svg"},
    "Light Freezing Fog" : {day:"none.svg", night:"none.svg"},
    "Heavy Freezing Fog" : {day:"none.svg", night:"none.svg"},
    "Patches of Fog" : {day:"none.svg", night:"none.svg"},
    "Shallow Fog" : {day:"none.svg", night:"none.svg"},
    "Partial Fog" : {day:"none.svg", night:"none.svg"},
    "Overcast" : {day:"cloudy2.svg", night:"cloudy2.svg"},
    "Clear" : {day:"sun.svg", night:"moon.svg"},
    "Partly Cloudy" : {day:"cloudy.svg", night:"cloud.svg"},
    "Mostly Cloudy" : {day:"cloudy2.svg", night:"cloudy2.svg"},
    "Scattered Clouds" : {day:"cloudy.svg", night:"cloud.svg"},
    "Small Hail" : {day:"none.svg", night:"none.svg"},
    "Squalls" : {day:"none.svg", night:"none.svg"},
    "Funnel Cloud" : {day:"none.svg", night:"none.svg"},
    "Unknown Precipitation" : {day:"rainy2.svg", night:"rainy2.svg"},
    "Unknown" : {day:"none.svg", night:"none.svg"}
};