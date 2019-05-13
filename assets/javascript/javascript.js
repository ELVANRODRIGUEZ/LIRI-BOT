$(document).ready(function () {

    // ==================================== VIDEO CONTROL

    var $videoControl = $("#shownVideo").get(0);
    var $playIcon = $("#playPauseIcon");
    var playIconToggler = true;

    if ($videoControl) {
        $videoControl.loop = true;
    }
    
    $playIcon.on("click", function () {
        if (playIconToggler) {
            playVideo();

        }
    })

    $("#shownVideo").on("click", function () {
        if (playIconToggler) {
            playVideo();
        } else {
            pauseVideo();
        }
    })

    function playVideo() {
        $playIcon.css("visibility", "hidden");
        $videoControl.play();
        playIconToggler = false;
    }

    function pauseVideo() {
        $playIcon.css("visibility", "visible");
        $videoControl.pause();
        playIconToggler = true;
    }

});