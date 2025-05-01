
const addButton = document.getElementById("add-btn"); // "Qo‘shish" button
const todoInput = document.getElementById("todo-input"); // Vazifa kiritish inputi
const todoList = document.getElementById("todo-list"); // Vazifalar ro'yxatini ko‘rsatadigan sahifa qismi

// Sahifa yuklanganda localStorage’dagi vazifalarni yuklab chiqaramiz
window.addEventListener("load", () => {
  const tasks = getTasks(); // Barcha saqlangan vazifalarni olamiz
  tasks.forEach((task) => {
    addTaskToPage(task); // Har birini sahifaga chiqaramiz
  });
});

// localStorage’dan vazifalarni olish funksiyasi
function getTasks() {
  const data = localStorage.getItem("tasks");
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : []; // faqat massiv bo‘lsa, qaytariladi
  } catch (e) {
    return []; // JSON.parse xato qilsa, bo‘sh massiv qaytariladi
  }
}

// localStorage’ga vazifalarni saqlash funksiyasi
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Massivni JSON qilib saqlaymiz
}
// Vazifani sahifaga chiqaradigan funksiya
function addTaskToPage(taskObj) {

  const { id, text, done } = taskObj; // Obyektdan id va textni ajratib olamiz


  const li = document.createElement("li"); // Har bir vazifa uchun ro'yxat elementi yaratamiz
  const span = document.createElement("span"); // Vazifaning matnini ko‘rsatish uchun
  span.textContent = text;

  const deleteButton = document.createElement("button"); // O‘chirish button
  deleteButton.className = "delele-btn"
  deleteButton.innerHTML = "<img src='./svg/trash-1.svg' alt='delete'>"

  const editButton = document.createElement("button"); // Tahrirlash button
  editButton.className = "edit-btn"
  editButton.innerHTML = "<img src='./svg/pencil-square.svg' alt='edit'>"

  const doneButton = document.createElement("button"); // Tahrirlash button
  doneButton.className = "done-btn"
  doneButton.innerHTML = "<img src='./svg/check-circle.svg' alt='done'>"

  const doneI = document.createElement("div")
  doneI.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 24 24'><!-- Icon from WeUI Icon by WeUI - undefined --> <path fill='#26ff00' fill-rule='evenodd' d='M8.657 18.435L3 12.778l1.414-1.414l4.95 4.95L20.678 5l1.414 1.414l-12.02 12.021a1 1 0 0 1-1.415 0' /> </svg>"
  doneI.className = "done-event"
  // Hamma elementlarni <li>ga joylaymiz
  li.appendChild(span);
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(doneButton);
  todoList.appendChild(li); // <li> ni sahifaga qo‘shamiz
  // O‘chirish button bosilganda:
  deleteButton.addEventListener("click", () => {
    todoList.removeChild(li); // Vazifa elementini sahifadan o‘chiramiz
    const tasks = getTasks().filter((t) => t.id !== id); // localStorage’dagi massivdan bu vazifani olib tashlaymiz
    saveTasks(tasks); // Yangilangan ro‘yxatni saqlaymiz
  });


  doneButton.addEventListener("click", () => {
    const tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index].done = !tasks[index].done; // holatni o‘zgartiramiz
      saveTasks(tasks); // saqlaymiz
    }
    if (tasks[index].done) {
      li.appendChild(doneI);
      doneI.className = "done-event";
    } else {
      const existing = li.querySelector(".done-event");
      if (existing) existing.remove();
    }
  });

  // Tahrirlash button bosilganda:
  editButton.addEventListener("click", () => {
    const input = document.createElement("input"); // Yangi input yaratamiz
    input.className = "edit-input"
    input.type = "text";
    input.value = span.textContent; // Ichiga eski matnni yozamiz
    li.replaceChild(input, span); // span o‘rniga inputni qo‘yamiz
    input.focus(); // Kursorni inputga olib boramiz

    // Tahrir tugaganda:
    input.addEventListener("blur", () => finishEdit(input));
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") finishEdit(input); // Enter bosilsa ham tahrirni yakunlaymiz
    });

    function finishEdit(input) {
      const newText = input.value.trim(); // Kiritilgan yangi matn
      if (newText === "") return; // Agar bo‘sh bo‘lsa, hech narsa qilmaymiz

      const tasks = getTasks();
      const index = tasks.findIndex((t) => t.id === id); // ID bo‘yicha massivda qidiramiz
      if (index !== -1) {
        tasks[index].text = newText; // Eski textni yangisiga almashtiramiz
        saveTasks(tasks); // Yangilangan ro‘yxatni saqlaymiz
      }

      span.textContent = newText; // Sahifadagi matnni yangilaymiz
      li.replaceChild(span, input); // input o‘rniga yana span qaytaramiz
    }
  });
  if (done) {
  doneI.className = "done-event";
  li.appendChild(doneI);
}
}

// "Qo‘shish" button bosilganda yangi vazifa qo‘shiladi
addButton.addEventListener("click", () => {
  const taskText = todoInput.value.trim(); // Inputdagi matnni olamiz
  if (taskText !== "") {
    const taskObj = { id: Date.now(), text: taskText, done: false };
    // Har bir vazifaga noyob ID beramiz
    addTaskToPage(taskObj); // Vazifani sahifaga chiqaramiz
    const tasks = getTasks(); // Oldingi vazifalarni olamiz
    tasks.push(taskObj); // Yangi vazifani qo‘shamiz
    saveTasks(tasks); // Saqlaymiz
    todoInput.value = ""; // Inputni bo‘shatamiz
  }
});

// Enter bosilganda ham vazifa qo‘shiladi (qulaylik uchun)
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addButton.click(); // Button ni avtomatik bosamiz
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const delAll = document.querySelector(".delAll");

  delAll.addEventListener("click", () => {
    todoList.innerHTML = "";
    localStorage.clear();
  });
});
