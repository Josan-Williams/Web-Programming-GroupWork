/*
 * ============================================================================
 * Group Project: E-Commerce Website - The Modern Men Grooming
 * ============================================================================
 * Group Member Names:
 * - Antonio Smith (2210723)
 * - Danielle Noble (2205710)
 * - Damani Gordon (2207420)
 * - Josan Williams (2304917)
 * - Jayson Treasure (2204095)
 * ============================================================================
 * Assignment: Web Programming Group Project
 * Description: E-commerce website with user authentication, product catalog,
 *              shopping cart, checkout, and invoice generation using HTML5,
 *              CSS3, JavaScript, and localStorage.
 * ============================================================================
 */

console.log("Script loaded succesfully.");

// ============================================================================
// REQUIREMENT 1: USER AUTHENTICATION (LocalStorage)
// ============================================================================

// ============================================================================
// REQUIREMENT 1.a: REGISTRATION PAGE
// ============================================================================

// ============================================================================
// REQUIREMENT 1.a.i: Create a registration form where users can enter their 
// first name, last name, date of birth, gender, phone number, email, 
// tax registration number (trn), and password, etc.
// 
// REQUIREMENT 1.a.ii: Validate the form to ensure all fields are filled 
// (HTML validation). JavaScript Error handling.
//
// REQUIREMENT 1.a.iii: Passwords should be at least 8 characters long.
//
// REQUIREMENT 1.a.iv: Visitor must be over 18 years old to register. 
// Calculate age using JavaScript.
//
// REQUIREMENT 1.a.v: TRN is unique; must be of length and in the format 
// (000-000-000). **trn is used instead of a username with login.
//
// REQUIREMENT 1.a.vi: Store registration information (ie. first name, last name, 
// date of birth, gender, phone number, email, tax registration number (trn), 
// password, date of registration, cart{}, invoices[]) as a JavaScript object. 
// Each registration record must be appended to localStorage key called 
// RegistrationData using JavaScript (as an array of objects.)
//
// REQUIREMENT 1.a.vii: Register button (used to stored registration form data)
//
// REQUIREMENT 1.a.viii: Cancel button (used to clear data from the registration form)
// ============================================================================

function handleRegister(event) {
    if (event) event.preventDefault();

    // Get form values
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

    // REQUIREMENT 1.a.ii: HTML validation ensures required fields are filled
    // Additional JavaScript error handling below

    // REQUIREMENT 1.a.iii: Password must be at least 8 characters long
    if (password.length < 8) {
        errorEl.textContent = "Password must be at least 8 characters long.";
        return false;
    }

    // REQUIREMENT 1.a.iv: Visitor must be over 18 years old
    // Calculate age using JavaScript
    if (!isOver18(dob)) {
        errorEl.textContent = "You must be at least 18 years old to register.";
        return false;
    }

    // REQUIREMENT 1.a.v: TRN format validation: 000-000-000
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        errorEl.textContent = "TRN must be in the format 000-000-000.";
        return false;
    }

    // REQUIREMENT 1.a.v: Check TRN uniqueness in RegistrationData
    let registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    const trnExists = registrations.some(user => user.trn === trn);
    if (trnExists) {
        errorEl.textContent = "This TRN is already registered. Please log in.";
        return false;
    }

    // REQUIREMENT 1.a.vi: Create registration object with all required fields
    // Store as JavaScript object with cart{} and invoices[]
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        phone: phone,
        email: email,
        trn: trn,
        password: password,
        dateOfRegistration: new Date().toISOString(),
        cart: [],      // Empty cart object
        invoices: []   // Empty invoices array
    };

    // REQUIREMENT 1.a.vi: Append to localStorage key "RegistrationData"
    // as an array of objects
    registrations.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(registrations));

    successEl.textContent = "Registration successful! You can now log in.";
    
    // Redirect to login page after successful registration
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);

    return false;
}

// ============================================================================
// REQUIREMENT 1.a.iv: Helper function to calculate age and ensure 18+
// Calculate age using JavaScript
// ============================================================================
function isOver18(dobString) {
    if (!dobString) return false;

    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 18;
}

// ============================================================================
// REQUIREMENT 1.a.viii: Cancel button - Clear registration form data
// ============================================================================
function clearRegisterForm() {
    document.getElementById("registerForm").reset();
    const errorEl = document.getElementById("registerError");
    const successEl = document.getElementById("registerSuccess");
    if (errorEl) errorEl.textContent = "";
    if (successEl) successEl.textContent = "";
}

// ============================================================================
// REQUIREMENT 1.b: LOGIN PAGE
// ============================================================================

// ============================================================================
// REQUIREMENT 1.b.i: Create a login form where visitors can enter their TRN 
// and password provided at registration.
//
// REQUIREMENT 1.b.ii: Validate this login data by checking the currently 
// entered trn and password against data associated with the localStorage key 
// called, RegistrationData.
//
// REQUIREMENT 1.b.iii: A visitor is given three (3) attempts to enter a 
// correct trn and password. If login is successful, redirect the user to 
// the product catalog. Otherwise, redirect the user to an error/account 
// locked page.
//
// REQUIREMENT 1.b.iv: Login button (validate user login information)
//
// REQUIREMENT 1.b.v: Cancel button (used to clear data from the Login form)
//
// REQUIREMENT 1.b.vi: Reset Password hyperlink (used to allow the user to 
// change their password that is associated with the localStorage key called, 
// RegistrationData by matching their trn.
// ============================================================================

function handleLogin(event) {
    if (event) event.preventDefault();

    // REQUIREMENT 1.b.i: Get TRN and password from login form
    const trn = document.getElementById("loginTRN").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    // Validate TRN format
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        errorEl.textContent = "TRN must be in the format 000-000-000.";
        return false;
    }

    // REQUIREMENT 1.b.ii: Validate login data against RegistrationData
    const registrations = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Find user by TRN
    const user = registrations.find(u => u.trn === trn);

    if (!user) {
        errorEl.textContent = "No account found with this TRN. Please register.";
        return false;
    }

    // Check password
    if (user.password !== password) {
        errorEl.textContent = "Incorrect password.";
        // TODO: REQUIREMENT 1.b.iii - Implement 3-attempt limit and account locking
        return false;
    }

    // REQUIREMENT 1.b.iii: If login is successful, redirect to product catalog
    // Set login status
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUserTRN", user.trn);
    localStorage.setItem("currentUserName", user.firstName + " " + user.lastName);
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Login successful!");
    window.location.href = "products.html"; // Redirect to product catalog

    return false;
}

// ============================================================================
// REQUIREMENT 2: PRODUCT CATALOGUE
// ============================================================================

// ============================================================================
// REQUIREMENT 2.a: PRODUCT LIST (Using Arrays & Objects)
// ============================================================================

// ============================================================================
// REQUIREMENT 2.a.i: Create an array of product objects in JavaScript. 
// Each product should have: name, price, description, image
//
// REQUIREMENT 2.b: An updated product list must be kept on localStorage, 
// as AllProducts.
// ============================================================================

let AllProducts = [
  { 
    id: 1, 
    name: "Beard Oil", 
    price: 2000, 
    description: "Keeps beard soft, shiny, and healthy.", 
    image: "../Assets/beardoil.webp" 
  },
  { 
    id: 2, 
    name: "Beard Balm", 
    price: 1500, 
    description: "Moisturizes and strengthens your beard.", 
    image: "../Assets/beardbalm.webp" 
  },
  { 
    id: 3, 
    name: "Hair Pomade", 
    price: 1800, 
    description: "Strong hold with a natural shine.", 
    image: "../Assets/pomade.webp" 
  }
];

// REQUIREMENT 2.b: Store product list in localStorage as AllProducts
if (!localStorage.getItem("AllProducts")) {
  localStorage.setItem("AllProducts", JSON.stringify(AllProducts));
}

// ============================================================================
// REQUIREMENT 2.c: Display the product list dynamically on the website.
//
// REQUIREMENT 2.d: Each product should have an "Add to Cart" button.
// ============================================================================

function loadProducts() {
  const productSection = document.getElementById("productList");
  if (!productSection) return;

  // REQUIREMENT 2.c: Display products dynamically
  const products = JSON.parse(localStorage.getItem("AllProducts")) || [];
  productSection.innerHTML = "";

  products.forEach(product => {
    // REQUIREMENT 2.d: Each product has "Add to Cart" button
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

// ============================================================================
// REQUIREMENT 2.e: ADD TO CART
// ============================================================================

// ============================================================================
// REQUIREMENT 2.e.i.1: When a user clicks the "Add to Cart" button, add the 
// selected product to the user's shopping cart.
//
// REQUIREMENT 2.e.i.2: Shopping cart must include, product details along with 
// the taxes, discounts, subtotal and current total cost.
// ============================================================================

function addToCart(productID) {
  // REQUIREMENT 2.e.i.1: Add selected product to user's shopping cart
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
    // REQUIREMENT 2.e.i.2: Calculate taxes and discounts
    let tax = item.price * 0.15;  // 15% tax
    let discount = item.price > 3000 ? item.price * 0.10 : 0;  // 10% discount if price > 3000
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

  // Save updated cart to localStorage
  localStorage.setItem("LoggedInUser", JSON.stringify(loggedUser));
  alert(`${item.name} added to cart!`);
}

// ============================================================================
// REQUIREMENT 3: CART PAGE
// ============================================================================

// ============================================================================
// REQUIREMENT 3.a: Create a shopping cart page that lists the items in the 
// cart (name, price, quantity, sub-total, discount, tax, and total, etc).
//
// REQUIREMENT 3.b: Allow users to remove items from the cart and update quantities.
//
// REQUIREMENT 3.c: Calculate and display the total price of the items in the cart.
//
// REQUIREMENT 3.d: Clear All button (remove all items from shopping cart)
//
// REQUIREMENT 3.e: Check Out button (redirects to Checkout Page)
//
// REQUIREMENT 3.f: Close button (close the shopping cart view)
// ============================================================================

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

    // REQUIREMENT 3.a: Display cart items with name, price, quantity, sub-total
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

    // REQUIREMENT 3.c: Calculate and display total price with discount and tax
    const discount = subtotal * 0.10; // 10% discount
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal - discount + tax;

    tableBody.innerHTML = output;
    discountEl.innerText = discount.toFixed(2);
    taxEl.innerText = tax.toFixed(2);
    totalEl.innerText = total.toFixed(2);
}

// Initialize cart display on page load
if (document.getElementById("cartItems")) {
    displayCart();
}

// REQUIREMENT 3.b: Allow users to update quantities
function increaseQty(index) {
    const user = JSON.parse(localStorage.getItem("LoggedInUser"));
    user.cart[index].qty++;
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    displayCart();
}

function decreaseQty(index) {
    const user = JSON.parse(localStorage.getItem("LoggedInUser"));
    user.cart[index].qty--;
    // Remove item if quantity reaches 0
    if (user.cart[index].qty <= 0) user.cart.splice(index, 1);
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    displayCart();
}

// REQUIREMENT 3.d: Clear All button - Remove all items from shopping cart
function clearCart() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return;

    const user = JSON.parse(userJSON);
    user.cart = [];
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Cart cleared!");
    displayCart();
}

// REQUIREMENT 3.e: Check Out button - Redirects to Checkout Page
function goCheckout() {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "checkout.html";
}

// ============================================================================
// REQUIREMENT 4: CHECKOUT PAGE
// ============================================================================

// ============================================================================
// REQUIREMENT 4.a: Show a summary of the shopping cart with the total cost.
//
// REQUIREMENT 4.b: Allow the user to enter their shipping details 
// (e.g., name, address, amount being paid).
//
// REQUIREMENT 4.c: When the user confirms the checkout, generate an invoice.
//
// REQUIREMENT 4.d: Confirm button (confirms the checkout)
//
// REQUIREMENT 4.e: Cancel button (go back to the cart)
// ============================================================================

// REQUIREMENT 4.a: Load and display checkout cart summary
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

    // Display cart items in checkout summary
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

    // Calculate totals
    const discount = subtotal * 0.10;
    const tax = subtotal * 0.15;
    const total = subtotal - discount + tax;

    // Display totals
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const taxEl = document.getElementById("checkoutTax");
    const discountEl = document.getElementById("checkoutDiscount");
    const totalEl = document.getElementById("checkoutTotal");

    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
    if (taxEl) taxEl.innerText = tax.toFixed(2);
    if (discountEl) discountEl.innerText = discount.toFixed(2);
    if (totalEl) totalEl.innerText = total.toFixed(2);
}

// REQUIREMENT 4.d: Confirm button - Confirms the checkout and generates invoice
// REQUIREMENT 4.c: Generate an invoice when user confirms checkout
function confirmOrder() {
    const userJSON = localStorage.getItem("LoggedInUser");
    if (!userJSON) return alert("No user logged in.");

    const user = JSON.parse(userJSON);
    if (!user.cart || user.cart.length === 0) return alert("Cart is empty.");

    // REQUIREMENT 4.b: Get shipping details from form
    const shippingInfo = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value,
        country: document.getElementById("country").value
    };
    user.shippingInfo = shippingInfo;

    // REQUIREMENT 5: Generate invoice (see below for detailed requirements)
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

    // Store invoice in user's invoices array
    if (!user.invoices) user.invoices = [];
    user.invoices.push(invoice);
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    // Store invoice in AllInvoices
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    allInvoices.push(invoice);
    localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

    // Clear cart after order
    user.cart = [];
    localStorage.setItem("LoggedInUser", JSON.stringify(user));

    alert("Order confirmed! Invoice generated and sent to your email.");
    window.location.href = "invoice.html";
}

// REQUIREMENT 4.e: Cancel button - Go back to the cart
function cancelOrder() {
    window.location.href = "cart.html";
}

// ============================================================================
// REQUIREMENT 5: INVOICE GENERATION
// ============================================================================

// ============================================================================
// REQUIREMENT 5.a: After checkout, generate an invoice with the following details:
// - Name of company
// - Date of invoice
// - Shipping information (from checkout)
// - Invoice number (unique)
// - TRN
// - Purchased items (name, quantity, price, discount)
// - Taxes
// - Subtotal
// - Total cost
//
// REQUIREMENT 5.b: Append this invoice to the user's array of invoices 
// (array of objects). Also store the invoice to localStorage with the key 
// called AllInvoices (as an array of objects) to access later.
//
// REQUIREMENT 5.c: Optionally, display a message indicating that the invoice 
// has been "sent" to the user's email.
// ============================================================================

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
    
    // REQUIREMENT 5.a: Display invoice with all required details
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
                        const totalDiscount = item.discount * item.qty;
                        const itemSubtotal = (item.price * item.qty) - totalDiscount;
                        return `
                        <tr id="invoiceRow">
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${totalDiscount.toFixed(2)}</td>
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

// ============================================================================
// REQUIREMENT 6: ADDITIONAL FUNCTIONALITY
// ============================================================================

// ============================================================================
// REQUIREMENT 6.a: ShowUserFrequency() – Show's user frequency based on 
// Gender and Age Group:
//
// REQUIREMENT 6.a.i: Show how many registered users fall under specific 
// gender categories (e.g. Male, Female, Other)
//
// REQUIREMENT 6.a.ii: Show how many registered users fall under different 
// age groups (e.g., 18-25, 26-35, 36-50, 50+).
//
// REQUIREMENT 6.a.iii: Display this data on a dashboard or a separate page.
// ============================================================================

function ShowUserFrequency() {
    // Get all registered users from RegistrationData
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // REQUIREMENT 6.a.i: Count users by gender
    let male = 0, female = 0, other = 0;

    // REQUIREMENT 6.a.ii: Count users by age group
    let age18_25 = 0, age26_35 = 0, age36_50 = 0, age50plus = 0;

    users.forEach(user => {
        // Gender categorization
        if (user.gender === 'Male') male++;
        else if (user.gender === 'Female') female++;
        else other++;

        // Age group categorization
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

    // REQUIREMENT 6.a.iii: Display data on dashboard
    // Update gender counts in HTML
    const maleEl = document.getElementById('uf-maleCount');
    if (maleEl) maleEl.textContent = male;
    const femaleEl = document.getElementById('uf-femaleCount');
    if (femaleEl) femaleEl.textContent = female;
    const otherEl = document.getElementById('uf-otherCount');
    if (otherEl) otherEl.textContent = other;

    // Update age groups in HTML
    const age18_25El = document.getElementById('uf-age18_25');
    if (age18_25El) age18_25El.textContent = age18_25;
    const age26_35El = document.getElementById('uf-age26_35');
    if (age26_35El) age26_35El.textContent = age26_35;
    const age36_50El = document.getElementById('uf-age36_50');
    if (age36_50El) age36_50El.textContent = age36_50;
    const age50plusEl = document.getElementById('uf-age50plus');
    if (age50plusEl) age50plusEl.textContent = age50plus;
}

// Helper function for registration handler
function userRegistrationHandler() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            ShowUserFrequency();
        });
    }
}

// ============================================================================
// REQUIREMENT 6.b: ShowInvoices() - displays all invoices and allow the 
// visitor to search for any of the invoices (using trn) stored in AllInvoices 
// from localStorage using console.log().
// ============================================================================

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

// REQUIREMENT 6.b: Search invoice by TRN
function searchInvoice() {
    const searchTRN = document.getElementById("uf-searchTRN").value.trim();
    const invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

    const result = invoices.filter(inv => inv.trn === searchTRN);
    console.log("Search results for TRN:", searchTRN, result);

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

// ============================================================================
// REQUIREMENT 6.c: GetUserInvoices() – displays all the invoices for a user 
// based on trn stored in the localStorage key called, RegisterData.
// ============================================================================

function GetUserInvoices() {
    const trn = document.getElementById("uf-userTRN").value.trim();
    const invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

    const userInvoices = invoices.filter(inv => inv.trn === trn);
    console.log("User invoices for TRN:", trn, userInvoices);

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

// ============================================================================
// PAGE LOAD EVENT HANDLERS
// ============================================================================

// Run dashboard update on page load
document.addEventListener('DOMContentLoaded', () => {
    ShowUserFrequency();
    userRegistrationHandler();
    ShowInvoices(); 
});

window.addEventListener("load", () => {
  if (document.title.includes("Invoices")) loadInvoices();
  if (document.title.includes("Checkout")) loadCheckoutCart();
  loadProducts();
});
