//Colors which identify the VisualizationViewController
var avilableIdentificationColors = ["#F33","#AA9000","#AA90AA","#F33","#AA9000","#AA90AA","#e6550d"];
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


ColorsModel.colors = {
    //USED by legenda, ..
  "deselectedGray" : "#DDDDDD",

    //USED by PLAY A DAY
  "filteredBikes" : "#2c7fb8",
  "otherBikes" : "#AAAAAA",

  "totalFlow" : "#8e44ad",
  "inflow" : "#2c7bb6",
  "outflow" : "#d7191c"
};
