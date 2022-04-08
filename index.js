// DOM elements
const clientsForm = document.getElementById('ajouter-client');
const productsForm = document.getElementById('ajouter-produit');
const clientsList = document.getElementById('clients-list');
const clientsElements = document.getElementsByClassName('client-item');
const productsList = document.getElementById('produits');

// Global variables
let clients = [];
let products = [];
let client_id;

// Events
// Add a client
clientsForm.onsubmit = e => {
  e.preventDefault();
  const form = e.target;
  const nom = form.elements['nom'].value;

  const client = {
    id: Math.floor(Math.random() * 100 + 1),
    nom,
  };

  // Store in browser local storage
  clients.push(client);
  localStorage.setItem('clients', JSON.stringify(clients));

  // Clear the form , set the current client and show the client in the DOM
  form.reset();
  client_id = client.id;
  showClient(client);
};

// Add a product
productsForm.onsubmit = e => {
  e.preventDefault();
  const form = e.target;
  const nom = form.elements['nom'].value;
  const quantite = form.elements['quantite'].value;
  const prix = form.elements['prix'].value;

  const product = {
    id: Math.floor(Math.random() * 100 + 1),
    client_id,
    nom,
    quantite,
    prix,
  };

  // Store in browser local storage
  products.push(product);
  storeProducts();

  // Clear the form and show the client in the DOM
  form.reset();
  showProduct(product);
};

// Initialisation
// Get data from localstorage and show them all
clients = JSON.parse(localStorage.getItem('clients')) || [];
products = JSON.parse(localStorage.getItem('products')) || [];
client_id = clients[0]?.id;
showAllClients();
showAllProducts(client_id);

// Utils
function showClient(client) {
  const prenomLettre = client.nom.split(' ')[0].charAt(0).toUpperCase();
  const nomLettre = client.nom.split(' ')[1]?.charAt(0).toUpperCase() || '';

  if (clients.length == 1) clientsList.innerHTML = '';
  clientsList.innerHTML += `
        <li class="client-item" onclick="selectClient(this, ${client.id})">
            <p class="client-avatar">${prenomLettre}${nomLettre}</p>
            <p class="client-nom">${client.nom}</p>
        </li>
        `;
}

function selectClient(element, clientId) {
  client_id = clientId;

  element.classList.add('active');
  for (elem of clientsElements) {
    if (element != elem) elem.classList.remove('active');
  }
  showAllProducts(clientId);
}

function showAllClients() {
  // If there are no clients show a message instead
  if (!clients.length) clientsList.innerHTML = '<li><p class="no-clients">No clients</p></li>';
  else {
    // Clear the 'No clients' message and insert clients
    clientsList.innerHTML = '';
    for (const client of clients) showClient(client);
  }
}

function showProduct(product) {
  productsList.innerHTML += `
    <li class="produit">
        <h3>${product.nom}</h3>
        <h3>${product.quantite}</h3>
        <h3>${product.prix}</h3>
        <h3>${new Date().toLocaleDateString('fr-FR')}</h3>
        <h3><i onclick="deleteProduct(${product.id})" class="fa fa-trash"></i></h3>
    </li>`;
}

function storeProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function showAllProducts(clientID) {
  productsList.innerHTML = '';
  for (const product of products) if (product.client_id == clientID) showProduct(product);
}

function deleteProduct(id) {
  products = products.filter(prod => prod.id != id);
  storeProducts();
  showAllProducts(client_id);
}
