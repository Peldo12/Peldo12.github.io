import {products, exportProducts, users} from "/default.js";

// LOGIN

const formDisplay = document.getElementById("form");
const usernameInput = document.getElementById("username");
const passInput = document.getElementById("password");
const togglePass = document.getElementById("toggle-pass");
const eyeOff = document.getElementById("line-eye");
const getDashboard = document.getElementById("get-dashboard");

// MENU
const dashboard = document.getElementById("app");
const toggleNav = document.getElementById("menu-toggle");
const navMenu = document.getElementById("menu-item");

// DISPLAY
const itemDisplay = document.querySelectorAll(".display-container");
const inputContainer = document.getElementById("display-input");
const totalContainer = document.getElementById("display-total");
const total = document.querySelectorAll(".total");
const jenis = document.getElementById("jenis");
const qtyItem = document.getElementById("qty-item");
const getCash = document.querySelectorAll(".get-cash");

// ADD MORE ITEM
const addItem = document.getElementById("add-item");
const qtyValue = document.getElementById("qty-value");
const qtyToggle = document.querySelectorAll(".qty-toggle");
const addedSearch = document.getElementById("added-search");
const addedItem = document.getElementById("added-item");
const optionProducts = document.getElementById("data-search");
const paymentOpsi = document.getElementById("payment-control");


// CHECKOUT
const paymentQris = document.getElementById("payment-qris");
const paymentCash = document.getElementById("payment-cash");
const customerCash = document.querySelectorAll(".cust-cash");
const changeCash = document.getElementById("cust-change");
const inputDelete = document.getElementById("input-del");
const togglePad = document.getElementById("get-numpad");
const numpadDisplay = document.getElementById("input-container");
const inputQuick = document.querySelectorAll(".quick-append");
const inputButton = document.querySelectorAll(".input-append");
const inputPass = document.getElementById("cash-equal");
const checkoutContainer = document.getElementById("checkout-modal");
const checkoutHeader = document.querySelectorAll(".checkout-header");
const checkout = document.querySelectorAll(".checkout");
const finishPay = document.querySelectorAll(".payment-done");

// SUMMARY
const summaryContainer = document.getElementById("payment-summary")
const summaryChange = document.getElementById("change-summary");

// FUNGSI
const close = document.querySelectorAll(".close");
const back = document.getElementById("back");

// DEFAULT 
localStorage.setItem('keranjang', JSON.stringify(exportProducts));
localStorage.setItem('products', JSON.stringify(products));
localStorage.setItem('users', JSON.stringify(users));

// EVENT
window.addEventListener("DOMContentLoaded", function() {
  // EVENT LOGIN
  usernameInput.addEventListener("input", (event) => {
    handleButtonLog(event.target);
  });
  passInput.addEventListener("input", (event) => {
    handleButtonLog(event.target);
  });
  togglePass.addEventListener("click", () => {
  eyeOff.classList.toggle("no-display");
  passInput.type = passInput.type == "password" ? "text" : "password";
  });
  getDashboard.addEventListener("click", handleLogin);
  
  // EVENT TOGGLE NAV
  toggleNav.addEventListener("click", handleNav);
  
  addItem.addEventListener("click", handleInput);
  inputQuick.forEach(el => el.addEventListener("click", (event) => appendQuick(event.target.textContent)))
  inputButton.forEach(el => el.addEventListener("click", (event) => appendInput(event.target)));
  inputPass.addEventListener("click", () => {
    customerCash.forEach(el => el.textContent = total[0].textContent);
    finishPay[1].click()
  });
  inputDelete.addEventListener("click", handleDel);
  addedItem.addEventListener("click", handleAdd)
  
  close.forEach(el => el.addEventListener("click", handleClose));
  checkout.forEach(el => el.addEventListener("click", (event) => togglePayment(event.target)));
  getCash.forEach(el => el.addEventListener("click", (event) => handlePay(event.target)));
  finishPay.forEach(el => el.addEventListener("click", (event) => closePay(event.target)));
  qtyToggle.forEach(el => el.addEventListener("click", (event) => toggleQty(event.target)));
  togglePad.addEventListener("click", () => {
    numpadDisplay.style.display = numpadDisplay.style.display == "none" ? "grid" : "none";
    customerCash.forEach(el => el.textContent = "Rp0,00");
    resetPoin();
  });
  back.addEventListener("click", () => {
    checkoutContainer.style.display = "none";
  });
  
  // add Item event
  renderItem();
  renderData();
})

// FUNGSI Umum
function rupiahToNumber(rupiahStr) {
  return parseFloat(rupiahStr.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
}

function handleClose(event) {
  event.target.parentElement.style.display = "none";
}

function resetPoin() {
  finishPay[1].textContent = "Uang Tidak Cukup";
  changeCash.textContent = "Rp0,00";
}

function renderData() {
  const importedProducts = JSON.parse(localStorage.getItem('products')) || {};
  products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.nama;
    option.textContent = product.nama;
    optionProducts.append(option);
  });
}

function renderItem() {
  const itemToDisplay = JSON.parse(localStorage.getItem('keranjang')) || [];
  const totalJenis = itemToDisplay.items.length;
  
  itemDisplay.forEach(el => el.innerHTML = "");
  jenis.textContent = totalJenis;
  qtyItem.textContent = itemToDisplay.items.reduce((a, b) => a + b.qty, 0);
  
  if (!itemToDisplay || !itemToDisplay.items || itemToDisplay.items.length === 0) {
    itemDisplay.forEach(el => el.innerHTML = '<div class="display-item kosong">Tidak ada item</div>');
    total.forEach(el => el.textContent = `Rp0,00`);
    totalContainer.style.display = "none";
    checkout.forEach(el => el.disabled = true);
    return;
  }
  
  itemToDisplay.items.forEach(el => {
    const subtotal = (el.qty * el.harga).toLocaleString();
    
    const item = document.createElement("div");
    item.className = "display-item";
    item.innerHTML = `
    <p>${el.nama}</p>
    <div class="detail">
      <p>${el.qty}x &nbsp;<span>@Rp${el.harga.toLocaleString()},00</span></p>
      <p>Rp${subtotal},00</p>
    </div>
    `;
    itemDisplay.forEach(el => el.append(item.cloneNode(true)));
    totalContainer.style.display = "block";
  })
  calculateTotal()
  checkout.forEach(el => el.disabled = false);
}

// FUNGSI FORM

function handleButtonLog(eventTarget) {
  const username = document.getElementById("username");
  if (eventTarget.id == "username" && eventTarget.value.length >= 6 && password.value.length >= 5) return getDashboard.disabled = false;
  if (eventTarget.id == "password" && eventTarget.value.length >= 6 && username.value.length >= 5) return getDashboard.disabled = false;
  getDashboard.disabled = true;
}

function handleLogin() {
  const users = JSON.parse(localStorage.getItem('users'));
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  let findUser = users.find(e => e.username == username.value)
  if (!username.value || !password.value) return console.log("jangan ada kosong")
  if (!findUser) return console.log("bukan user")
  if (findUser.password != password.value) return console.log("password salah")
  dashboard.style.display = "grid";
  formDisplay.style.display = "none";
}

// FUNGSI CONTROL MENU
function handleNav() {
  navMenu.style.display = navMenu.style.display === "none" ? "block" : "none";
  resetPoin();
}

// FUNGSI CONTROL INPUT ITEM
function handleInput() {
  inputContainer.style.opacity = inputContainer.style.opacity === "0" ? "1" : "0";
  inputContainer.style.left = "10px"
}

function handleAdd() {
  const namaItem = addedSearch.value.trim();
  if (!namaItem) {
    console.log("Isi dulu input");
    return;
  }
  
  const itemToDisplay = JSON.parse(localStorage.getItem('keranjang'));
  const importedProducts = JSON.parse(localStorage.getItem('products'));
  
  const productDipilih = importedProducts.find(a => a.nama === namaItem);
  if (!productDipilih) return;
  
  const existItem = itemToDisplay.items.find(a => a.nama === addedSearch.value);
  
  if (existItem) {
    existItem.qty += +qtyValue.textContent;
  } else {
    let newItem = {
      nama: namaItem, 
      qty: +qtyValue.textContent, 
      harga: productDipilih.harga
    };
    itemToDisplay.items.push(newItem);
  }
  localStorage.setItem('keranjang', JSON.stringify(itemToDisplay));
  renderItem();
}

function toggleQty(eventTarget) {
  if (eventTarget.textContent == "+") return qtyValue.textContent = Number(qtyValue.textContent) + 1;
  if (qtyValue.textContent > 1) return qtyValue.textContent = Number(qtyValue.textContent) - 1;
}

// FUNGSI CONTROL PAYMENT
function togglePayment(eventTarget) {
  paymentOpsi.style.display = "flex";
  if (eventTarget.textContent === "Payment") {
    checkoutContainer.style.display = "none";
  }
  finishPay[1].textContent = "Uang Tidak Cukup";
}

function handlePay(eventTarget) {
  checkoutContainer.style.display = "block";
  if (eventTarget.textContent == "Cash") {
    paymentCash.style.display = "block";
    paymentQris.style.display = "none";
  }
  if (eventTarget.textContent == "QRIS") {
    paymentQris.style.display = "block";
    paymentCash.style.display = "none";
  }
  checkoutHeader.forEach(el => el.textContent = eventTarget.textContent);
  customerCash.forEach(el => el.textContent = "Rp0,00");
  summaryContainer.style.display = "none";
  resetPoin();
}

// FUNGSI CONTROL CHECKOUT
function appendInput(eventTarget) {
  let num = rupiahToNumber(customerCash[0].textContent);
  num += eventTarget.textContent;
  customerCash.forEach(el => el.textContent = `Rp${Number(num).toLocaleString()},00`);
  resetPoin();
  finishPay[1].click();
}

function appendQuick(eventText) {
  const arr = [10000, 20000, 50000, 100000];
  
  if (eventText == "10rb") customerCash.forEach(el => el.textContent = `Rp${arr[0].toLocaleString()},00`);
  if (eventText == "20rb") customerCash.forEach(el => el.textContent = `Rp${arr[1].toLocaleString()},00`);
  if (eventText == "50rb") customerCash.forEach(el => el.textContent = `Rp${arr[2].toLocaleString()},00`);
  if (eventText == "100rb") customerCash.forEach(el => el.textContent = `Rp${arr[3].toLocaleString()},00`);
  resetPoin();
  finishPay[1].click();
}

function handleDel() {
  let num = rupiahToNumber(customerCash[0].textContent);
  let str = String(num).slice(0, -1);
  customerCash.forEach(el => el.textContent = `Rp${Number(str).toLocaleString()},00`);
  resetPoin();
  finishPay[1].click();
}

function calculateTotal() {
  const itemToDisplay = JSON.parse(localStorage.getItem('keranjang'));
  const totalIndiv = Array.from(itemToDisplay.items.map(el => el.qty * el.harga));
  
  total.forEach(el => el.textContent = `Rp${totalIndiv.reduce((a,b) => a + b, 0).toLocaleString()},00`);
  qtyValue.textContent = 1;
  addedSearch.value = "";
}

function closePay(eventTarget) {
  const itemToDisplay = JSON.parse(localStorage.getItem('keranjang'));
  const totalIndiv = Array.from(itemToDisplay.items.map(el => el.qty * el.harga));
  let cashCount = rupiahToNumber(customerCash[0].textContent);
  let totalFromArr = totalIndiv.reduce((a, b) => a+ b, 0)
  
  if (eventTarget.textContent == "Uang Tidak Cukup" && cashCount >= totalFromArr) {
    changeCash.textContent = `Rp${(cashCount - totalFromArr).toLocaleString()},00`;
    eventTarget.textContent = "Bayar";
    return;
  }
  if (eventTarget.textContent == "Bayar") {
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    history.push({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      items: itemToDisplay.items,
      total: calculateTotal(),
      method: 'CASH',
      cash: cashCount,
      change: cashCount - totalFromArr
    });
    
    itemToDisplay.items.length = 0;
    localStorage.setItem("transactionHistory", JSON.stringify(history));
    localStorage.setItem("keranjang", JSON.stringify(itemToDisplay));
    summaryChange.textContent = changeCash.textContent;
    summaryContainer.style.display = "block";
    setTimeout(() => {
      checkoutContainer.style.display = "none";
      paymentOpsi.style.display = "none";
    }, 2000);
    renderItem();
    return;
  }
  changeCash.textContent = "Rp0,00";
}