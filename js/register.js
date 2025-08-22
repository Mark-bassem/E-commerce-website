document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("exampleInputEmail1").value.trim();
    const password = document
      .getElementById("exampleInputPassword1")
      .value.trim();

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    alert("Account created successfully!");
    window.location.href = "/pages/signin.html";
  });
});