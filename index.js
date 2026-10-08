const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const itemsLeftCount = document.querySelector("#items-count");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clear-completed");
const themeToggleBtn = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const htmlElement = document.documentElement;

let todos = [];
let currentFilter = "all";

function updateThemeIcon() {
    const isLightMode = htmlElement.classList.contains("light");
    if (themeIcon) {
        themeIcon.src = isLightMode ? "images/icon-sun.svg" : "images/icon-moon.svg";
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        if (htmlElement.classList.contains("dark")) {
            htmlElement.classList.remove("dark");
            htmlElement.classList.add("light");
        } else {
            htmlElement.classList.remove("light");
            htmlElement.classList.add("dark");
        }
        updateThemeIcon();
    });
}

todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && todoInput.value.trim() !== "") {
        const taskText = todoInput.value.trim();
        
        todos.push({
            id: Date.now(),
            text: taskText,
            completed: false
        });

        todoInput.value = "";
        renderTodos();
    }
});

function renderTodos() {
    todoList.innerHTML = "";

    let filteredTodos = todos;
    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;
        li.setAttribute("draggable", "true");
        li.dataset.id = todo.id;

        li.innerHTML = `
            <label class="todo-checkbox-label">
                <input type="checkbox" ${todo.completed ? "checked" : ""}>
                <span class="checkmark">
                    <img src="images/icon-check.svg" alt="Check">
                </span>
                <span class="todo-text">${todo.text}</span>
            </label>
            <button class="delete-btn">
                <img src="images/icon-cross.svg" alt="Delete">
            </button>
        `;
        todoList.appendChild(li);
    });

    updateItemsCount();
}

todoList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.closest(".delete-btn")) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }
});

todoList.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
        const li = e.target.closest("li");
        if (!li) return;
        const id = Number(li.dataset.id);
        
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        renderTodos();
    }
});

function updateItemsCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    if (itemsLeftCount) {
        itemsLeftCount.textContent = `${activeCount} items left`;
    }
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.getAttribute("data-filter");
        renderTodos();
    });
});

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    });
}

renderTodos();
updateThemeIcon();