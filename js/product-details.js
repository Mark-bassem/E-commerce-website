document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-to-cart");

  addBtn.addEventListener("click", () => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const title = document.querySelector("h2").textContent;
    const price = document.querySelector(".price").textContent;
    const image = document.querySelector("main img").scr;

    cartItems.push({ title, price, image, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert("Product added to cart!");
  });
});