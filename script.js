const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

let tasks = [];
let currentFilter = "all"; // "all", "completed", "active"

// 🚀 Завантажити збережені завдання
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    list.innerHTML = ""; // Очистити DOM перед рендерингом
    const filtersContainer = document.createElement("div");
    filtersContainer.innerHTML = `
      <button data-filter="all">Усі</button>
      <button data-filter="active">Активні</button>
      <button data-filter="completed">Виконані</button>
    `;
    document.body.insertBefore(filtersContainer, list);

    filtersContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        currentFilter = e.target.dataset.filter;
        renderAllTasks();
      }
    });

    renderAllTasks();
  }
});

// 🧱 Функції для створення елементів
const createCheckbox = (task, li) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.style.textDecoration = task.done ? "line-through" : "none";
    renderAllTasks();
  });
  return checkbox;
};

const createTextSpan = (text, done) => {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
};

const createDeleteButton = (li, task) => {
  const delBtn = document.createElement("button");
  delBtn.textContent = "Видалити";
  delBtn.addEventListener("click", () => {
    list.removeChild(li);
    tasks = tasks.filter((t) => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
  });
  return delBtn;
};

// 🧱 Функція для відображення одного завдання
function renderTask(task) {
  const { text, done } = task;
  const li = document.createElement("li");

  const checkbox = createCheckbox(task, li);
  const span = createTextSpan(text, done);
  const delBtn = createDeleteButton(li, task);

  if (done) {
    li.style.textDecoration = "line-through";
  }

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}

function renderAllTasks() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    if (
      currentFilter === "all" ||
      (currentFilter === "completed" && task.done) ||
      (currentFilter === "active" && !task.done)
    ) {
      renderTask(task);
    }
  });
}

// ➕ Додавання нового завдання
button.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const newTask = { text: taskText, done: false };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderAllTasks();
  input.value = "";
});
