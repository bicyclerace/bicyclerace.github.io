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
    $("main").empty();
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

function addBootstrap() {
    $("main").children().not($("script")).wrap('<div class="row" />');
            
    $("section").each(function() {
        var section = $(this);
        var images = section.find(".images");
        var other = section.children().not(images);
        other.wrapAll('<div class="col-lg-6" />');
        images.addClass("col-lg-6");
        var videoWrap = $('<div>')
            .addClass('embed-responsive embed-responsive-16by9 img-thumbnail');
        section.find("video").addClass("embed-responsive-item")
            .wrap(videoWrap);
        images.wrapAll('<div class="col-lg-6 />');
    });
    $("video").each(function() { this.load(); });
    $("img").addClass("img-responsive img-thumbnail");
}