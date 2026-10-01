function normalizeUrl(url) {
    try {
        const u = new URL(url, window.location.origin);
        let path = u.pathname.replace(/\/+$/, "");
        path = path.replace(/\/index\.html$/i, "");
        if (path === "") path = "/";
        return path.toLowerCase();
    } catch {
        return "";
    }
}

function normalizeBreadcrumbs() {
    const currentPath = normalizeUrl(window.location.href);

    document.querySelectorAll('.breadcrumb, nav[aria-label="Breadcrumb"]').forEach(breadcrumb => {
        breadcrumb.classList.add("sa-breadcrumb");
        breadcrumb.setAttribute("aria-label", "Breadcrumb");

        const list = breadcrumb.querySelector("ol");
        if (list) list.classList.add("sa-breadcrumb-list");

        const walker = document.createTreeWalker(
            breadcrumb,
            NodeFilter.SHOW_TEXT
        );

        const arrowNodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if ((node.nodeValue || "").includes("→")) {
                arrowNodes.push(node);
            }
        }

        arrowNodes.forEach(node => {
            const parts = (node.nodeValue || "").split("→");
            const fragment = document.createDocumentFragment();

            parts.forEach((part, index) => {
                if (part.trim()) fragment.appendChild(document.createTextNode(part));

                if (index < parts.length - 1) {
                    const separator = document.createElement("span");
                    separator.className = "separator";
                    separator.setAttribute("aria-hidden", "true");
                    separator.textContent = "›";
                    fragment.appendChild(separator);
                }
            });

            node.parentNode.replaceChild(fragment, node);
        });

        breadcrumb.querySelectorAll("a[href]").forEach(link => {
            const linkPath = normalizeUrl(link.href);

            if (linkPath && linkPath === currentPath) {
                const current = document.createElement("span");
                current.className = "current";
                current.textContent = link.textContent.trim();
                current.setAttribute("aria-current", "page");
                link.replaceWith(current);
            }
        });

        const currentItem = breadcrumb.querySelector(".current");
        if (currentItem) return;

        const plainSpans = breadcrumb.querySelectorAll("span:not(.separator)");
        if (plainSpans.length) {
            const last = plainSpans[plainSpans.length - 1];
            last.classList.add("current");
            last.setAttribute("aria-current", "page");
        }
    });
}

function removeStrayMetaText() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    const strayNodes = [];
    const pattern = /^\s*name=["']description["']\s+content=["'][\s\S]*?["']\s*$/i;

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (pattern.test(node.nodeValue || "")) {
            strayNodes.push(node);
        }
    }

    strayNodes.forEach(node => node.remove());
}

function getSiteBase() {
    if (location.hostname.endsWith("github.io")) return "/Saraswat_Academy";
    return "";
}

function ensureSharedStyles() {
    if (!document.querySelector('link[data-saraswat-header-css]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = getSiteBase() + "/header.css";
        link.dataset.saraswatHeaderCss = "true";
        document.head.appendChild(link);
    }
}

function ensureComponentTarget(id) {
    if (!document.body) return null;
    const nodes = Array.from(document.querySelectorAll("#" + id));
    const insideBody = nodes.find(node => document.body.contains(node));
    nodes.forEach(node => { if (node !== insideBody) node.remove(); });
    if (insideBody) return insideBody;

    // Legacy pages sometimes contain a complete inline <header>/<footer>
    // instead of the shared component placeholder. Replace that old wrapper
    // with the shared component target so the original site design stays
    // consistent without producing duplicate headers or footers.
    const legacy = document.body.querySelector(id === "header" ? "header" : "footer");
    if (legacy) {
        const target = document.createElement("div");
        target.id = id;
        legacy.replaceWith(target);
        return target;
    }

    const target = document.createElement("div");
    target.id = id;
    if (id === "header") document.body.prepend(target);
    else document.body.appendChild(target);
    return target;
}

async function loadComponent(id, file) {
    const base = window.BASE_URL || getSiteBase();
    const response = await fetch(base + "/" + file);

    if (!response.ok) {
        console.error(file + " not found");
        return;
    }

    const html = await response.text();
    const target = ensureComponentTarget(id);
    if (!target) return;

    target.innerHTML = html;

    document.querySelectorAll("[data-link]").forEach(link => {
        link.href = window.BASE_URL + link.dataset.link;
    });

    normalizeBreadcrumbs();
}

document.addEventListener("DOMContentLoaded", () => {
    removeStrayMetaText();
    ensureSharedStyles();
    normalizeBreadcrumbs();

    // Keep the existing Saraswat Academy header/footer design everywhere.
    // This also repairs legacy pages that have duplicate/missing containers.
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
});