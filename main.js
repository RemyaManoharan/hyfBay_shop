console.log("Script loaded");

const products = getAvailableProducts();
// form elements
const productsUl = document.querySelector("section.products ul");
console.log(productsUl);

//functions
const resetProductUl = () => {
  productsUl.innerHTML = "";
};

function renderProducts(products) {
  resetProductUl();
  const headingTag = document.createElement("li");
  headingTag.innerHTML = `  <ul class="heading">
    <li>Product</li>
    <li>Price</li>
    <li>Rating</li>
    <li>Love this?</li>
  </ul>`;
  productsUl.appendChild(headingTag);
  products.forEach((product) => {
    const liTag = document.createElement("li");
    liTag.innerHTML = `
            <ul>
                <li>${product.name}</li>
                <li>${product.price}</li>
                <li>${product.rating}</li>
                <li><button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button></li>

            </ul>
        `;
    productsUl.appendChild(liTag);
  });
}
window.onload = function (event) {
  products.sort((a, b) => b.rating - a.rating);
  renderProducts(products);
};

const productSearchTag = document.getElementById("productSearch");
const maxPriceTag = document.getElementById("priceSearch");
const sortOption = document.getElementById("sortSelect");

// to store the timeout id for debounce as my search option
// was not working before adding debounce
let timeoutId;

productSearchTag.addEventListener("input", () => {
  clearTimeout(timeoutId); // clear previous timeout if any
  timeoutId = setTimeout(() => {
    renderFilterProducts();
  }, 300); // debounce time in milliseconds
});

maxPriceTag.addEventListener("input", () => {
  renderFilterProducts();
});

sortOption.addEventListener("change", () => {
  renderFilterProducts();
});

function renderFilterProducts() {
  const productSearchValue = productSearchTag.value.trim();
  const maxPriceValue = parseFloat(maxPriceTag.value);
  const sortOptionValue = sortOption.value;

  const sortingExpensive = (a, b) => a.price - b.price;
  const sortingCheapest = (a, b) => b.price - a.price;

  const filteredProducts = products
    .filter((product) => {
      return (
        productSearchValue === "" ||
        product.name.toLowerCase().includes(productSearchValue)
      );
    })
    .filter((product) => {
      return (
        maxPriceValue === "" ||
        isNaN(maxPriceValue) ||
        product.price <= maxPriceValue
      );
    })
    .sort(sortOptionValue === "Expensive" ? sortingExpensive : sortingCheapest);

  renderProducts(filteredProducts); // add this line to return the filtered products
}
// added another functinality "add to cart"
const cart = [];
productsUl.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const productId = event.target.dataset.productId;
    const product = products.find((product) => product.id === productId);

    if (product) {
      cart.push(product);
      renderCart();
    }
  }
});
const cartUl = document.querySelector("section.cart ul");
const totalPriceTag = document.getElementById("totalPrice");

function renderCart() {
  cartUl.innerHTML = "";
  let totalPrice = 0;
  cart.forEach((product) => {
    const liTag = document.createElement("li");
    liTag.innerHTML = `
        <ul>
        <li>${product.name}<li>
        <li>${product.price}<li>
        </ul>
        `;
    cartUl.appendChild(liTag);
    totalPrice += product.price;
  });

  totalPriceTag.textContent = totalPrice;
}
