console.log("Script loaded succesfully.");

let cart = JSON.parse(localStorage.getItem("cart"))||[];

//actually display cart
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

    const discount = subtotal * 0.10; // 10% discount
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal - discount + tax;

    tableBody.innerHTML = output;
    discountEl.innerText = discount.toFixed(2);
    taxEl.innerText = tax.toFixed(2);
    totalEl.innerText = total.toFixed(2);
}

if (document.getElementById("cartItems")) {
    displayCart();
}

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
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return;

    const user = JSON.parse(userJSON);
    if (!user.cart || user.cart.length === 0) return;

    let subtotal = 0, totalTax = 0, totalDiscount = 0;

    user.cart.forEach(item => {
        subtotal += item.price * item.qty;
        totalTax += item.tax * item.qty;
        totalDiscount += item.discount * item.qty;
    });
}

if (document.title.includes("Checkout")) {
    loadCheckoutCart();
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
    alert("You've been logged out.");
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

    // ii. HTML validation ensures required fields.

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
        cart: [],
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

    const companyName = "The Modern Men Grooming 2.0";
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
        discount: totalDiscount,
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
    showInvoiceSentMessage();
    window.location.href = "index.html";
}

function cancelOrder() {
    window.location.href = "cart.html";
}

//actually load checkout cart
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
        subtotal += item.price * item.qty;
        totalTax += item.tax * item.qty;
        totalDiscount += item.discount * item.qty;

        tbody.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="60" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const discount = subtotal * 0.10; // 10% discount
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal - discount + tax;

    const subtotalEl = document.getElementById("checkoutSubtotal");
    const taxEl = document.getElementById("checkoutTax");
    const discountEl = document.getElementById("checkoutDiscount");
    const totalEl = document.getElementById("checkoutTotal");

    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
    if (taxEl) taxEl.innerText = tax.toFixed(2);
    if (discountEl) discountEl.innerText = discount.toFixed(2);
    if (totalEl) totalEl.innerText = total.toFixed(2);
}

// === Load and Display Invoices ===
function loadInvoices() {
    const invoiceListEl = document.getElementById("invoiceList");
    if (!invoiceListEl) return;

    const loggedUserJSON = localStorage.getItem("LoggedInUser");
    if (!loggedUserJSON) {
        invoiceListEl.innerHTML = "<p style='text-align: center; color: var(--secondary); padding: 40px;'>Please log in to view invoices.</p>";
        return;
    }

    const user = JSON.parse(loggedUserJSON);

    if (!user.invoices || user.invoices.length === 0) {
        invoiceListEl.innerHTML = "<p style='text-align: center; color: var(--secondary); padding: 40px;'>No invoices found.</p>";
        return;
    }

    let output = "";
    user.invoices.forEach((inv, index) => {
        output += `
        <div class="auth-card" style="max-width: 900px; margin: 30px auto; padding: 30px;">
            <h2 style="text-align: center; color: var(--secondary);">INVOICE</h2>
            
            <div style="margin-bottom: 25px;">
                <p><strong>Company:</strong> ${inv.companyName}</p>
                <p><strong>Invoice Number:</strong> ${inv.invoiceNumber}</p>
                <p><strong>Date of Invoice:</strong> ${inv.invoiceDate}</p>
                <p><strong>TRN:</strong> ${inv.trn}</p>
            </div>

            <h3 style="color: var(--secondary); margin-top: 25px; margin-bottom: 10px;">Shipping Information</h3>
            <div style="margin-bottom: 25px;">
                <p><strong>Name:</strong> ${inv.shippingInfo.fullName}</p>
                <p><strong>Address:</strong> ${inv.shippingInfo.address}</p>
                <p><strong>City:</strong> ${inv.shippingInfo.city}</p>
                <p><strong>Postal Code:</strong> ${inv.shippingInfo.postalCode}</p>
                <p><strong>Country:</strong> ${inv.shippingInfo.country}</p>
            </div>

            <h3 style="color: var(--secondary); margin-top: 25px; margin-bottom: 15px;">Purchased Items</h3>
            <table border="1" cellpadding="10" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr id="invoiceRow" style="background: #000;">
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${inv.items.map(item => {
                        const itemSubtotal = (item.price * item.qty) - item.discount;
                        return `
                        <tr id="invoiceRow">
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${item.discount.toFixed(2)}</td>
                            <td>$${itemSubtotal.toFixed(2)}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px;">
                <p><strong>Subtotal:</strong> $${inv.subtotal.toFixed(2)}</p>
                <p><strong>Taxes:</strong> $${inv.tax.toFixed(2)}</p>
                <p><strong>Total Discount:</strong> $${inv.discount.toFixed(2)}</p>
                <p style="font-size: 1.3rem; color: var(--secondary); font-weight: bold; margin-top: 10px;">
                    <strong>Total Cost:</strong> $${inv.total.toFixed(2)}
                </p>
            </div>

            <div class="row-buttons" style="margin-top: 30px;">
                <button type="button" onclick="window.print()">Print Invoice</button>
            </div>
        </div>
        <hr style="border: 1px solid #333; margin: 40px 0;">
        `;
    });

    invoiceListEl.innerHTML = output;
}

// === Requirement (c): Show invoice sent message ===
function showInvoiceSentMessage1() {
    alert("Invoice generated and sent to your email.");
}

function showInvoiceSentMessage() {
    const messageDiv = document.createElement("div");
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "20px";
    messageDiv.style.right = "20px";
    messageDiv.style.backgroundColor = "#4CAF50";
    messageDiv.style.color = "#fff";
    messageDiv.style.padding = "15px 20px";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.zIndex = "9999";

    messageDiv.textContent = "Invoice has been sent to your email.";

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 4000);
}

// Run when invoice.html loads
if (document.title.includes("Invoices")) {
    loadInvoices();
}

// Load invoices when page loads
if (document.title.includes("Invoices")) {
    window.onload = loadInvoices;
}

// ============================================================
// USER FREQUENCY DASHBOARD
// ============================================================

// Load users from RegistrationData
function uf_getUsers() {
    return JSON.parse(localStorage.getItem("RegistrationData")) || [];
}

// Update the dashboard counters
function ShowUserFrequency() {
    const uf_users = uf_getUsers(); // get registered users

    // Gender counters
    let male = 0, female = 0, other = 0;

    // Age groups
    let age18_25 = 0, age26_35 = 0, age36_50 = 0, age50plus = 0;

    uf_users.forEach(user => {
        // Gender check (make sure matches exactly the registration value)
        if (user.gender === 'Male') male++;
        else if (user.gender === 'Female') female++;
        else other++;

        // Calculate age from date of birth
        if (user.dob) {
            const dob = new Date(user.dob);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age >= 18 && age <= 25) age18_25++;
            else if (age >= 26 && age <= 35) age26_35++;
            else if (age >= 36 && age <= 50) age36_50++;
            else if (age > 50) age50plus++;
        }
    });

    // Update gender counts in HTML (with null checks)
    const maleEl = document.getElementById('uf-maleCount');
    if (maleEl) maleEl.textContent = male;
    const femaleEl = document.getElementById('uf-femaleCount');
    if (femaleEl) femaleEl.textContent = female;
    const otherEl = document.getElementById('uf-otherCount');
    if (otherEl) otherEl.textContent = other;

    // Update age groups in HTML (with null checks)
    const age18_25El = document.getElementById('uf-age18_25');
    if (age18_25El) age18_25El.textContent = age18_25;
    const age26_35El = document.getElementById('uf-age26_35');
    if (age26_35El) age26_35El.textContent = age26_35;
    const age36_50El = document.getElementById('uf-age36_50');
    if (age36_50El) age36_50El.textContent = age36_50;
    const age50plusEl = document.getElementById('uf-age50plus');
    if (age50plusEl) age50plusEl.textContent = age50plus;
}

// Optional: update dashboard immediately after registration
function userRegistrationHandler() {
    const uf_form = document.getElementById('registerForm');

    if (uf_form) {
        uf_form.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const dob = document.getElementById('dob').value;
            const gender = document.getElementById('gender').value;

            if (!firstName || !lastName || !dob || !gender) return;

            let registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];
            registrations.push({
                firstName,
                lastName,
                dob,
                gender
            });
            localStorage.setItem("RegistrationData", JSON.stringify(registrations));

            uf_form.reset();
            ShowUserFrequency(); // update the dashboard immediately
        });
    }
}

function ShowInvoices() {
    let invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    console.log("All invoices:", invoices);

    const table = document.getElementById("uf-invoiceTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>TRN</th>
            <th>Invoice #</th>
            <th>Total Amount</th>
            <th>Date</th>
        </tr>
    `;

    invoices.forEach(inv => {
        table.innerHTML += `
            <tr>
                <td>${inv.trn}</td>
                <td>${inv.invoiceNumber}</td>
                <td>$${inv.total.toFixed(2)}</td>
                <td>${inv.invoiceDate}</td>
            </tr>
        `;
    });
}

// Search invoice by TRN
function searchInvoice() {
    const searchTRN = document.getElementById("uf-searchTRN").value.trim();
    const invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

    const result = invoices.filter(inv => inv.trn === searchTRN);

    const table = document.getElementById("uf-invoiceTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>TRN</th>
            <th>Invoice #</th>
            <th>Total Amount</th>
            <th>Date</th>
        </tr>
    `;

    result.forEach(inv => {
        table.innerHTML += `
            <tr>
                <td>${inv.trn}</td>
                <td>${inv.invoiceNumber}</td>
                <td>$${inv.total.toFixed(2)}</td>
                <td>${inv.invoiceDate}</td>
            </tr>
        `;
    });
}

// Get invoices for one user TRN
function GetUserInvoices() {
    const trn = document.getElementById("uf-userTRN").value.trim();
    const invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

    const userInvoices = invoices.filter(inv => inv.trn === trn);

    const table = document.getElementById("uf-userInvoiceTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>TRN</th>
            <th>Invoice #</th>
            <th>Total Amount</th>
            <th>Date</th>
        </tr>
    `;

    userInvoices.forEach(inv => {
        table.innerHTML += `
            <tr>
                <td>${inv.trn}</td>
                <td>${inv.invoiceNumber}</td>
                <td>$${inv.total.toFixed(2)}</td>
                <td>${inv.invoiceDate}</td>
            </tr>
        `;
    });
}

// Run dashboard update on page load
document.addEventListener('DOMContentLoaded', () => {
    ShowUserFrequency();
    userRegistrationHandler();
     ShowInvoices(); 
})

window.addEventListener("load", () => {
  if (document.title.includes("Invoices")) loadInvoices();
  if (document.title.includes("Checkout")) loadCheckoutCart();
  loadProducts();
  displayCheckout();
});