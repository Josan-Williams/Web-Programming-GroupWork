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



function displayCheckout() {
    console.log("Raw cart from localStorage:", localStorage.getItem("cart"));
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


function goCheckout() {

    let loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
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

function handleRegister(event) {
    // 1. Stop form from reloading the page
    if (event) event.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !username || !password) {
        alert("Please fill in all fields.");
        return false;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return false;

    const user = { name, email, username, password };

    // Save user
    localStorage.setItem("registeredUser", JSON.stringify(user));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";

    return false;
}


   
    const user = { name, email, username, password };

    // save to localStorage
    localStorage.setItem("registeredUser", JSON.stringify(user));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html"; // send them to login page

    return false;
}


/*function for to get login information from local storage*/

function handleLogin(event) {
    if (event) event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const storedUserJSON = localStorage.getItem("registeredUser");

    if (!storedUserJSON) {
        alert("No user found. Please register first.");
        window.location.href = "register.html";
        return false;
    }

    const storedUser = JSON.parse(storedUserJSON);

    if (username === storedUser.username && password === storedUser.password) {
        // IMPORTANT: mark as logged in
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", storedUser.username);

        alert("Login successful!");
        window.location.href = "index.html";  // or products.html
    } else {
        alert("Incorrect username or password.");
    }

    return false;
}


function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    alert("You have been logged out.");
    window.location.href = "index.html";
}


let data = JSON.parse(localStorage.getItem("cart"));
