const roomForm = document.querySelector(".room-form");
const tableBody = document.querySelector("tbody");

let rooms = [];
let editIndex = -1;

function renderRooms() {
  tableBody.innerHTML = "";

  rooms.forEach((room, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${room.id}</td>
      <td>${room.name}</td>
      <td>${room.capacity}</td>
      <td>${room.floor}</td>
      <td>${room.status}</td>
      <td>
        <button class="edit-btn" onclick="editRoom(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteRoom(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

roomForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const inputs = roomForm.querySelectorAll("input");

  const room = {
    id: inputs[0].value,
    name: inputs[1].value,
    capacity: inputs[2].value,
    floor: inputs[3].value,
    status: inputs[4].value,
  };

  if (editIndex === -1) {
    rooms.push(room);
  } else {
    rooms[editIndex] = room;
    editIndex = -1;
  }

  renderRooms();
  roomForm.reset();
});

function deleteRoom(index) {
  rooms.splice(index, 1);
  renderRooms();
}

function editRoom(index) {
  const room = rooms[index];
  const inputs = roomForm.querySelectorAll("input");

  inputs[0].value = room.id;
  inputs[1].value = room.name;
  inputs[2].value = room.capacity;
  inputs[3].value = room.floor;
  inputs[4].value = room.status;

  editIndex = index;
}
