/* Knowledge Vault shared catalogue and browsing system. */
(function () {
  "use strict";

  const DATA_URL = "/knowledge-vault/data/articles.json";
  const PAGE_SIZE = 12;

  // Permanent subject navigation. Articles can be added later without changing the
  // Knowledge Vault structure or making the landing page longer.
  const SUBJECTS = [
    { name: "Mathematics", icon: "📐", slug: "mathematics" },
    { name: "Physics", icon: "⚛️", slug: "physics" },
    { name: "Chemistry", icon: "🧪", slug: "chemistry" },
    { name: "Biology", icon: "🧬", slug: "biology" },
    { name: "Science and Technology", icon: "🔬", slug: "science-and-technology" },
    { name: "Technology", icon: "🌐", slug: "technology" },
    { name: "Social Sciences", icon: "🌍", slug: "social-sciences" },
    { name: "General English", icon: "📖", slug: "general-english" },
    { name: "Accounts and Statistics", icon: "📊", slug: "accounts-and-statistics" }
  ];

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function card(article) {
    return `
      <article class="kv-card">
        <div class="kv-card-icon">${esc(article.icon)}</div>
        <span class="kv-card-tag">${esc(article.category)}</span>
        <h3>${esc(article.title)}</h3>
        <p>${esc(article.description)}</p>
        <div class="kv-card-meta">${esc(article.subcategory)} · ${esc(article.level)}</div>
        <a href="${esc(article.url)}">Read the explanation →</a>
      </article>
    `;
  }

  function subjectCard(subject, count, icon) {
    return `
      <a class="kv-subject-card" href="/knowledge-vault/browse.html?subject=${encodeURIComponent(subject)}">
        <span class="kv-subject-icon">${esc(icon)}</span>
        <span><strong>${esc(subject)}</strong><small>${count} concept${count === 1 ? "" : "s"}</small></span>
        <span class="kv-subject-arrow">→</span>
      </a>
    `;
  }

  async function loadArticles() {
    const response = await fetch(DATA_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error("Knowledge Vault catalogue could not be loaded.");
    return response.json();
  }

  function setupBrowse(articles) {
    const grid = document.getElementById("kvBrowseGrid");
    const count = document.getElementById("kvResultCount");
    const empty = document.getElementById("kvBrowseEmpty");
    const search = document.getElementById("kvBrowseSearch");
    const subject = document.getElementById("kvSubjectFilter");
    const level = document.getElementById("kvLevelFilter");
    const sort = document.getElementById("kvSort");
    const pagination = document.getElementById("kvPagination");

    const params = new URLSearchParams(location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("subject")) subject.value = params.get("subject");

    [...new Set(articles.map(a => a.category))].sort().forEach(v => subject.insertAdjacentHTML("beforeend", `<option value="${esc(v)}">${esc(v)}</option>`));
    [...new Set(articles.map(a => a.level))].sort().forEach(v => level.insertAdjacentHTML("beforeend", `<option value="${esc(v)}">${esc(v)}</option>`));
    if (params.get("subject")) subject.value = params.get("subject");

    function render() {
      const q = search.value.trim().toLowerCase();
      const s = subject.value;
      const l = level.value;
      let list = articles.filter(a => {
        const haystack = [a.title, a.category, a.subcategory, a.level, a.description, a.keywords].join(" ").toLowerCase();
        return (!q || haystack.includes(q)) && (!s || a.category === s) && (!l || a.level === l);
      });

      if (sort.value === "title") list.sort((a, b) => a.title.localeCompare(b.title));
      else if (sort.value === "subject") list.sort((a, b) => (a.category + a.title).localeCompare(b.category + b.title));
      else list.sort((a, b) => a.title.localeCompare(b.title));

      const page = Math.max(1, Math.min(Number(new URLSearchParams(location.search).get("page")) || 1, Math.ceil(list.length / PAGE_SIZE) || 1));
      const totalPages = Math.ceil(list.length / PAGE_SIZE);
      const start = (page - 1) * PAGE_SIZE;
      const visible = list.slice(start, start + PAGE_SIZE);

      count.textContent = list.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, list.length)} of ${list.length} concepts` : "No matching concepts";
      grid.innerHTML = visible.map(card).join("");
      empty.hidden = visible.length !== 0;
      pagination.innerHTML = "";

      if (totalPages > 1) {
        const makeLink = (label, p, disabled) => {
          const a = document.createElement("a");
          a.textContent = label;
          a.href = buildUrl(p);
          a.className = disabled ? "is-disabled" : "";
          if (disabled) a.setAttribute("aria-disabled", "true");
          return a;
        };
        pagination.appendChild(makeLink("← Previous", page - 1, page === 1));
        for (let p = 1; p <= totalPages; p++) {
          if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
            const a = makeLink(String(p), p, false);
            if (p === page) a.classList.add("is-current");
            pagination.appendChild(a);
          } else if (!pagination.querySelector(".kv-ellipsis") || (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2)) {
            const span = document.createElement("span");
            span.className = "kv-ellipsis";
            span.textContent = "…";
            pagination.appendChild(span);
          }
        }
        pagination.appendChild(makeLink("Next →", page + 1, page === totalPages));
      }
    }

    function buildUrl(page) {
      const p = new URLSearchParams();
      if (search.value.trim()) p.set("q", search.value.trim());
      if (subject.value) p.set("subject", subject.value);
      if (level.value) p.set("level", level.value);
      if (sort.value !== "title") p.set("sort", sort.value);
      if (page > 1) p.set("page", page);
      return "/knowledge-vault/browse.html" + (p.toString() ? "?" + p.toString() : "");
    }

    [search, subject, level, sort].forEach(el => el.addEventListener("input", function () {
      history.replaceState(null, "", buildUrl(1));
      render();
    }));
    [search, subject, level, sort].forEach(el => el.addEventListener("change", function () {
      history.replaceState(null, "", buildUrl(1));
      render();
    }));
    render();
  }

  function setupSubject(articles) {
    const page = document.querySelector("[data-kv-subject]");
    if (!page) return;
    const wanted = page.dataset.kvSubject;
    const filtered = articles.filter(a => a.category === wanted);
    document.getElementById("kvSubjectCount").textContent = `${filtered.length} concepts in this subject`;
    document.getElementById("kvSubjectGrid").innerHTML = filtered.slice(-6).reverse().map(card).join("");
    const subjectGrid = document.getElementById("kvSubjectGrid");
    if (filtered.length > 6) {
      subjectGrid.insertAdjacentHTML("afterend", `<p class="kv-subject-more"><a href="/knowledge-vault/browse.html?subject=${encodeURIComponent(wanted)}">Browse all ${esc(wanted)} concepts →</a></p>`);
    }
  }

  function setupHome(articles) {
    const homeSearch = document.getElementById("kvHomeSearch");
    if (homeSearch) {
      homeSearch.addEventListener("submit", function () {
        const input = document.getElementById("knowledgeSearch");
        if (!input.value.trim()) {
          input.removeAttribute("name");
        }
      });
    }
    const grid = document.getElementById("kvFeaturedGrid");
    if (grid) {
      grid.innerHTML = articles.slice(-6).reverse().map(card).join("");
    }
    const subjects = document.getElementById("kvSubjects");
    if (subjects) {
      const counts = {};
      articles.forEach(a => counts[a.category] = (counts[a.category] || 0) + 1);
      subjects.innerHTML = SUBJECTS.map(s => subjectCard(s.name, counts[s.name] || 0, s.icon)).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      const articles = await loadArticles();
      setupHome(articles);
      if (document.getElementById("kvBrowseGrid")) setupBrowse(articles);
      setupSubject(articles);
    } catch (error) {
      console.error(error);
      document.querySelectorAll(".kv-loading").forEach(el => {
        el.textContent = "The Knowledge Vault catalogue is temporarily unavailable. Please try again.";
      });
    }
  });
})();