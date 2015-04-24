/**
 * Created by Macs on 16/10/14.
 */
var weather = {};
var debugJSON = [];

jQuery(document).ready(function($) {
    var beginDate = new Date(2013,5,1); // Month is 0 based
    var endDate = new Date(2014, 0, 1);

    for (var d = beginDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        //daysOfYear.push(new Date(d));
        var year = d.getFullYear();
        var month = ("0" + (d.getMonth() +1)).slice(-2);
        var day = ("0" + (d.getDate())).slice(-2);

        var request =
            "http://api.wunderground.com/api/e4c22e5150092e01/history_" +
            year + "" + month + "" + day + "/q/IL/Chicago.json";

        $.ajax({
            url : request,
            dataType : "jsonp",
            success : function(parsed_json) {
                debugJSON.push(parsed_json);

                var dailySummary = parsed_json["history"]["dailysummary"][0];

                var dateKey = dailySummary["date"]["year"] + "" + dailySummary["date"]["mon"] + "" + dailySummary["date"]["mday"];
                weather[dateKey] = {};

                // Summary
                weather[dateKey]["summary"] = {};
                weather[dateKey]["summary"]["maxFahrenheit"] = dailySummary["maxtempi"];
                weather[dateKey]["summary"]["maxCelsius"] = dailySummary["maxtempm"];
                weather[dateKey]["summary"]["minFahrenheit"] = dailySummary["mintempi"];
                weather[dateKey]["summary"]["minCelsius"] = dailySummary["mintempm"];
                weather[dateKey]["summary"]["fog"] = dailySummary["fog"];
                weather[dateKey]["summary"]["hail"] = dailySummary["hail"];
                weather[dateKey]["summary"]["rain"] = dailySummary["rain"];
                weather[dateKey]["summary"]["snow"] = dailySummary["snow"];
                weather[dateKey]["summary"]["thunder"] = dailySummary["thunder"];
                weather[dateKey]["summary"]["tornado"] = dailySummary["tornado"];

                // Observations
                weather[dateKey]["observations"] = [];
                parsed_json["history"]["observations"].forEach(function(observation) {
                    weather[dateKey]["observations"].push({
                        conditions: observation["conds"],
                        hour: observation["date"]["hour"],
                        minutes: observation["date"]["min"],
                        fahrenheit: observation["tempi"],
                        celsius: observation["tempm"],
                        icon: observation["icon"],
                        fog: observation["fog"],
                        hail: observation["hail"],
                        rain: observation["rain"],
                        snow: observation["snow"],
                        thunder: observation["thunder"],
                        tornado: observation["tornado"]
                    });
                });
            }
        });
    }
});