function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");

  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

document.addEventListener("click", function (event) {

  const account = document.querySelector(".account");
  const dropdown = document.getElementById("dropdownMenu");

  if (!account || !dropdown) return;

  if (account.contains(event.target)) {
    dropdown.classList.toggle("show");
  } else {
    dropdown.classList.remove("show");
  }

});