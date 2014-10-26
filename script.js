$(window).load(function() {
    $("main").addClass("container");
    $("nav ul").addClass("nav navbar-nav");
    $("nav").addClass("container")
        .wrap('<div class="navbar navbar-inverse navbar-fixed-top" role="navigation"></div>');
    loadHash("usage");
})

$(window).on("hashchange", function() {
    var hash = window.location.hash.substr(1);
    loadHash(hash);
})

function loadHash(hash) {
    selectNav(hash);
    $("main").load("page/" + hash + ".html");
}

function selectNav(hash) {
    var navs = $("nav li a");
    navs.parent().removeClass("active");
    navs
        .filter(function() { 
            return $(this).attr("href").substr(1) == hash 
        })
        .parent().addClass("active");
}