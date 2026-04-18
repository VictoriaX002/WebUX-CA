const SUPABASE_URL = "https://kmgwkyrdimsrvhnngdrw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZ3dreXJkaW1zcnZobm5nZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODI4OTQsImV4cCI6MjA4ODQ1ODg5NH0.pvzNz4GRQ6l7wtmz6iAXSMlz6LlUVOGGKwp19E7HQN0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

const roomForm = document.querySelector(".room-form");
const tableBody = document.querySelector("tbody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelEdit");
const formTitle = document.getElementById("form-title");

const roomNameInput = document.getElementById("roomName");
const capacityInput = document.getElementById("capacity");
const floorInput = document.getElementById("floor");
const statusInput = document.getElementById("status");

let editId = null;

async function loadRooms() {
  tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  const { data, error } = await supabaseClient
    .from("rooms")
    .select("*")
    .order("room_id", { ascending: true });

  if (error) {
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading rooms</td></tr>";
    return;
  }

  if (!data || data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>No rooms found</td></tr>";
    return;
  }

  tableBody.innerHTML = "";

  data.forEach((room) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${room.room_id}</td>
      <td>${room.room_name}</td>
      <td>${room.capacity}</td>
      <td>${room.floor}</td>
      <td>${room.status}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    const editButton = row.querySelector(".edit-btn");
    const deleteButton = row.querySelector(".delete-btn");

    editButton.addEventListener("click", () => {
      roomNameInput.value = room.room_name;
      capacityInput.value = room.capacity;
      floorInput.value = room.floor;
      statusInput.value = room.status;

      editId = room.room_id;
      formTitle.textContent = "Edit Room";
      submitBtn.textContent = "Update Room";
      cancelBtn.style.display = "inline-block";
      roomNameInput.focus();
    });

    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm(
        `Are you sure you want to delete "${room.room_name}"?`,
      );

      if (!confirmed) return;

      const { error: deleteError } = await supabaseClient
        .from("rooms")
        .delete()
        .eq("room_id", room.room_id);

      if (deleteError) {
        alert("Error deleting room: " + deleteError.message);
        return;
      }

      if (editId === room.room_id) {
        resetForm();
      }

      loadRooms();
    });

    tableBody.appendChild(row);
  });
}

function resetForm() {
  roomForm.reset();
  editId = null;
  formTitle.textContent = "Add New Room";
  submitBtn.textContent = "Add Room";
  cancelBtn.style.display = "none";
}

roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const room_name = roomNameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);
  const floor = parseInt(floorInput.value, 10);
  const status = statusInput.value;

  if (!room_name) {
    alert("Room name is required.");
    return;
  }

  if (Number.isNaN(capacity) || capacity < 1) {
    alert("Capacity must be at least 1.");
    return;
  }

  if (Number.isNaN(floor) || floor < 0) {
    alert("Floor must be 0 or higher.");
    return;
  }

  if (!status) {
    alert("Please select a room status.");
    return;
  }

  if (editId === null) {
    const { error } = await supabaseClient
      .from("rooms")
      .insert([{ room_name, capacity, floor, status }]);

    if (error) {
      alert("Error adding room: " + error.message);
      return;
    }

    alert("Room added successfully.");
  } else {
    const { error } = await supabaseClient
      .from("rooms")
      .update({ room_name, capacity, floor, status })
      .eq("room_id", editId);

    if (error) {
      alert("Error updating room: " + error.message);
      return;
    }

    alert("Room updated successfully.");
  }

  resetForm();
  loadRooms();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
});

loadRooms();
