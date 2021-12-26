"use strict";

document.addEventListener("DOMContentLoaded", (e) => {
  const toDoContainer = document.querySelector(".to-do-container");
  const toDoForm = document.forms["form-control"];
  const filterContainer = document.querySelector(".filter-container");
  const toDoList = document.querySelector(".tasks-list");
  const messageContainer = document.querySelector(".message-container");
  const warningText = "Write down your thoughts!";
  const pageHeight = document.documentElement.clientHeight;
  const iconArr = ["./img/trash.svg"];
  const toDoArr = JSON.parse(localStorage.getItem("toDoArr")) ?? [];

  initApp();

  toDoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = toDoForm.elements["task"].value;
    e.target.reset();
    if (doValidating(inputValue)) {
      let id = null;
      if (toDoArr.length === 0) {
        id = 0;
      } else {
        id = toDoArr.at(-1).id + 1;
      }

      let taskObj = {
        task: inputValue,
        id,
        done: false,
      };
      addToArray(taskObj);
      renderDoList(toDoArr);
    }
  });

  toDoList.addEventListener("change", function (e) {
    let target = e.target;
    let status = target.checked;
    let index = target.dataset.index;
    let arrayElementIndex = findArrayElementIndex(index);
    if (status === true) {
      changeArrayValue(arrayElementIndex, true);
    } else {
      changeArrayValue(arrayElementIndex, false);
    }
    renderDoList(toDoArr);
  });

  toDoList.addEventListener("click", function (e) {
    let { target } = e;
    let deleteBtn = target.closest(".delete-btn");
    if (deleteBtn) {
      let index = deleteBtn.dataset.index;
      deleteArrValue(index);
      renderDoList(toDoArr);
    }
  });

  filterContainer.addEventListener("change", function (e) {
    const radioBtnArr = Array.from(
      filterContainer.querySelectorAll(".custom-radio")
    );
    let target = e.target;
    hideUnchecked(radioBtnArr, target);
    renderDoList(toDoArr);
  });

  function doValidating(value) {
    let status = true;
    if (value.trim() === "") {
      status = false;
      showMessage(warningText);
    }
    return status;
  }

  function showMessage(message) {
    messageContainer.firstElementChild.textContent = message;
    messageContainer.classList.add("show");
    setTimeout(() => {
      messageContainer.classList.remove("show");
    }, 3000);
  }

  function pushToLocalStorage(arr) {
    localStorage.setItem("toDoArr", JSON.stringify(arr));
  }

  function addToArray(elem) {
    toDoArr.push(elem);
    pushToLocalStorage(toDoArr);
  }

  function changeArrayValue(id, value) {
    toDoArr[id].done = value;
    pushToLocalStorage(toDoArr);
  }

  function deleteArrValue(index) {
    let arrayElementIndex = findArrayElementIndex(index);
    toDoArr.splice(arrayElementIndex, 1);
    pushToLocalStorage(toDoArr);
  }

  function findArrayElementIndex(index) {
    let arrayElementIndex = toDoArr.findIndex((element) => {
      if (element.id === Number(index)) {
        return true;
      }
    });

    return arrayElementIndex;
  }

  function renderDoList(arr) {
    let arrayForRendering = prepareArrayForRendering(arr);
    makeFragmentMarkup(arrayForRendering)
    scrollCheck();
  }

  function prepareArrayForRendering(array) {
    let radioArray = Array.from(document.querySelectorAll(".custom-radio"));
    let arrayForRendering = [];
    let activatedRadioBtn = radioArray.find((element) => {
      if (element.checked) {
        return true;
      }
    }).value;

    if (activatedRadioBtn === "all") {
      arrayForRendering = [...array];
    } else if (activatedRadioBtn === "done") {
      arrayForRendering = array.filter((element) => {
        return element.done === true;
      });
    } else if (activatedRadioBtn === "needToDo") {
      arrayForRendering = array.filter((element) => {
        return element.done === false;
      });
    }

    return arrayForRendering;
  }

  function initApp() {
    renderDoList(toDoArr);
  }

  function hideUnchecked(arr, currentInput) {
    arr.forEach((element) => {
      element.checked = false;
    });
    currentInput.checked = true;
  }

  function scrollCheck() {
    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    if (pageHeight < scrollHeight) {
      document.documentElement.style.paddingRight = "0";
      messageContainer.style.left = "50%";
    } else {
      document.documentElement.style.paddingRight = "24px";
      messageContainer.style.left = "calc(50% - 12px)";
    }
  }

  function makeFragmentMarkup(arrayForRenderingMarkup){
    toDoList.innerHTML = "";
    const fragment = document.createDocumentFragment();
    arrayForRenderingMarkup.forEach((element) => {
      const numList = element.id;
      const doTask = document.createElement("li");
      const checkElement = document.createElement("input");
      const taskLabel = document.createElement("label");
      const deleteBtn = document.createElement("button");
      const btnImg = document.createElement("img");
      doTask.dataset.index = `${numList}`;
      checkElement.setAttribute("type", "checkbox");
      checkElement.id = `task${numList}`;
      checkElement.setAttribute("name", `task${numList}`);
      checkElement.dataset.index = `${numList}`;
      checkElement.classList.add("custom-checkbox");
      doTask.classList.add("task");
      taskLabel.textContent = `${element.task}`;
      taskLabel.setAttribute("for", `task${numList}`);
      deleteBtn.dataset.index = `${numList}`;
      deleteBtn.classList.add("delete-btn");
      btnImg.setAttribute("src", `${iconArr[0]}`);
      if (element.done === true) {
        taskLabel.style.textDecoration = "line-through";
        checkElement.setAttribute("checked", "");
      }
      deleteBtn.append(btnImg);
      doTask.append(checkElement, taskLabel, deleteBtn);
      fragment.append(doTask);
    });
    toDoList.append(fragment);
  }
});
