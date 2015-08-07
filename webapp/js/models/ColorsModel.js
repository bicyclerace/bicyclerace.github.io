//Colors which identify the VisualizationViewController
var identificationColors = ["#e6550d","#2ca25f"];
var availableIdentificationColors = identificationColors.slice();
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
        var color = availableIdentificationColors.pop();
        identificationColorsBindings[modelId] = color;
        return color;
    };


    this.unbindIdentificationColor = function(modelId) {
        availableIdentificationColors.push(identificationColorsBindings[modelId]);
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
