const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

let tasks = [];

// 🚀 Завантажити збережені завдання
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(renderTask);
  }
});

// 🧱 Функція для відображення одного завдання
function renderTask(taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Видалити";
  delBtn.addEventListener("click", () => {
    list.removeChild(li);
    tasks = tasks.filter((t) => t !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  li.appendChild(delBtn);
  list.appendChild(li);
}

// ➕ Додавання нового завдання
button.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTask(taskText);
  input.value = "";
});
