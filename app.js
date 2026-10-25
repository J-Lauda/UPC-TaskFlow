    const STORAGE_KEY = "upc-taskflow-tasks";
    const taskForm = document.querySelector("#task-form");
    const taskList = document.querySelector("#task-list");
    const taskCount = document.querySelector("#task-count");
    const storageMessage = document.querySelector("#storage-message");
    const formTitle = document.querySelector("#form-title");
    const formDescription = document.querySelector("#form-description");
    const submitLabel = document.querySelector("#submit-label");
    const cancelEditButton = document.querySelector("#cancel-edit");
    const filterButtons = document.querySelectorAll("[data-filter]");
    let currentFilter = "all";
    let editingTaskId = null;
    let tasks = loadTasks();

    renderTasks();

    taskForm.addEventListener("submit", handleTaskSubmit);
    taskList.addEventListener("click", handleTaskAction);
    cancelEditButton.addEventListener("click", cancelTaskEdit);
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        renderTasks();
      });
    });

    function loadTasks() {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks === null) {
          return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
          throw new Error("El contenido guardado no es una lista de tareas.");
        }

        return parsedTasks.map((task) => ({
          ...task,
          completed: task.completed === true
        }));
      } catch (error) {
        console.error("No se pudieron recuperar las tareas guardadas:", error);
        showStorageMessage("No se pudieron leer las tareas guardadas. Puedes agregar nuevas tareas.");
        return [];
      }
    }

    function handleTaskSubmit(event) {
      event.preventDefault();

      if (!taskForm.reportValidity()) {
        return;
      }

      const formData = new FormData(taskForm);
      const title = formData.get("title").trim();
      const course = formData.get("course").trim();
      const dueDate = formData.get("dueDate");
      const priority = formData.get("priority");

      if (!title || !course || !dueDate || !priority) {
        showStorageMessage("Completa todos los campos obligatorios antes de guardar.");
        return;
      }

      if (editingTaskId !== null) {
        tasks = tasks.map((task) => task.id === editingTaskId
          ? { ...task, title, course, dueDate, priority }
          : task);
        cancelTaskEdit();
      } else {
        tasks.push({
          id: createTaskId(),
          title,
          course,
          dueDate,
          priority,
          completed: false
        });
        taskForm.reset();
      }

      renderTasks();
      saveTasks();
      document.querySelector("#task-title").focus();
    }

    function createTaskId() {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }

      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function renderTasks() {
      taskList.replaceChildren();
      updateTaskCounts();
      updateFilterButtons();

      const visibleTasks = getVisibleTasks();

      if (visibleTasks.length === 0) {
        taskList.append(createEmptyState(tasks.length > 0));
        return;
      }

      visibleTasks.forEach((task) => {
        taskList.append(createTaskCard(task));
      });
    }

    function getVisibleTasks() {
      if (currentFilter === "pending") {
        return tasks.filter((task) => !task.completed);
      }

      if (currentFilter === "completed") {
        return tasks.filter((task) => task.completed);
      }

      return tasks;
    }

    function updateFilterButtons() {
      filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter));
      });
    }

    function createEmptyState(hasTasks) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      const icon = document.createElement("div");
      icon.className = "empty-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "✦";

      const title = document.createElement("h4");
      title.textContent = hasTasks ? "No hay tareas en este filtro" : "Tu lista está lista para empezar";

      const description = document.createElement("p");
      description.textContent = hasTasks
        ? "Prueba otro filtro para ver tus tareas."
        : "Agrega una tarea con su curso y fecha de entrega. Aquí aparecerá toda tu organización académica.";

      emptyState.append(icon, title, description);
      return emptyState;
    }

    function createTaskCard(task) {
      const card = document.createElement("article");
      card.className = task.completed ? "task-card is-completed" : "task-card";

      const summary = document.createElement("div");
      const title = document.createElement("h4");
      title.className = "task-title";
      title.textContent = task.title;

      const course = document.createElement("p");
      course.className = "task-course";
      course.textContent = task.course;
      summary.append(title, course);

      const details = document.createElement("div");
      details.className = "task-details";

      const date = document.createElement("time");
      date.className = "task-date";
      date.dateTime = task.dueDate;
      date.textContent = `Entrega: ${formatDate(task.dueDate)}`;

      const priority = document.createElement("span");
      priority.className = `priority priority-${task.priority}`;
      priority.textContent = `Prioridad ${task.priority}`;

      const status = document.createElement("span");
      status.className = "task-status";
      status.textContent = task.completed ? "Completada" : "Pendiente";

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const completionButton = createTaskActionButton(
        task.completed ? "Marcar como pendiente" : "Marcar como completada",
        task.completed ? "pending" : "complete",
        task
      );
      const editButton = createTaskActionButton("Editar", "edit", task);
      const deleteButton = createTaskActionButton("Eliminar", "delete", task);
      deleteButton.classList.add("delete-action");
      actions.append(completionButton, editButton, deleteButton);

      details.append(date, priority, status);
      card.append(summary, details, actions);
      return card;
    }

    function createTaskActionButton(label, action, task) {
      const button = document.createElement("button");
      button.className = "task-action";
      button.type = "button";
      button.dataset.action = action;
      button.dataset.taskId = task.id;
      button.textContent = label;
      button.setAttribute("aria-label", `${label}: ${task.title}`);
      return button;
    }

    function handleTaskAction(event) {
      const button = event.target.closest("button[data-action]");

      if (!button || !taskList.contains(button)) {
        return;
      }

      const task = tasks.find((item) => item.id === button.dataset.taskId);

      if (!task) {
        return;
      }

      if (button.dataset.action === "edit") {
        startTaskEdit(task);
        return;
      }

      if (button.dataset.action === "delete") {
        if (!window.confirm(`¿Seguro que quieres eliminar la tarea "${task.title}"?`)) {
          return;
        }

        tasks = tasks.filter((item) => item.id !== task.id);
        if (editingTaskId === task.id) {
          cancelTaskEdit();
        }
      } else if (button.dataset.action === "complete" || button.dataset.action === "pending") {
        task.completed = button.dataset.action === "complete";
      } else {
        return;
      }

      renderTasks();
      saveTasks();
    }

    function startTaskEdit(task) {
      editingTaskId = task.id;
      taskForm.elements.title.value = task.title;
      taskForm.elements.course.value = task.course;
      taskForm.elements.dueDate.value = task.dueDate;
      taskForm.elements.priority.value = task.priority;
      formTitle.textContent = "Editar tarea";
      formDescription.textContent = "Actualiza los datos de esta tarea.";
      submitLabel.textContent = "Guardar cambios";
      cancelEditButton.hidden = false;
      document.querySelector("#task-title").focus();
    }

    function cancelTaskEdit() {
      editingTaskId = null;
      taskForm.reset();
      formTitle.textContent = "Nueva tarea";
      formDescription.textContent = "Completa los datos para agregarla a tu lista.";
      submitLabel.textContent = "Agregar tarea";
      cancelEditButton.hidden = true;
    }

    function formatDate(dateValue) {
      const [year, month, day] = dateValue.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function updateTaskCounts() {
      const completed = tasks.filter((task) => task.completed).length;
      const pending = tasks.length - completed;
      taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "tarea" : "tareas"}`;
      document.querySelector("#total-count").textContent = tasks.length;
      document.querySelector("#pending-count").textContent = pending;
      document.querySelector("#completed-count").textContent = completed;
    }

    function saveTasks() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        showStorageMessage("");
      } catch (error) {
        console.error("No se pudieron guardar las tareas:", error);
        showStorageMessage("No se pudieron guardar los cambios en este navegador.");
      }
    }

    function showStorageMessage(message) {
      storageMessage.textContent = message;
    }
