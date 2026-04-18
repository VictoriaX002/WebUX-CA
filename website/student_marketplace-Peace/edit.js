const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ncamvipokbbkulqdtgfj.supabase.co",
  "sb_publishable_TxVnV9Vq_-OpB-jInluIfQ_gXZjKZSA",
);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Product not found");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("title").value = data.title;
  document.getElementById("description").value = data.description;
  document.getElementById("price").value = data.price;
}

loadProduct();

document
  .getElementById("editForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);

    await supabaseClient
      .from("products")
      .update({ title, description, price })
      .eq("id", id);

    alert("Updated!");
    window.location.href = "index.html";
  });
