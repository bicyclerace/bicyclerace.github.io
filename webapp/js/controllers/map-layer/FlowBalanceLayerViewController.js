/**
 * @class: FlowBalanceLayerViewController
 * @description template class
 *
 * @param parentController
 */
function FlowBalanceLayerViewController(parentController, layerGroup) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _maxCircleRadius = 10;
    var _barWidth = 0.7;


    var __debug = true;



    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {

    };

    ////////////// PRIVATE METHODS


    this.drawInflowOutflow = function(flowJson) {
        if(__debug)console.log(flowJson);

        var maxFlow = _.max(flowJson,function(d){return Math.max(parseInt(d.inflow),parseInt(d.outflow));});

        var maxFlowValue = Math.max(parseInt(maxFlow.inflow),parseInt(maxFlow.outflow));

        for(var i in flowJson){
            var flow = flowJson[i];
            var inflow = flowJson[i].inflow;
            var outflow = flowJson[i].outflow;
            var coord = databaseModel.getStationCoordinates(flow.station_id);
            var p = self.project(coord[0], coord[1]);


            var h_inflow = (parseInt(inflow)/ maxFlowValue) * _maxCircleRadius;
            var h_outflow = (parseInt(outflow)/ maxFlowValue) * _maxCircleRadius;
            //if(__debug)console.log("add inflow " + )
            /*self.getView().getSvg().append("circle")
                .classed("flow-balance-layer-circle-inflow",true)
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", r)
                .attr("opacity", 0.7)
                .attr("stroke",  "#3333FF")
                .attr("fill", "none")
                .attr("stroke-color",1);*/

            self.getView().getSvg().append("rect")
                .classed("flow-balance-layer-histogram-inflow",true)
                .attr("x", p.x-_barWidth)
                .attr("y", p.y-h_inflow)
                .attr("width", _barWidth)
                .attr("height", h_inflow)
                .attr("fill", ColorsModel.colors.inflow)

                ;

            self.getView().getSvg().append("rect")
                    .classed("flow-balance-layer-histogram-outflow",true)
                    .attr("x", p.x)
                    .attr("y", p.y-h_outflow)
                    .attr("width", _barWidth)
                    .attr("height", h_outflow)
                    .attr("fill", ColorsModel.colors.outflow)
            ;

        }


    };



    var draw = function() {

        var stations = databaseModel.getStations();

        //Baseline
        for(var s in stations){
            var station = stations[s];
            var coord = databaseModel.getStationCoordinates(station.station_id);
            var p = self.project(coord[0], coord[1]);
            self.getView().getSvg()
                .append("line")
                .classed("flow-balance-layer-baseline",true)
                .attr("x1", p.x + _barWidth + 0.2)
                .attr("y1", p.y + 0.05)
                .attr("x2", p.x - _barWidth - 0.2)
                .attr("y2", p.y + 0.05)

            ;
        }
    };



    var init = function() {
        var timeModel = self.getModel().getTimeModel();
        databaseModel.getStationsInflowAndOutflow(timeModel.getStartDate(),timeModel.getEndDate(),self.drawInflowOutflow);

        //Legenda
        self.getModel().getLegendaModel().setEntries(
            [
                {name:"inflow" , color:ColorsModel.colors.inflow},
                {name:"outflow" , color:ColorsModel.colors.outflow}
            ]
        );


        draw();





    } ();
}

// Inheritance
Utils.extend(FlowBalanceLayerViewController, MapLayerController);