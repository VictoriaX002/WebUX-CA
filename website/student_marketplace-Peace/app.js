const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ncamvipokbbkulqdtgfj.supabase.co",
  "sb_publishable_TxVnV9Vq_-OpB-jInluIfQ_gXZjKZSA",
);

let allProducts = [];

async function loadProducts() {
  const { data, error } = await supabaseClient.from("products").select("*");

  if (error) {
    console.error(error);
    return;
  }

  allProducts = data;
  displayProducts(allProducts);
}

function displayProducts(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description || ""}</p>
      <p>€${product.price}</p>

      <button onclick="editProduct(${product.id})">Edit</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    `;

    container.appendChild(div);
  });
}

function editProduct(id) {
  window.location.href = `edit.html?id=${id}`;
}

async function deleteProduct(id) {
  await supabaseClient.from("products").delete().eq("id", id);
  loadProducts();
}

function filterProducts() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const maxPrice = document.getElementById("maxPrice").value;

  let filtered = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchValue),
  );

  if (maxPrice) {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  displayProducts(filtered);
}

document.getElementById("search").addEventListener("input", filterProducts);
document.getElementById("maxPrice").addEventListener("input", filterProducts);

loadProducts();
