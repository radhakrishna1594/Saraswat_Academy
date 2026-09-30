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

async function loadComponent(id, file) {
    const response = await fetch(window.BASE_URL + "/" + file);

    if (!response.ok) {
        console.error(file + " not found");
        return;
    }

    const html = await response.text();
    const target = document.getElementById(id);
    if (!target) return;

    target.innerHTML = html;

    document.querySelectorAll("[data-link]").forEach(link => {
        link.href = window.BASE_URL + link.dataset.link;
    });

    normalizeBreadcrumbs();
}

document.addEventListener("DOMContentLoaded", () => {
    removeStrayMetaText();
    normalizeBreadcrumbs();

    if (document.getElementById("header"))
        loadComponent("header", "header.html");

    if (document.getElementById("footer"))
        loadComponent("footer", "footer.html");
});