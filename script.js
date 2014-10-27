$(window).load(function() {
    $("main").addClass("container");
    $("nav ul").addClass("nav navbar-nav");
    $("nav").addClass("container")
        .wrap('<div class="navbar navbar-inverse navbar-fixed-top" role="navigation"></div>');
    loadHash("home");
})

$(window).on("hashchange", function() {
    var hash = window.location.hash.substr(1);
    loadHash(hash);
})

function loadHash(hash) {
    selectNav(hash);
    $("main").load("page/" + hash + ".html");
    history.pushState(null, null, '#' + hash);
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