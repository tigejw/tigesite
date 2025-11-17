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

  document.getElementById("sort-rating")?.addEventListener("click", () => {
    const btn = document.getElementById("sort-rating");
    const by = btn.dataset.dir;
    if (by === "asc") {
      sortBooks("rating", "asc");
      btn.dataset.dir = "desc";
      btn.textContent = "rating ↓";
    } else {
      sortBooks("rating", "desc");
      btn.dataset.dir = "asc";
      btn.textContent = "rating ↑";
    }
  });
  document.getElementById("sort-date")?.addEventListener("click", () => {
    const btn = document.getElementById("sort-date");
    const by = btn.dataset.dir;
    if (by === "asc") {
      sortBooks("date", "asc");
      btn.dataset.dir = "desc";
      btn.textContent = "date read ↓";
    } else {
      sortBooks("date", "desc");
      btn.dataset.dir = "asc";
      btn.textContent = "date read ↑";
    }
  });
}

document.addEventListener("DOMContentLoaded", bookshelfSort);
