
/**
 * @class: BoundRectViewController
 * @description controller of the map of chicago which works as an overview of all the opened maps
 *
 * @param htmlContainer = a d3 selection of the html container inside which the BoundRectViewController should
 * render its view.
 */
function BoundRectViewController(parent, model ,overviewProjection) {
    // Call the base class constructor
    ViewController.call(this, parent);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _svgContainer;
    var _mapModel = model.getMapModel();
    var _model = model;
    var _overviewProjection = overviewProjection;


    var _padding = {left: 20, top: 30, right: 20, bottom: 20};




    // PUBLIC METHODS

    this.mapPositionOrZoomChanged = function() {
        var focusPoint = _mapModel.getMapBounds().getCenter();

        var position = _overviewProjection([focusPoint.lng,focusPoint.lat]);
        var bottomLeftCoord = _mapModel.getMapBounds()._southWest;

        var bottomLeftPoint = _overviewProjection([bottomLeftCoord.lng,bottomLeftCoord.lat]);

        var width = (position[0] - bottomLeftPoint[0])*2;
        var height = (bottomLeftPoint[1] - position[1])*2;

        self.getView().setFrame(position[0] - width/2,position[1] - height/2, width, height);
        self.getView().setViewBox(0,0, width, height);

        //add background rect

    };


    // PRIVATE METHODS
    var draw = function() {


        //add background rect
        self.getView().getSvg().append("rect")
            .classed("overview-map-controller-bound-rect", true)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("stroke", _model.getColorModel().getIdentificationColor());
        self.mapPositionOrZoomChanged();

    };


    var init = function() {
        //subscriptions
        _model.getNotificationCenter().subscribe(self, self.mapPositionOrZoomChanged,
            Notifications.mapController.MAP_POSITION_OR_ZOOM_CHANGED);



        draw();
    } ();
}


Utils.extend(BoundRectViewController, ViewController);


























