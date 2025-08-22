function updateCartHeader() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".products-number");
  const cartTotal = document.querySelector(".cart");

  if (cartCount && cartTotal) {
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cartTotal.childNodes[1].textContent = `$${totalPrice.toFixed(2)}`;

    if (cartItems.length > 0) {
      cartCount.style.display = "inline-block";
      cartCount.textContent = cartItems.length;
    } else {
      cartCount.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateCartHeader);