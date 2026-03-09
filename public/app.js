const API_BASE = "/api/todos";

const listEl = document.getElementById("todo-list");
const countEl = document.getElementById("todo-count");
const formEl = document.getElementById("todo-form");
const inputEl = document.getElementById("todo-input");
const errorEl = document.getElementById("error-message");
const clearCompletedEl = document.getElementById("clear-completed");
const filterButtons = Array.from(document.querySelectorAll(".chip"));

let todos = [];
let currentFilter = "all";

function formatCount() {
  const activeCount = todos.filter((t) => !t.completed).length;
  const total = todos.length;
  if (!total) return "No tasks";
  return `${activeCount} of ${total} remaining`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function showError(message) {
  if (!message) {
    errorEl.hidden = true;
    errorEl.textContent = "";
    return;
  }
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function applyFilter(items) {
  if (currentFilter === "active") {
    return items.filter((t) => !t.completed);
  }
  if (currentFilter === "completed") {
    return items.filter((t) => t.completed);
  }
  return items;
}

function render() {
  listEl.innerHTML = "";
  const filtered = applyFilter(todos);
  if (!filtered.length) {
    const empty = document.createElement("li");
    empty.className = "todo-item";
    empty.innerHTML = '<span class="todo-meta">No tasks yet. Add your first todo above.</span>';
    listEl.appendChild(empty);
  } else {
    for (const todo of filtered) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");
      li.dataset.id = String(todo.id);

      const checkbox = document.createElement("button");
      checkbox.className = "checkbox" + (todo.completed ? " checkbox-checked" : "");
      checkbox.setAttribute("aria-label", todo.completed ? "Mark as incomplete" : "Mark as complete");
      checkbox.innerHTML = "<span>✔</span>";

      const main = document.createElement("div");
      main.className = "todo-main";

      const title = document.createElement("div");
      title.className = "todo-title";
      title.textContent = todo.title;

      const meta = document.createElement("div");
      meta.className = "todo-meta";
      meta.textContent = `Created ${formatDate(todo.createdAt)}`;

      main.appendChild(title);
      main.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "todo-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn edit";
      editBtn.setAttribute("aria-label", "Edit task");
      editBtn.innerHTML = "✎";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-btn delete";
      deleteBtn.setAttribute("aria-label", "Delete task");
      deleteBtn.innerHTML = "✕";

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(main);
      li.appendChild(actions);

      listEl.appendChild(li);
    }
  }
  countEl.textContent = formatCount();
}

async function apiRequest(path, options) {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });
  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = await res.json();
      if (data && data.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
}

async function loadTodos() {
  try {
    showError("");
    todos = await apiRequest(API_BASE);
    render();
  } catch (err) {
    console.error(err);
    showError(err.message || "Failed to load tasks");
  }
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) {
    showError("Please enter a task before adding.");
    return;
  }
  try {
    showError("");
    const created = await apiRequest(API_BASE, {
      method: "POST",
      body: JSON.stringify({ title })
    });
    todos.push(created);
    inputEl.value = "";
    render();
  } catch (err) {
    console.error(err);
    showError(err.message || "Failed to add task");
  }
});

listEl.addEventListener("click", async (e) => {
  const target = e.target;
  const li = target.closest(".todo-item");
  if (!li) return;
  const id = Number(li.dataset.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  if (target.closest(".checkbox")) {
    try {
      const updated = await apiRequest(`${API_BASE}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !todo.completed })
      });
      const idx = todos.findIndex((t) => t.id === id);
      todos[idx] = updated;
      render();
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to update task");
    }
    return;
  }

  if (target.closest(".edit")) {
    const newTitle = prompt("Edit task", todo.title);
    if (newTitle === null) return;
    const trimmed = newTitle.trim();
    if (!trimmed) {
      showError("Task title cannot be empty.");
      return;
    }
    try {
      const updated = await apiRequest(`${API_BASE}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: trimmed })
      });
      const idx = todos.findIndex((t) => t.id === id);
      todos[idx] = updated;
      render();
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to edit task");
    }
    return;
  }

  if (target.closest(".delete")) {
    const confirmDelete = confirm("Delete this task?");
    if (!confirmDelete) return;
    try {
      await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" });
      todos = todos.filter((t) => t.id !== id);
      render();
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to delete task");
    }
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("chip-active", b === btn));
    render();
  });
});

clearCompletedEl.addEventListener("click", async () => {
  const completed = todos.filter((t) => t.completed);
  if (!completed.length) return;
  const confirmClear = confirm(`Clear ${completed.length} completed task(s)?`);
  if (!confirmClear) return;

  try {
    const toDelete = [...completed];
    for (const t of toDelete) {
      await apiRequest(`${API_BASE}/${t.id}`, { method: "DELETE" });
    }
    todos = todos.filter((t) => !t.completed);
    render();
  } catch (err) {
    console.error(err);
    showError(err.message || "Failed to clear completed tasks");
  }
});

loadTodos();

