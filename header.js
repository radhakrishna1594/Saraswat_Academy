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
   UNIVERSAL MATHEMATICS RENDERER
   Class 9 & Class 10 maths solution pages
   ========================================================= */
(function () {
    function isMathLine(text) {
        var value = (text || "").replace(/\s+/g, " ").trim();
        if (!value || value.length > 180) return false;

        /* Never convert headings or Hindi/other Indic question text into math.
           This prevents lines such as "5. निबंध में समाज-सुधार..." from
           becoming visible \\( ... \\) on solution pages. */
        if (/^[0-9]+[.)]?\s*/.test(value) && /[\u0900-\u097F]/.test(value)) return false;
        if (/[\u0900-\u097F]/.test(value)) return false;

        /* Never touch prose. */
        if (/[.!?]{1}/.test(value) && /[A-Za-z]{2,}/.test(value)) return false;

        var words = value.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
        var allowedWords = /^(sin|cos|tan|cot|sec|cosec|log|ln|sqrt|m|cm|mm|km|kg|g|l|ml|s|min|hr)$/i;

        for (var i = 0; i < words.length; i++) {
            var word = words[i];

            /* Common mathematical function/unit names. */
            if (allowedWords.test(word)) continue;

            /* Single variables and geometry labels such as AB, AC, PQ, ABC. */
            if (/^[A-Z]{1,4}$/.test(word)) continue;
            if (/^[a-zA-Z]$/.test(word)) continue;

            /* Anything else is ordinary prose. */
            return false;
        }

        if (!/\d/.test(value)) return false;
        if (!/[=+\-−×÷/^√<>≤≥%]|\b(sin|cos|tan|cot|sec|cosec)\b/i.test(value)) return false;

        return true;
    }

    function toTex(text) {
        var tex = text.trim()
            .replace(/√\s*\(([^()]*)\)/g, "\\sqrt{$1}")
            .replace(/√\s*([A-Za-z0-9]+)/g, "\\sqrt{$1}")
            .replace(/×/g, "\\times ")
            .replace(/÷/g, "\\div ")
            .replace(/−/g, "-")
            .replace(/≤/g, "\\le ")
            .replace(/≥/g, "\\ge ")
            .replace(/π/g, "\\pi ")
            .replace(/(\d+(?:\.\d+)?)\s*°/g, "$1^\\circ")
            .replace(/(\d+)\s*\/\s*(\d+)/g, "\\frac{$1}{$2}");

        /* TeX ignores ordinary HTML whitespace in math. Use explicit spaces
           only between tokens so equations remain readable. */
        tex = tex.replace(/\s+/g, "\\ ");
        return tex;
    }

    function render() {
        if (!window.renderMathInElement) return;

        var article = document.querySelector(".solution-article");
        if (!article) return;

        article.querySelectorAll("p, li, td").forEach(function (el) {
            if (el.closest(".katex, .katex-display, script, style, nav, a, button, pre, code")) return;
            if (el.querySelector(".katex")) return;

            var text = (el.textContent || "").replace(/\s+/g, " ").trim();
            if (!isMathLine(text)) return;

            el.textContent = "\\(" + toTex(text) + "\\)";
        });

        renderMathInElement(article, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ],
            ignoredClasses: ["katex", "katex-display"],
            throwOnError: false,
            output: "htmlAndMathml"
        });
    }

    function loadKaTeX() {
        if (!document.body || !document.body.classList.contains("solution-page")) return;

        /* KaTeX is strictly for Mathematics solution pages.
           Other subjects (Hindi, English, Science, SST, Sanskrit, etc.)
           must never load or process through the math renderer. */
        var path = window.location.pathname || "";
        var isMathsPage = /(?:^|\/)maths(?:_|\/|-)/i.test(path) ||
                          /(?:^|\/)mathematics(?:_|\/|-)/i.test(path);
        if (!isMathsPage) return;

        if (window.renderMathInElement) {
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

        if (!document.getElementById("saraswat-katex-js")) {
            var js = document.createElement("script");
            js.id = "saraswat-katex-js";
            js.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.js";
            js.defer = true;
            js.crossOrigin = "anonymous";
            document.head.appendChild(js);
        }

        if (!document.getElementById("saraswat-katex-render")) {
            var renderScript = document.createElement("script");
            renderScript.id = "saraswat-katex-render";
            renderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/contrib/auto-render.min.js";
            renderScript.defer = true;
            renderScript.onload = render;
            document.head.appendChild(renderScript);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadKaTeX, { once: true });
    } else {
        loadKaTeX();
    }
})();
