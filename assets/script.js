const searchInput = document.querySelector("#solutionSearch");
const rows = Array.from(document.querySelectorAll(".solution-row"));

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    rows.forEach((row) => {
      const haystack = row.dataset.title || row.textContent.toLowerCase();
      row.hidden = query.length > 0 && !haystack.includes(query);
    });
  });
}
