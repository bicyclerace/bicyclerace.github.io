//Colors which identify the VisualizationViewController
var avilableIdentificationColors = ["#F33","#FF9000"];
var identificationColorsBindings = {};

/**
 *
 * @param modelId
 * @constructor
 */
function ColorsModel(modelId) {
    var self = this;
    var _modelId = modelId;

    var _identificationColor;

    //PUBLIC METHODS
    this.getIdentificationColor = function() {
        return _identificationColor;
    };


    var bindIdentificationColor = function(modelId) {
        var color = avilableIdentificationColors.pop();
        identificationColorsBindings[modelId] = color;
        return color;
    };


    var unbindIdentificationColor = function(modelId) {
        avilableIdentificationColors.push(identificationColorsBindings[modelId]);
        delete identificationColorsBindings[modelId];
    };

    var init = function(){
        _identificationColor = bindIdentificationColor(_modelId);
    }();
}
