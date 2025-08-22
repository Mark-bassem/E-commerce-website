document.addEventListener("DOMContentLoaded", () => {
  const cartSection = document.querySelector("section.cart");
  const subtotalElement = document.querySelector(".summary div p:last-child");
  const clearBtn = document.querySelector(".clear");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartSection.innerHTML = "";

    if (cartItems.length === 0) {
      cartSection.innerHTML = "<p>Your cart is empty.</p>";
      subtotalElement.textContent = "$0.00";
      return;
    }

    cartItems.forEach((item, index) => {
      const article = document.createElement("article");
      article.classList.add("product", "flex");

      article.innerHTML = `
        <button class="delete" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>

        <p class="price">$${item.price}</p>

        <div>
          <button class="decrease" data-index="${index}">-</button>
          <div class="quantity flex">${item.quantity}</div>
          <button class="increase" data-index="${index}">+</button>
        </div>

        <p class="title">${item.title}</p>

        <img src="${item.image}" alt="${item.title}" width="70" height="70"/>
      `;

      cartSection.appendChild(article);
    });

    updateSummary();
  }

  function updateSummary() {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  cartSection.addEventListener("click", e => {
    const index = e.target.closest("button")?.dataset.index;
    if (e.target.closest(".delete")) {
      cartItems.splice(index, 1);
    } else if (e.target.closest(".increase")) {
      cartItems[index].quantity++;
    } else if (e.target.closest(".decrease")) {
      if (cartItems[index].quantity > 1) cartItems[index].quantity--;
    }
    renderCart();
  });

  clearBtn.addEventListener("click", () => {
    cartItems = [];
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCart();
    updateCartHeader();
  });

  renderCart();
});