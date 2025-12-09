console.log("Script loaded succesfully.");

let cart = JSON.parse(localStorage.getItem("cart"))||[];



function displayCart() {
    const tableBody = document.getElementById("cartItems");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) {
        tableBody.innerHTML = "<tr><td colspan='6'>Please log in to see your cart.</td></tr>";
        discountEl.innerText = "0.00";
        taxEl.innerText = "0.00";
        totalEl.innerText = "0.00";
        return;
    }

    const user = JSON.parse(userJSON);
    if (!user.cart || user.cart.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
        discountEl.innerText = "0.00";
        taxEl.innerText = "0.00";
        totalEl.innerText = "0.00";
        return;
    }

    let output = "";
    let subtotal = 0;

    user.cart.forEach((item, index) => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;

        output += `
            <tr>
                <td><img src="${item.image}" width="60" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>
                    <button onclick="increaseQty(${index})">+</button>
                    <button onclick="decreaseQty(${index})">-</button>
                </td>
                <td>$${lineTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const discount = subtotal * 0.10; // example 10% discount
    const tax = subtotal * 0.15; // example 15% tax
    const total = subtotal - discount + tax;

    tableBody.innerHTML = output;
    discountEl.innerText = discount.toFixed(2);
    taxEl.innerText = tax.toFixed(2);
    totalEl.innerText = total.toFixed(2);
}



if (document.getElementById("cartItems")) {
    displayCart();
}

window.onload = () => {
  displayCart();
};



function clearCart() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return;

    const user = JSON.parse(userJSON);
    user.cart = []; // empty the cart
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Cart cleared!");
    displayCart(); // immediately update the table
}

function goCheckout(){
    window.location.href = "checkout.html";
}


function displayCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    document.getElementById("checkoutTotal").innerText =
        "Total: $" + total.toFixed(2);
}



if (document.title.includes("Checkout")) {
    displayCheckout();
}



function cancelOrder() {
    window.location.href = "cart.html";
}


function goCheckout(){
    let loggedIn = localStorage.getItem("loggedIn");

    if(!loggedIn){
        alert("You must login first!");
        window.location.href = "login.html";
        return;
    }

    window.location.href = "checkout.html";
}

function loginUser(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    if (username === "" || password === "") {
        alert("Please enter username and password.");
        return;
    }
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);

    alert("Login successful! Welcome, " + username + "!");
    window.location.href = "index.html";
}

let loggedInUser = localStorage.getItem("username");
if (loggedInUser) {
    document.getElementById("welcome").textContent = "Welcome, " + loggedInUser + "!";
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    alert("You’ve been logged out.");
    window.location.href = "index.html";
}

// === IA#2 Registration: Handle Register Form ===
function handleRegister(event) {
    if (event) event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const dob       = document.getElementById("dob").value;
    const gender    = document.getElementById("gender").value;
    const phone     = document.getElementById("phone").value.trim();
    const email     = document.getElementById("email").value.trim();
    const trn       = document.getElementById("trn").value.trim();
    const password  = document.getElementById("password").value;

    const errorEl   = document.getElementById("registerError");
    const successEl = document.getElementById("registerSuccess");

    errorEl.textContent = "";
    successEl.textContent = "";

    // ii. HTML validation already ensures required fields,
    // but we'll add JS error messages too.

    // iii. Password must be at least 8 characters
    if (password.length < 8) {
        errorEl.textContent = "Password must be at least 8 characters long.";
        return false;
    }

    // iv. Visitor must be over 18
    if (!isOver18(dob)) {
        errorEl.textContent = "You must be at least 18 years old to register.";
        return false;
    }

    // v. TRN format: 000-000-000
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        errorEl.textContent = "TRN must be in the format 000-000-000.";
        return false;
    }

    // vi. Check TRN uniqueness in RegistrationData
    let registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    const trnExists = registrations.some(user => user.trn === trn);
    if (trnExists) {
        errorEl.textContent = "This TRN is already registered. Please log in.";
        return false;
    }

    // Create registration object
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        phone: phone,
        email: email,
        trn: trn,
        password: password,
        dateOfRegistration: new Date().toISOString(), // store timestamp
        cart: {},
        invoices: []
    };

    // Push to array and save back to localStorage
    registrations.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(registrations));

    successEl.textContent = "Registration successful! You can now log in.";
    
    // Optional: redirect after short delay
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);

    return false;
}

// === Helper: Calculate age and ensure 18+ ===
function isOver18(dobString) {
    if (!dobString) return false;

    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 18;
}

// === Cancel / Clear Register Form ===
function clearRegisterForm() {
    document.getElementById("registerForm").reset();
    const errorEl = document.getElementById("registerError");
    const successEl = document.getElementById("registerSuccess");
    if (errorEl) errorEl.textContent = "";
    if (successEl) successEl.textContent = "";
}

// === IA#2 Login: TRN + Password ===
function handleLogin(event) {
    if (event) event.preventDefault();

    const trn = document.getElementById("loginTRN").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        errorEl.textContent = "TRN must be in the format 000-000-000.";
        return false;
    }

    const registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Find user by TRN
    const user = registrations.find(u => u.trn === trn);

    if (!user) {
        errorEl.textContent = "No account found with this TRN. Please register.";
        return false;
    }

    if (user.password !== password) {
        errorEl.textContent = "Incorrect password.";
        return false;
    }

    // Success: set login status
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUserTRN", user.trn);
    localStorage.setItem("currentUserName", user.firstName + " " + user.lastName);

    // 🔹 NEW: save the full user object for cart functions
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Login successful!");
    window.location.href = "index.html";

    return false;
}



// ===== Cart & E-Commerce Script =====

console.log("Script loaded successfully.");

let AllProducts = [
  { id: 1, name: "Beard Oil", price: 2000, description: "Keeps beard soft, shiny, and healthy.", image: "../Assets/beardoil.webp" },
  { id: 2, name: "Beard Balm", price: 1500, description: "Moisturizes and strengthens your beard.", image: "../Assets/beardbalm.webp" },
  { id: 3, name: "Hair Pomade", price: 1800, description: "Strong hold with a natural shine.", image: "../Assets/pomade.webp" }
];

if (!localStorage.getItem("AllProducts")) {
  localStorage.setItem("AllProducts", JSON.stringify(AllProducts));
}


// ===== Display Products =====
function loadProducts() {
  const productSection = document.getElementById("productList");
  if (!productSection) return;

  const products = JSON.parse(localStorage.getItem("AllProducts")) || [];
  productSection.innerHTML = "";

  products.forEach(product => {
    productSection.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>$${product.price}</strong></p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ===== Add to Cart for Logged-In Users =====
function addToCart(productID) {
  let loggedUser = JSON.parse(localStorage.getItem("LoggedInUser"));

  if (!loggedUser) {
    alert("Please log in before adding items to cart.");
    return;
  }

  let products = JSON.parse(localStorage.getItem("AllProducts"));
  let item = products.find(p => p.id === productID);
  if (!item) return;

  if (!loggedUser.cart) loggedUser.cart = [];

  // Check if item already exists in cart
  let cartItem = loggedUser.cart.find(ci => ci.id === item.id);
  if (cartItem) {
    cartItem.qty++;
  } else {
    let tax = item.price * 0.15;
    let discount = item.price > 3000 ? item.price * 0.10 : 0;
    let finalPrice = item.price + tax - discount;

    loggedUser.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1,
      tax,
      discount,
      finalPrice
    });
  }

  localStorage.setItem("LoggedInUser", JSON.stringify(loggedUser));
  alert(`${item.name} added to cart!`);
}



// ===== Display Cart =====
function loadCart() {
  const tableBody = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalDisplay");

  if (!tableBody || !totalBox) return;

  const userJSON = localStorage.getItem("LoggedInUser");
  if (!userJSON) {
    tableBody.innerHTML = "<tr><td colspan='6'>Please log in to see your cart.</td></tr>";
    totalBox.innerHTML = "";
    return;
  }

  const user = JSON.parse(userJSON);
  if (!user.cart || user.cart.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
    totalBox.innerHTML = "";
    return;
  }

  let output = "";
  let total = 0;

  user.cart.forEach((item, index) => {
    total += item.finalPrice * item.qty;

    output += `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" width="60"></td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.qty}</td>
        <td>
          <button onclick="increaseQty(${index})">+</button>
          <button onclick="decreaseQty(${index})">-</button>
        </td>
        <td>$${(item.finalPrice * item.qty).toFixed(2)}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = output;
  totalBox.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}



// ===== Increase / Decrease Quantity =====
function increaseQty(index) {
    const user = JSON.parse(localStorage.getItem("LoggedInUser"));
    user.cart[index].qty++;
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    displayCart(); // update immediately
}

function decreaseQty(index) {
    const user = JSON.parse(localStorage.getItem("LoggedInUser"));
    user.cart[index].qty--;
    if (user.cart[index].qty <= 0) user.cart.splice(index, 1);
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    displayCart(); // update immediately
}


// ===== Clear Cart =====
function clearCart() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return;

    const user = JSON.parse(userJSON);
    user.cart = []; // empty the cart
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Cart cleared!");
    displayCart(); // immediately update the table
}

// ===== Checkout =====
function goCheckout() {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "checkout.html";
}

function displayCheckout() {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  if (!user || !user.cart) return;

  let total = 0;
  user.cart.forEach(item => total += item.price * item.qty);

  const totalEl = document.getElementById("checkoutTotal");
  if (totalEl) totalEl.innerText = "Total: $" + total.toFixed(2);
}


// ===== Load Page =====
window.onload = () => {
  loadProducts();
  loadCart();
  displayCheckout();
};

function confirmOrder() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return alert("No user logged in.");

    const user = JSON.parse(userJSON);
    if (!user.cart || user.cart.length === 0) return alert("Cart is empty.");

    // Get shipping info from form
    const shippingInfo = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value,
        country: document.getElementById("country").value
    };
    user.shippingInfo = shippingInfo;

    const companyName = "The Modern Man Grooming";
    const invoiceDate = new Date().toLocaleString();
    const invoiceNumber = "INV-" + Date.now();
    const trn = user.trn;

    let subtotal = 0, totalTax = 0, totalDiscount = 0;

    user.cart.forEach(item => {
        subtotal += item.price * item.qty;
        totalTax += item.tax * item.qty;
        totalDiscount += item.discount * item.qty;
    });

    const total = subtotal + totalTax - totalDiscount;

    const invoice = {
        invoiceNumber,
        invoiceDate,
        companyName,
        shippingInfo,
        trn,
        items: user.cart.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            discount: item.discount
        })),
        subtotal,
        tax: totalTax,
        total
    };

    if (!user.invoices) user.invoices = [];
    user.invoices.push(invoice);
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    allInvoices.push(invoice);
    localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

    // Clear cart
    user.cart = [];
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Order confirmed! Invoice generated and sent to your email.");
    window.location.href = "index.html";
}


function cancelOrder() {
    window.location.href = "cart.html";
}


function loadCheckoutCart() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return;

    const user = JSON.parse(userJSON);
    const tbody = document.getElementById("checkoutItems");
    if (!tbody) return;

    tbody.innerHTML = "";

    let subtotal = 0, totalTax = 0, totalDiscount = 0;

    if (!user.cart || user.cart.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>Your cart is empty.</td></tr>";
        return;
    }

    user.cart.forEach(item => {
        const itemSubtotal = item.price * item.qty;
        subtotal += itemSubtotal;
        totalTax += item.tax * item.qty;
        totalDiscount += item.discount * item.qty;

        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById("checkoutDiscount").innerText = totalDiscount.toFixed(2);
    document.getElementById("checkoutTax").innerText = totalTax.toFixed(2);
    document.getElementById("checkoutTotal").innerText = (subtotal + totalTax - totalDiscount).toFixed(2);
}

// Call on window load
if (document.title.includes("Checkout")) {
    window.onload = loadCheckoutCart;
}

function loadInvoices() {
    const invoiceListEl = document.getElementById("invoiceList");
    if (!invoiceListEl) return;

    const loggedUserJSON = localStorage.getItem("LoggedInUser");
    if (!loggedUserJSON) {
        invoiceListEl.innerHTML = "<p>Please log in to view invoices.</p>";
        return;
    }

    const user = JSON.parse(loggedUserJSON);

    if (!user.invoices || user.invoices.length === 0) {
        invoiceListEl.innerHTML = "<p>No invoices found.</p>";
        return;
    }

    let output = "";
    user.invoices.forEach((inv, index) => {
        output += `
        <div class="invoice-card">
            <h3>Invoice #${inv.invoiceNumber}</h3>
            <p><strong>Date:</strong> ${inv.invoiceDate}</p>
            <p><strong>TRN:</strong> ${inv.trn}</p>
            <p><strong>Shipping:</strong> ${JSON.stringify(inv.shippingInfo)}</p>
            <table border="1" cellpadding="5">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${inv.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${item.discount.toFixed(2)}</td>
                            <td>$${(item.price * item.qty - item.discount).toFixed(2)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <p><strong>Tax:</strong> $${inv.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> $${inv.total.toFixed(2)}</p>
        </div>
        <hr>
        `;
    });

    invoiceListEl.innerHTML = output;
}

// Run when invoices.html loads
if (document.title.includes("Invoices")) {
    loadInvoices();
}


// Load invoices when page loads
if (document.title.includes("Invoices")) {
    window.onload = loadInvoices;
}


window.addEventListener("load", () => {
  if (document.title.includes("Invoices")) loadInvoices();
  if (document.title.includes("Checkout")) loadCheckoutCart();
  loadProducts();
  loadCart();
  displayCheckout();
});
