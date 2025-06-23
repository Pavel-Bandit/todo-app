const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = taskText;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Видалити";
  delBtn.addEventListener("click", () => li.remove());

  li.appendChild(delBtn);
  list.appendChild(li);
  input.value = "";
});
