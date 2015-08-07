/**
 * Created by Macs on 29/09/14.
 */
$(document).ready(function() {
    $(".bottom-toolbar > button").click(function() {
        $(".bottom-toolbar > button.selected").removeClass("selected");
        $(this).addClass("selected");
        var id = $(this).attr("id");

        $('.tool-window.selected').hide().removeClass("selected");


        if(id == "time") {
            $("#time-window")
                .addClass("selected")
                .slideDown();
        } else if(id == "calendar") {
            $("#calendar-window")
                .addClass("selected")
                .slideDown();
        } else if (id == "map-settings") {
            $("#map-window")
                .addClass("selected")
                .slideDown();
        }
    });

    //$(".tool-window").hide();
});