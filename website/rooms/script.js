const SUPABASE_URL = "https://kmgwkyrdimsrvhnngdrw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZ3dreXJkaW1zcnZobm5nZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODI4OTQsImV4cCI6MjA4ODQ1ODg5NH0.pvzNz4GRQ6l7wtmz6iAXSMlz6LlUVOGGKwp19E7HQN0";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const roomForm = document.querySelector(".room-form");
const tableBody = document.querySelector("tbody");
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
        <button class="edit-btn" onclick="editRoom(${room.room_id}, '${room.room_name}', ${room.capacity}, ${room.floor}, '${room.status}')">Edit</button>
        <button class="delete-btn" onclick="deleteRoom(${room.room_id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

roomForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const inputs = roomForm.querySelectorAll("input");
  const room_name = inputs[0].value;
  const capacity = inputs[1].value;
  const floor = inputs[2].value;
  const status = inputs[3].value;

  if (editId === null) {
    const { error } = await supabaseClient
      .from("rooms")
      .insert([{ room_name, capacity, floor, status }]);

    if (error) {
      alert("Error adding room: " + error.message);
      return;
    }
  } else {
    const { error } = await supabaseClient
      .from("rooms")
      .update({ room_name, capacity, floor, status })
      .eq("room_id", editId);

    if (error) {
      alert("Error updating room: " + error.message);
      return;
    }
    editId = null;
  }

  roomForm.reset();
  loadRooms();
});

async function deleteRoom(id) {
  const { error } = await supabaseClient.from("rooms").delete().eq("room_id", id);
  if (error) {
    alert("Error deleting room: " + error.message);
    return;
  }
  loadRooms();
}

function editRoom(id, name, capacity, floor, status) {
  const inputs = roomForm.querySelectorAll("input");
  inputs[0].value = name;
  inputs[1].value = capacity;
  inputs[2].value = floor;
  inputs[3].value = status;
  editId = id;
}

loadRooms();