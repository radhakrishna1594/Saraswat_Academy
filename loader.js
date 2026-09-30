function removeStrayMetaText() {
    // Some older pages contain a malformed meta-description line such as:
    // name="description" content="..."
    // Without the opening <meta ...>, browsers render that text visibly.
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

    // Fix all links
    document.querySelectorAll("[data-link]").forEach(link => {
        link.href = window.BASE_URL + link.dataset.link;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Clean legacy malformed SEO text before/while shared components are rendered.
    removeStrayMetaText();

    if (document.getElementById("header"))
        loadComponent("header", "header.html");

    if (document.getElementById("footer"))
        loadComponent("footer", "footer.html");
});