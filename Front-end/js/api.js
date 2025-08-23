const API = (() => {
  const BASE_URL = "http://localhost:5000/api";

  // 🟢 Auth APIs
  async function register(username, email, password) {
    return request("/auth/register", "POST", { username, email, password });
  }

  async function login(email, password) {
    return request("/auth/login", "POST", { email, password });
  }

  // 🟢 Products APIs
  async function getProducts() {
    return request("/products");
  }

  // 🟢 Cart APIs
  async function getCart() {
    return request("/cart", "GET", null, true);
  }

  async function addToCart(productId, quantity = 1) {
    return request("/cart", "POST", { productId, quantity }, true);
  }

  async function removeFromCart(productId) {
    return request(`/cart/${productId}`, "DELETE", null, true);
  }

  async function checkout() {
    return request("/orders", "POST", {}, true);
  }

  // 🟢 Orders APIs
  async function getOrders() {
    return request("/orders", "GET", null, true);
  }

  // 🛠️ Request handler
  async function request(endpoint, method = "GET", body = null, auth = false) {
    const headers = { "Content-Type": "application/json" };
    if (auth && localStorage.getItem("token")) {
      headers["Authorization"] = "Bearer " + localStorage.getItem("token");
    }

    const res = await fetch(BASE_URL + endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Request failed");
    }

    return res.json();
  }

  return {
    register,
    login,
    getProducts,
    getCart,
    addToCart,
    removeFromCart,
    checkout,
    getOrders,
  };
})();