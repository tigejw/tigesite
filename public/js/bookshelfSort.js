function bookshelfSort() {
  console.log("in bookshelfsort");
  const list = document.getElementById("bookshelf-list");
  if (!list) return;

  const books = Array.from(list.getElementsByClassName("bookshelf-book"));

  const toDate = (dmy) => {
    if (!dmy) return new Date(0);
    const [d, m, y] = dmy.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  function sortBooks(by, dir) {
    books.sort((a, b) => {
      let va, vb;
      if (by === "rating") {
        console.log(a, "a");
        va = Number(a.dataset.rating || 0);
        vb = Number(b.dataset.rating || 0);
      } else {
        va = toDate(a.dataset.date);
        vb = toDate(b.dataset.date);
      }
      return dir === "asc" ? va - vb : vb - va;
    });
    books.forEach((book) => list.appendChild(book));
  }

  document
    .getElementById("sort-rating-asc")
    ?.addEventListener("click", () => sortBooks("rating", "asc"));
  document
    .getElementById("sort-rating-desc")
    ?.addEventListener("click", () => sortBooks("rating", "desc"));
  document
    .getElementById("sort-date-asc")
    ?.addEventListener("click", () => sortBooks("date", "asc"));
  document
    .getElementById("sort-date-desc")
    ?.addEventListener("click", () => sortBooks("date", "desc"));
}

document.addEventListener("DOMContentLoaded", bookshelfSort);
