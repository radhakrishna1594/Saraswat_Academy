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
   Safe conversion: never turns normal prose into math.
   ========================================================= */
(function () {
    function loadKaTeX() {
        if (!document.body || !document.body.classList.contains("solution-page")) return;

        function render() {
            if (!window.renderMathInElement) return;

            var article = document.querySelector(".solution-article");
            if (!article) return;

            /*
             * Convert only short, equation-like lines.
             * The previous renderer converted complete English sentences
             * containing numbers into math mode, which removed normal
             * word spacing and caused text to run together on mobile.
             */
            article.querySelectorAll("p, li, td, h3, h4").forEach(function (el) {
                if (el.closest(".katex, script, style, nav, a, button")) return;
                if (el.querySelector(".katex")) return;

                var text = (el.textContent || "").replace(/\s+/g, " ").trim();
                if (!text || text.length > 180) return;

                var wordTokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
                var hasLongEnglishWord = wordTokens.some(function (word) {
                    return word.length > 1;
                });

                /* Never convert ordinary English words into math. */
                if (hasLongEnglishWord) return;
                if (/^(solution|answer|therefore|hence|since|let|using|given|we know|now|here|for|from|thus|so|the|this|note|where|because)\b/i.test(text)) return;

                var hasNumber = /\d/.test(text);
                var hasMathOperator = /[=+\u2212\u00d7\u00f7/^√<>≤≥%]/.test(text);
                if (!hasNumber || !hasMathOperator) return;

                var tex = text
                    .replace(/√\s*([A-Za-z0-9]+)/g, "\\sqrt{$1}")
                    .replace(/×/g, "\\times ")
                    .replace(/÷/g, "\\div ")
                    .replace(/−/g, "-")
                    .replace(/\bπ\b/g, "\\pi")
                    .replace(/(\d)\s*°/g, "$1^\\circ")
                    .replace(/(\d+)\s*\/\s*(\d+)/g, "\\frac{$1}{$2}");

                /* Preserve spaces if an eligible expression contains them. */
                tex = tex.replace(/\s+/g, "\\ ");
                el.textContent = "\\(" + tex + "\\)";
            });

            renderMathInElement(article, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ],
                ignoredClasses: ["katex", "katex-display"],
                throwOnError: false
            });
        }

        if (window.renderMathInElement) {
            render();
            return;
        }

        if (!document.getElementById("saraswat-katex-css")) {
            var css = document.createElement("link");
            css.id = "saraswat-katex-css";
            css.rel = "stylesheet";
            css.href = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.css";
            document.head.appendChild(css);
        }

        if (!document.getElementById("saraswat-katex-js")) {
            var js = document.createElement("script");
            js.id = "saraswat-katex-js";
            js.defer = true;
            js.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.js";
            document.head.appendChild(js);
        }

        if (!document.getElementById("saraswat-katex-render")) {
            var renderScript = document.createElement("script");
            renderScript.id = "saraswat-katex-render";
            renderScript.defer = true;
            renderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/contrib/auto-render.min.js";
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
