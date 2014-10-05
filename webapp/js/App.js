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

        //Before doing anything, load the base resources
        dbModel.loadBasicResources(function() {
            //Then init the window controller
            var body = d3.select("body");
            _mainWindowController = new WindowController(body);

            _mainWindowController.addMap();
            _mainWindowController.addMap();
            _mainWindowController.addMap();
        });


    } ();
}
