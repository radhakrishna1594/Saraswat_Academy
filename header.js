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


/* =========================================================
   MATHEMATICS KATEX LOADER
   KaTeX is loaded only on Mathematics solution pages.
   Existing TeX delimiters are rendered; ordinary text is never
   automatically converted into math.
   ========================================================= */
(function () {
    function isMathsPage() {
        if (!document.body || !document.body.classList.contains("solution-page")) return false;

        var path = window.location.pathname || "";

        /* Class 9/10 Mathematics solution folders and maths URLs. */
        return /(?:^|\/)maths(?:_|\/|-)/i.test(path) ||
               /(?:^|\/)mathematics(?:_|\/|-)/i.test(path);
    }

    function render() {
        if (!window.renderMathInElement) return;

        var article = document.querySelector(".solution-article");
        if (!article || article.dataset.katexRendered === "true") return;

        article.dataset.katexRendered = "true";

        renderMathInElement(article, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ],
            ignoredClasses: ["katex", "katex-display"],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
            throwOnError: false,
            output: "htmlAndMathml"
        });
    }

    function loadKaTeX() {
        if (!isMathsPage()) return;

        /* Existing page-level KaTeX files are allowed to provide the library.
           Do not create a second copy when one already exists. */
        if (window.katex && window.renderMathInElement) {
            render();
            return;
        }

        if (!document.getElementById("saraswat-katex-css")) {
            var css = document.createElement("link");
            css.id = "saraswat-katex-css";
            css.rel = "stylesheet";
            css.href = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.css";
            css.crossOrigin = "anonymous";
            document.head.appendChild(css);
        }

        function ensureRenderer() {
            if (window.renderMathInElement) {
                render();
                return;
            }

            if (document.getElementById("saraswat-katex-render")) return;

            var renderScript = document.createElement("script");
            renderScript.id = "saraswat-katex-render";
            renderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/contrib/auto-render.min.js";
            renderScript.defer = true;
            renderScript.onload = render;
            document.head.appendChild(renderScript);
        }

        if (window.katex) {
            ensureRenderer();
            return;
        }

        if (!document.getElementById("saraswat-katex-js")) {
            var js = document.createElement("script");
            js.id = "saraswat-katex-js";
            js.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.js";
            js.defer = true;
            js.crossOrigin = "anonymous";
            js.onload = ensureRenderer;
            document.head.appendChild(js);
        } else {
            ensureRenderer();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadKaTeX, { once: true });
    } else {
        loadKaTeX();
    }
})();
