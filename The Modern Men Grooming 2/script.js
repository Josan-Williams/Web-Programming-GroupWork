console.log("Script loaded succesfully.");

let cart = JSON.parse(localStorage.getItem("cart"))||[];

function addToCart(name, price, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = cart.find(x => x.name === name);

    if(item){
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1, image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}


function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let tableBody = document.getElementById("cartItems");
    tableBody.innerHTML = "";

    let discountRate = 0.10;
    let taxRate = 0.15;

    let subtotal = 0;

   cart.forEach((item, index) => {

    let lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    let row = `
        <tr>
            <td><img src="${item.image}" width="60" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.qty}</td>
            <td>
                <button onclick="increaseQty(${index})">+</button>
                <button onclick="decreaseQty(${index})">-</button>
            </td>
            <td>${lineTotal.toFixed(2)}</td>
        </tr>
    `;
    tableBody.innerHTML += row;
});


    let discount = subtotal * discountRate;
    let tax = subtotal * taxRate;
    let total = subtotal - discount + tax;

    document.getElementById("discount").innerText = discount.toFixed(2);
    document.getElementById("tax").innerText = tax.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);
}


if (document.getElementById("cartItems")) {
    displayCart();
}


function clearCart(){
    localStorage.removeItem("cart");
    alert("Cart cleared!");
    location.reload();
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


function confirmOrder() {
    alert("Order Confirmed!");
    localStorage.clear();
    window.location.href = "index.html";
}

function cancelOrder() {
    window.location.href = "cart.html";
}

function increaseQty(i){
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart[i].qty++;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function decreaseQty(i){
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart[i].qty--;

    if(cart[i].qty <= 0){
        cart.splice(i, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
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

    let booleanValid = true;
    // iii. Password must be at least 8 characters
    function validatePassword(pw) {
        if (password.length < 8) {
        errorEl.textContent = "Password must be at least 8 characters long.";
        return false;
      }
    }

    // iv. Visitor must be over 18
    function validateDOB(dob) {
      if (!isOver18(dob)) {
          errorEl.textContent = "You must be at least 18 years old to register.";
          return false;
      } 
    }

    // v. TRN format: 000-000-000
    function validateTRN(trn) {
      const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
      if (!trnPattern.test(trn)) {
          errorEl.textContent = "TRN must be in the format 000-000-000.";
          return false;
      }
    }
    // vi. Check TRN uniqueness in RegistrationData
    let registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    const trnExists = registrations.some(user => user.trn === trn);
    function checkTRNUniqueness(trnExists) {
      if (trnExists) {
          errorEl.textContent = "This TRN is already registered. Please log in.";
          return false;
      }
    }

    // vii. Validate gender selection is valid
    const genderOptions = ["Male", "Female", "Other"];
    function validateGender(gender) {
      if (!genderOptions.includes(gender)) {
          errorEl.textContent = "Please select a valid gender.";
          return false;
      }
    }
    
    // Run validations
    if ((validateDOB(dob) === false) || 
        (validateTRN(trn) === false) || 
        (validatePassword(password) === false) ||
        (checkTRNUniqueness(trnExists) === false) ||
        (validateGender(gender) === false)) {
          booleanValid = false;
    }
    // Create registration object
    if (booleanValid === false) { 
      handleRegister = false; 
      return errorEl.textContent = "Registration failed. Please correct the errors and try again.";
    }
    
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
    if (booleanValid === true) {
      registrations.push(newUser);
      localStorage.setItem("RegistrationData", JSON.stringify(registrations));
      successEl.textContent = "Registration successful! You can now log in.";
    }

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

    alert("Login successful!");
    window.location.href = "index.html";

    return false;
}


// ===== Cart & E-Commerce Script =====

console.log("Script loaded successfully.");

// Sample products (saved once in localStorage)
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
  const loggedUserJSON = localStorage.getItem("LoggedInUser");
  if (!loggedUserJSON) {
    alert("Please log in before adding items to cart.");
    window.location.href = "login.html";
    return;
  }

  let loggedUser = JSON.parse(loggedUserJSON);
  const products = JSON.parse(localStorage.getItem("AllProducts")) || [];
  const product = products.find(p => p.id === productID);
  if (!product) return;

  if (!loggedUser.cart) loggedUser.cart = [];

  // Check if item already in cart
  const existingItem = loggedUser.cart.find(i => i.id === product.id);
  if (existingItem) {
    existingItem.qty++;
  } else {
    loggedUser.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });
  }

  localStorage.setItem("LoggedInUser", JSON.stringify(loggedUser));
  alert(`${product.name} added to cart!`);

  loadCart(); // refresh cart display
}

// ===== Display Cart =====
function loadCart() {
  const table = document.getElementById("cartTable");
  const totalBox = document.getElementById("cartTotal");

  if (!table || !totalBox) return;

  const userJSON = localStorage.getItem("LoggedInUser");
  if (!userJSON) {
    table.innerHTML = "<tr><td colspan='5'>Please log in to see your cart.</td></tr>";
    totalBox.innerHTML = "";
    return;
  }

  const user = JSON.parse(userJSON);
  if (!user.cart || user.cart.length === 0) {
    table.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
    totalBox.innerHTML = "";
    return;
  }

  let output = "";
  let total = 0;
  user.cart.forEach((item, index) => {
    total += item.price * item.qty;
    output += `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" width="60"></td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>${item.qty}</td>
        <td>
          <button onclick="increaseQty(${index})">+</button>
          <button onclick="decreaseQty(${index})">-</button>
        </td>
        <td>$${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `;
  });

  table.innerHTML = output;
  totalBox.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// ===== Increase / Decrease Quantity =====
function increaseQty(index) {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  user.cart[index].qty++;
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
  loadCart();
}

function decreaseQty(index) {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  user.cart[index].qty--;
  if (user.cart[index].qty <= 0) user.cart.splice(index, 1);
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
  loadCart();
}

// ===== Clear Cart =====
function clearCart() {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  if (user && user.cart) {
    user.cart = [];
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    alert("Cart cleared!");
    loadCart();
  }
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

// ===== Confirm / Cancel Order =====
function confirmOrder() {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  if (user) user.cart = [];
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
  alert("Order confirmed!");
  window.location.href = "index.html";
}

function cancelOrder() {
  window.location.href = "cart.html";
}

// ===== Load Page =====
window.onload = () => {
  loadProducts();
  loadCart();
  displayCheckout();
};
