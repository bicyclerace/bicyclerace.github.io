/**
 * @class: App
 * @description ...
 */
function App() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _mainWindowController;

    // PUBLIC METHODS



    // PRIVATE METHODS


    /**
     * Initialization stuffs
     */
    var init = function() {
        var body = d3.select("body");
        _mainWindowController = new WindowController(body);

        _mainWindowController.addMap();
    } ();
}
