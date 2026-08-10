document.addEventListener("click", function(e){

    if(e.target.closest("#hamburger")){

        const hamburger=document.getElementById("hamburger");
        const mobileNav=document.getElementById("mobileNav");

        hamburger.classList.toggle("open");
        mobileNav.classList.toggle("open");

        document.body.style.overflow=
            mobileNav.classList.contains("open")
            ?"hidden":"";
    }

});

document.addEventListener("click",function(e){

    if(e.target.closest("#mobileNav .nav-link")){

        document.getElementById("hamburger").classList.remove("open");
        document.getElementById("mobileNav").classList.remove("open");
        document.body.style.overflow="";

    }


});


    let websiteZoom = 1;

    function changeZoom(amount) {

        websiteZoom += amount;

        if (websiteZoom < 0.8) {
            websiteZoom = 0.8;
        }

        if (websiteZoom > 1.3) {
            websiteZoom = 1.3;
        }

        document.body.style.zoom = websiteZoom;
    }

    function resetZoom() {
        websiteZoom = 1;
        document.body.style.zoom = "1";
    }
