/**
 * @class UILegendaViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UILegendaViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Buttons
    var _selectAllButton;
    var _deselectAllButton;
    var _applyActionToCommunityButton;


    // Layout
    var _defaultViewBox = {x: 0, y: 0, width: 200, height: 400};
    var _padding = {top: 10, bottom: 10, left: 14, right: 10};
    var _title_margin_bottom = 50;
    var _title_height = 0;
    var _entry_height = 50;
    var _circle_radius = 15;
    var _titleLabel;

    var _legendaEntriesGroup;
    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     * @override
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {


        // Call super method
        superUpdateView.call(self);
    };


    this.onLegendaChanged = function() {
        drawLegenda();
    };

    this.onSelectedEntriesChanged = function() {
        drawLegenda();
    };


    //////////////////// PRIVATE METHODS ///////////////////////


    var drawLegenda = function() {
        _legendaEntriesGroup.html("");

        var legendaModel = self.getModel().getLegendaModel();
        var entries = legendaModel.getEntries();

        // for(var e in entries) {
       // var entry = entries[e];
       // var color = entry.color;
       // var name = entry.name;

        _legendaEntriesGroup
            .selectAll("text")
            .data(entries)
            .enter()
            .append("text")
            .classed("clickable-item", true)
            .classed("ui-legenda-view-controller-entry", true)
            .attr("x", _padding.left * 2 + _circle_radius * 2)
            .attr("pointer-events","visiblePainted")
            .attr("y", function (d, i) {
                return i * _entry_height;
            })
            .text(function (d) {
                return d.name;
            })
            .on("click", function(d){
                legendaModel.toggleEntry(d.name);
            })
        ;

       _legendaEntriesGroup
                .selectAll("circle")
                .data(entries)
                .enter()
                .append("circle")
                .classed("ui-legenda-view-controller-circle", true)
                .attr("cx", _padding.left + _circle_radius)
                .attr("cy",function(d,i){return i * _entry_height - 12;})
                .attr("r", _circle_radius)
                .attr("stroke", "#FFFFFF")
                .attr("stroke-width", 3)
                .attr("pointer-events","visiblePainted")
                .attr("fill", function(d){
                    var circle_color = legendaModel.isEntrySelected(d.name) ? d.color : ColorsModel.colors.deselectedGray;
                return circle_color;})
                .on("click", function(d){
                     legendaModel.toggleEntry(d.name);
                })
            ;

    };

    var init = function() {
        // Add button css class
        self.getView().addClass("ui-legenda-view-controller");
        //NO VIEWBOX
        //self.getView().setViewBox(0, 0, _defaultViewBox.width, _defaultViewBox.height);

        /*
        NO TITLE FOR NOW
        _titleLabel = new UILabelViewController(self);
        _titleLabel.setText("Legenda");
        _titleLabel.getView().setFrame(0,_padding.top,_defaultViewBox.width, _title_height);
        self.add(_titleLabel);
        */
        _legendaEntriesGroup = self.getView().getSvg().append("g");
        _legendaEntriesGroup.attr("transform","translate(" + [0, _title_height + _title_margin_bottom] + ")");

       //Subscriptions
        self.getNotificationCenter().subscribe(self,self.onLegendaChanged,Notifications.legenda.LEGENDA_CHANGED);
        self.getNotificationCenter().subscribe(self,self.onSelectedEntriesChanged,Notifications.legenda.SELECTED_ENTRIES_CHANGED);

        self.onLegendaChanged();
    } ();
}

Utils.extend(UILegendaViewController, ViewController);
