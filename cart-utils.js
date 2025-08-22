function updateCartHeader() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".products-number");
  const cartTotal = document.querySelector(".cart");

  if (cartCount && cartTotal) {
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cartCount.textContent = cartItems.length;
    cartTotal.childNodes[1].textContent = `$${totalPrice.toFixed(2)}`;
  }
}

document.addEventListener("DOMContentLoaded", updateCartHeader);