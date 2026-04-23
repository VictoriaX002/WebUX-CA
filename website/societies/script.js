const SUPABASE_URL = "https://wjhxefkzaclqbbbmmakt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHhlZmt6YWNscWJiYm1tYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTEyMzksImV4cCI6MjA5MjMyNzIzOX0.xDtw91Oa4QiMhsWPxWWdCwgP94f37SVJMOoOUDqo3Hc";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const societyList = document.getElementById("societyList");
const societySelect = document.getElementById("societySelect");
const memberFilter = document.getElementById("memberFilter");
const membersTableContainer = document.getElementById("membersTableContainer");
const joinForm = document.getElementById("joinForm");
const formMessage = document.getElementById("formMessage");

let societies = [];
let members = [];

function getSocietyIcon(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("gaming")) return "fa-solid fa-gamepad";
  if (lowerName.includes("tech")) return "fa-solid fa-laptop-code";
  if (lowerName.includes("sports")) return "fa-solid fa-futbol";
  if (lowerName.includes("art")) return "fa-solid fa-palette";
  if (lowerName.includes("music")) return "fa-solid fa-music";
  if (lowerName.includes("islamic")) return "fa-solid fa-mosque";

  return "fa-solid fa-users";
}

function getCategoryClass(category) {
  const value = (category || "").toLowerCase();

  if (value.includes("entertainment")) return "tag-entertainment";
  if (value.includes("academic")) return "tag-academic";
  if (value.includes("fitness")) return "tag-fitness";
  if (value.includes("creative")) return "tag-creative";
  if (value.includes("cultural")) return "tag-cultural";

  return "tag-default";
}

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `message ${type}`;
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.className = "message";
}

function getSocietyName(id) {
  const society = societies.find((s) => s.society_id === id);
  return society ? society.society_name : "Unknown";
}

async function fetchSocieties() {
  const { data, error } = await supabaseClient
    .from("societies")
    .select("*")
    .order("society_id", { ascending: true });

  if (error) {
    console.error("Error fetching societies:", error);
    showMessage("Could not load societies.", "error");
    return;
  }

  societies = data || [];
  renderSocieties();
  populateDropdowns();
}

async function fetchMembers() {
  const { data, error } = await supabaseClient
    .from("society_members")
    .select("*")
    .order("membership_id", { ascending: false });

  if (error) {
    console.error("Error fetching members:", error);
    membersTableContainer.innerHTML = `<div class="empty-state">Could not load members.</div>`;
    return;
  }

  members = data || [];
  renderMembers();
}

function populateDropdowns() {
  societySelect.innerHTML = `<option value="">Select a society</option>`;
  memberFilter.innerHTML = `<option value="all">All Societies</option>`;

  societies.forEach((society) => {
    const option1 = document.createElement("option");
    option1.value = society.society_id;
    option1.textContent = society.society_name;
    societySelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = society.society_id;
    option2.textContent = society.society_name;
    memberFilter.appendChild(option2);
  });
}

function renderSocieties() {
  societyList.innerHTML = "";

  if (societies.length === 0) {
    societyList.innerHTML = `<div class="empty-state">No societies available.</div>`;
    return;
  }

  societies.forEach((society) => {
    const count = members.filter(
      (member) => member.society_id === society.society_id
    ).length;

    const iconClass = getSocietyIcon(society.society_name);
    const categoryClass = getCategoryClass(society.category);

    const div = document.createElement("div");
    div.className = "society-item";
    div.innerHTML = `
      <div class="society-top">
        <div class="society-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="society-main">
          <h3 class="society-name">${society.society_name}</h3>
          <span class="category-tag ${categoryClass}">
            ${society.category || "General"}
          </span>
        </div>
      </div>

      <div class="society-info">
        <p><strong>Description:</strong> ${society.description || "N/A"}</p>
        <p><strong>Meeting Day:</strong> ${society.meeting_day || "N/A"}</p>
        <p><strong>Email:</strong> ${society.contact_email || "N/A"}</p>
        <p><strong>Members:</strong> ${count}</p>
      </div>
    `;
    societyList.appendChild(div);
  });
}

function renderMembers() {
  const filterValue = memberFilter.value;
  let filteredMembers = members;

  if (filterValue !== "all") {
    filteredMembers = members.filter(
      (member) => String(member.society_id) === filterValue
    );
  }

  if (filteredMembers.length === 0) {
    membersTableContainer.innerHTML = `
      <div class="empty-state">No members have joined this society yet.</div>
    `;
    renderSocieties();
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Society</th>
          <th>Join Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  filteredMembers.forEach((member) => {
    tableHTML += `
      <tr>
        <td>${member.student_id}</td>
        <td>${member.student_name}</td>
        <td>${getSocietyName(member.society_id)}</td>
        <td>${member.join_date || ""}</td>
        <td>
          <button class="leave-btn" onclick="removeMember(${member.membership_id})">Leave</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  membersTableContainer.innerHTML = tableHTML;
  renderSocieties();
}

joinForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  clearMessage();

  const studentId = document.getElementById("studentId").value.trim();
  const studentName = document.getElementById("studentName").value.trim();
  const societyId = parseInt(document.getElementById("societySelect").value);

  if (!studentId || !studentName || !societyId) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  const { data: existingMember, error: checkError } = await supabaseClient
    .from("society_members")
    .select("*")
    .eq("student_id", studentId)
    .eq("society_id", societyId);

  if (checkError) {
    console.error("Membership check error:", checkError);
    showMessage("Could not check membership.", "error");
    return;
  }

  if (existingMember.length > 0) {
    showMessage("You have already joined this society.", "error");
    return;
  }

  const { error } = await supabaseClient
    .from("society_members")
    .insert([
      {
        student_id: studentId,
        student_name: studentName,
        society_id: societyId
      }
    ]);

  if (error) {
    console.error("Insert error:", error);
    showMessage("Failed: " + error.message, "error");
    return;
  }

  joinForm.reset();
  showMessage("You joined the society successfully.", "success");
  await fetchMembers();
});

async function removeMember(membershipId) {
  const { error } = await supabaseClient
    .from("society_members")
    .delete()
    .eq("membership_id", membershipId);

  if (error) {
    console.error("Delete error:", error);
    alert("Failed to leave society.");
    return;
  }

  await fetchMembers();
  showMessage("You left the society successfully.", "success");
}

memberFilter.addEventListener("change", renderMembers);

async function initPage() {
  await fetchSocieties();
  await fetchMembers();
}

initPage();