document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("exampleInputEmail1").value.trim();
    const password = document
      .getElementById("exampleInputPassword1")
      .value.trim();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      alert(`Welcome back, ${user.username}!`);
      window.location.href = "/";
    } else {
      alert(`Invalid email or password`);
    }
  });
});