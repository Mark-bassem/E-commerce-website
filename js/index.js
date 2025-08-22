document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.querySelector(".products-number");
  const cartTotal = document.querySelector(".cart");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartUI() {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    cartCount.textContent = cartItems.length;
    cartTotal.childNodes[1].textContent = `$${totalPrice.toFixed(2)}`;
  }

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const title = card.querySelector(".title").textContent;
      const price = parseFloat(
        card.querySelector(".price").textContent.replace("$", "")
      );
      const image = card.querySelector("img").src;

      cartItems.push({ title, price, image, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartUI();
    });
  });

  updateCartUI();
});