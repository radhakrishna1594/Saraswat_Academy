async function loadComponent(id, file) {
    const response = await fetch(window.BASE_URL + "/" + file);

    if (!response.ok) {
        console.error(file + " not found");
        return;
    }

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    // Fix all links
    document.querySelectorAll("[data-link]").forEach(link => {
        link.href = window.BASE_URL + link.dataset.link;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("header"))
        loadComponent("header", "header.html");

    if (document.getElementById("footer"))
        loadComponent("footer", "footer.html");
});