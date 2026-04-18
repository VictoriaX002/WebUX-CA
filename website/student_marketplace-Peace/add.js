const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ncamvipokbbkulqdtgfj.supabase.co",
  "sb_publishable_TxVnV9Vq_-OpB-jInluIfQ_gXZjKZSA",
);

document
  .getElementById("productForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);

    if (!title) {
      alert("Title is required");
      return;
    }

    const { error } = await supabaseClient
      .from("products")
      .insert([{ title, description, price, student_id: 1 }]);

      
    if (error) {
      console.error(error);
      alert("Error adding product");
      return;
    }

    alert("Product added!!");
    window.location.href = "index.html";
  });
