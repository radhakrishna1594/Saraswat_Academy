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