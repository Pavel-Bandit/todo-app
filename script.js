window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("taskDeadline");
  const button = document.getElementById("addTaskBtn");
  const list = document.getElementById("taskList");

  let tasks = [];
  let currentFilter = "all"; // "all", "completed", "active"

  // 🚀 Завантажити збережені завдання
  const filtersContainer = document.createElement("div");
  filtersContainer.innerHTML = `
    <button data-filter="all">Усі</button>
    <button data-filter="active">Активні</button>
    <button data-filter="completed">Виконані</button>
  `;
  list.parentNode.insertBefore(filtersContainer, list);

  const savedTheme = localStorage.getItem("theme") || "dark-theme";
  document.body.classList.add(savedTheme);

  document.getElementById("toggleThemeBtn").addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark-theme");
    }
  });

  filtersContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // Знімаємо клас з усіх кнопок і додаємо до натиснутої
      const buttons = filtersContainer.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.remove("active-filter"));
      e.target.classList.add("active-filter");
      currentFilter = e.target.dataset.filter;
      renderAllTasks();
    }
  });

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

  const createTextSpan = (text, done, task) => {
    const span = document.createElement("span");
    span.textContent = text;

    span.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;

      input.addEventListener("blur", () => {
        task.text = input.value.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderAllTasks();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input.blur();
        }
      });

      span.replaceWith(input);
      input.focus();
    });

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
    const span = createTextSpan(text, done, task);
    const delBtn = createDeleteButton(li, task);

    if (done) {
      li.style.textDecoration = "line-through";
    }

    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const now = new Date();
      if (!task.done && deadlineDate < now) {
        li.style.color = "red";
      }

      const deadlineSpan = document.createElement("span");
      deadlineSpan.textContent = ` (до ${task.deadline})`;
      li.appendChild(deadlineSpan);
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

  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    renderAllTasks();
  }

  // ➕ Додавання нового завдання
  button.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText === "") return;

    const deadline = deadlineInput.value;
    const newTask = { text: taskText, done: false, deadline };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderAllTasks();
    input.value = "";
  });
});
