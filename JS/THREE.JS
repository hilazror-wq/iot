// gallery.js - סינון פשוט של תמונות בגלריה

const buttons = document.querySelectorAll(".filter-btn"); // כל כפתורי הסינון
const items = document.querySelectorAll(".item");         // כל הפריטים בגלריה

function filter(category){ // פונקציה שמחליטה מה להציג
  items.forEach((item) => { // עוברים על כל פריט
    const c = item.getAttribute("data-cat"); // קוראים קטגוריה של הפריט
    const show = (category === "all" || c === category); // תנאי תצוגה
    item.style.display = show ? "block" : "none"; // מציג או מסתיר
  });
}

buttons.forEach((btn) => { // לכל כפתור
  btn.addEventListener("click", () => { // בלחיצה
    buttons.forEach(b => b.classList.remove("active")); // מורידים active מכולם
    btn.classList.add("active"); // מוסיפים active לכפתור שנלחץ
    filter(btn.getAttribute("data-filter")); // מפעילים סינון לפי data-filter
  });
});

filter("all"); // בהתחלה מציגים הכל

