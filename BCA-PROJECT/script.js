let cart = JSON.parse(localStorage.getItem("cart")) || [];

const overlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const cartCount = document.querySelector(".cart-count");

class Products {
  async getProducts() {
    const result = await fetch("data.json");
    const data = await result.json();
    return data.items;
  }
}

class UI {

  displayProducts(products) {
    let result = "";

    products.forEach(product => {
      result += `
        <div class="card">
          <img src="${product.image}" alt="${product.title}">
          <h4>${product.title}</h4>
          <h5>$ ${product.price}</h5>
          <button class="add-btn" data-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    });

    document.querySelector(".products-center").innerHTML = result;
  }

  getAddToCartButtons(products) {
    const buttons = [...document.querySelectorAll(".add-btn")];

    buttons.forEach(button => {

      const id = parseInt(button.dataset.id);

      button.addEventListener("click", () => {

        const product = products.find(p => p.id === id);

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        this.addCartItem(product);
        this.setCartValues();
      });

    });
    
  }
  setupSearch(products) {

  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keyup", (e) => {

    const searchValue = e.target.value.toLowerCase();

    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchValue)
    );

    this.displayProducts(filteredProducts);
    this.getAddToCartButtons(filteredProducts);

  });
}

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div class="cart-info">
          <h4>${item.title}</h4>
          <h5> $ ${item.price} </h5>
      </div>
      <span class="remove" data-id="${item.id}">🗑</span>
    `;

    cartContent.appendChild(div);
  }

  setCartValues() {
    let total = 0;
    cart.forEach(item => total += item.price);
    cartTotal.innerText = total;
      cartCount.innerText = cart.length;
  }

  setupApp() {
    cart.forEach(item => this.addCartItem(item));
    this.setCartValues();
  }
}

function showCart() {
  overlay.classList.add("show");
  cartDOM.classList.add("show");
}

function hideCart() {
  overlay.classList.remove("show");
  cartDOM.classList.remove("show");
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  cartContent.innerHTML = "";
  cartTotal.innerText = 0;
  cartCount.innerText = 0; 
}
function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}
cartBtn.addEventListener("click", showCart);
closeCartBtn.addEventListener("click", hideCart);
clearCartBtn.addEventListener("click", clearCart);

cartContent.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove")) {

    const id = parseInt(event.target.dataset.id);

    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));

    event.target.parentElement.remove();

    ui.setCartValues();
  }
});

const products = new Products();
const ui = new UI();

document.addEventListener("DOMContentLoaded", async () => {

  const productList = await products.getProducts();
  ui.setupSearch(productList); 
  ui.displayProducts(productList);
  ui.getAddToCartButtons(productList);
  

  // ui.displayProducts(productList);
  // ui.getAddToCartButtons(productList);

   ui.setupApp();

});