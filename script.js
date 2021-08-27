var TODO_INP_BEFORE;
var style = "";
let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
/*
let items = document.getElementsByClassName("ToDoItem");
for (let item of items) {
    item.innerHTML += `<div class="actions"><i class="fa fa-edit"></i><i class="fa fa-trash"></i></div>`;
}
*/

let form = document.querySelector(".addItemForm");

// Function to popuplate the TODOs in HTML
function updateToDo(animate = false, elem = null) {
    let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
    let toDoHTML = "";
    let ToDoItemsUL = document.querySelector(".ToDoItemsUL");


    // If there are already items in localStorage then show TODOs
    if (parsedToDoObj != null && Object.keys(parsedToDoObj).length != 0) {
        let TODOs = Object.keys(parsedToDoObj);
        TODOs.forEach((text, index) => {
            if (animate == true) {
                style = `animation: animate 0.8s;
                        animation-fill-mode: both;
                        animation-delay: calc(var(--i) * 100ms);`;
            }
            else {
                if (index == (Object.keys(parsedToDoObj).length - 1)) {
                    style = `animation: animate 0.8s;
                            animation-fill-mode: both;`;
                }
                else {
                    style = `animation:asd 1s;transform:translateX(0%);`;
                }

            }
        });
        document.querySelector(".addItemForm").style.setProperty("--i", Object.keys(JSON.parse(localStorage.getItem("myToDo"))).length);

    }
    // If there are no items in localStorage then show message.
    else {
        toDoHTML = `<p style="--i: 0.5;animation: animate 0.8s;
                            animation-fill-mode: both;background: #f5266b; padding: 10px;">Sorry You Have No TODOs! <br> Enter Your Text Below To Create A TODO.</p>`;

        document.querySelector(".addItemForm").style.setProperty("--i", "1");
    }

    if (parsedToDoObj != null) {
        Object.keys(parsedToDoObj).forEach((text, index) => {
            if (animate != true) {
                style = "transform:translateX(0%);";
            }
            toDoHTML += `<li class="ToDoItem" ondragover="onDragOver(this)" ondragend="onDragEnd(this)" draggable="true" style="--i: ${index};grid-row:${parsedToDoObj[text].gridRow};${style}"><input class="TODO_TXT" type="text" value="${text}" readonly="" style="
                            background: transparent;
                            border: none;
                            outline: none;
                            color: white;
                            font-size: 16px;
                        "><div class="actions"><i class="fa fa-edit" onclick="editTODO(this)"></i><i class="fa fa-trash" onclick="deleteTODO(this)"></i><i class="fa fa-check" onclick="DoneTODO(this.parentElement.parentElement)"></i></div></li>`;
        });
        if (elem != null) {
            elem.style.animation = "animate 0.8s";
        }

        ToDoItemsUL.innerHTML = toDoHTML;




        // Check that the TODO is done or not?. if done then change the text-decoration.
        let i = 0;
        for (let item in parsedToDoObj) {
            if (parsedToDoObj[item].active == true) {
                if (document.getElementsByClassName("TODO_TXT")[i].value == Object.keys(parsedToDoObj)[i]) {
                    document.getElementsByClassName("TODO_TXT")[i].style.textDecoration = "line-through";
                    document.getElementsByClassName("TODO_TXT")[i].nextElementSibling.innerHTML = `<i class="fa fa-edit" onclick="editTODO(this)"></i><i class="fa fa-trash" onclick="deleteTODO(this)"></i><i class="fa fa-times-circle" onclick="NotDoneTODO(this.parentElement.parentElement)" style="font-size: 18px;"></i>`;
                }
            }
            i++;
        }
    }

}

updateToDo(true);

form.addEventListener("submit", e => {
    let TODO_INP = e.target.querySelector("input");


    // If there are no items in localStorage create a new array and set it on localStorage
    if (localStorage.getItem("myToDo") == null) {
        let obj = {}
        obj[TODO_INP.value] = {"active":false, "gridRow": "1 / 2"};
        localStorage.setItem("myToDo", JSON.stringify(obj))
    }

    // if there are already items in localStorage then parse it and add the TODO, then set it on localStorage
    else {
        let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
        const lastTodo = Object.keys(parsedToDoObj).length != 0 ? parsedToDoObj[Object.keys(parsedToDoObj)[Object.keys(parsedToDoObj).length - 1]] : {gridRow: "0 / 1"}

        const gridRow = (Number(lastTodo.gridRow.split(" / ")[0]) + 1) + " / " + (Number(lastTodo.gridRow.split(" / ")[1])+1)
        parsedToDoObj[TODO_INP.value] = {"active":false, "gridRow": gridRow};
        

        localStorage.setItem("myToDo", JSON.stringify(parsedToDoObj))
    }

    updateToDo(); // Update the HTML
    TODO_INP.value = ""; // Empty the input field when a TODO hase been created
    e.preventDefault(); // Prevent form submit
});


function deleteTODO(e) {
    let TODO_TXT = e.parentElement.parentElement.querySelector("input").value;

    let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));

    let main_todo_text;

    for (let text of Object.keys(parsedToDoObj)) {
        if (text == TODO_TXT) {
            delete parsedToDoObj[text]
        }

    }

    localStorage.setItem("myToDo", JSON.stringify(parsedToDoObj));
    updateToDo();

}

function editTODO(e) {
    let MAIN_LI = e.parentElement.parentElement;
    let TODO_INP = MAIN_LI.querySelector("input");
    TODO_INP_BEFORE = MAIN_LI.querySelector("input").value;
    let ACTIONS = MAIN_LI.querySelector(".actions");
    TODO_INP.focus();

    ACTIONS.innerHTML = `<i class="fa fa-check" onclick="ConfirmEdit(this)"></i>`;

    TODO_INP.removeAttribute("readonly"); // Remove the readonly attr, so the input tag will become editable.
}

function ConfirmEdit(e) {
    let MAIN_LI = e.parentElement.parentElement;
    let TODO_INP = MAIN_LI.querySelector("input");
    let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
    let keys = Object.keys(parsedToDoObj);
    let values = Object.values(parsedToDoObj);
    let myObj = {};

    Object.keys(parsedToDoObj).forEach((text, index) => {
        if (text == TODO_INP_BEFORE) {
            keys[index] = TODO_INP.value;
        }
    });

    keys.forEach((key, index) => {
        myObj[key] = values[index];

    })

    localStorage.setItem("myToDo", JSON.stringify(myObj));
    updateToDo();
}

function DoneTODO(e) {
    let txt = e.querySelector("input");
    let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
    parsedToDoObj[txt.value].active = true;
    localStorage.setItem("myToDo", JSON.stringify(parsedToDoObj));
    updateToDo();
}

// Function to cancel DoneTODO
function NotDoneTODO(e) {
    let txt = e.querySelector("input");
    let parsedToDoObj = JSON.parse(localStorage.getItem("myToDo"));
    parsedToDoObj[txt.value].active = false;
    localStorage.setItem("myToDo", JSON.stringify(parsedToDoObj));
    updateToDo();
}

// Making TODO item draggable
let TODO_ITEMS = document.querySelectorAll(".ToDoItem")
let MAIN_ELEM = ``;

let overed = null

function onDragEnd(e){
    let currentOverElm = overed

    while (currentOverElm.tagName != "LI"){
        currentOverElm = currentOverElm.parentElement;
    }

    overed = currentOverElm

    if (overed.tagName == "LI"){
        const order = Array.from(document.querySelectorAll("li.ToDoItem")).indexOf(overed) + 1
        overedGridRow = overed.style.gridRow
        currentElmGridRow = e.style.gridRow

        let Todos = JSON.parse(localStorage.getItem("myToDo"))
        
        Todos[e.querySelector(".TODO_TXT").value].gridRow = overedGridRow;
        Todos[overed.querySelector(".TODO_TXT").value].gridRow = currentElmGridRow;

        localStorage.setItem("myToDo", JSON.stringify(Todos));
        
        updateToDo(false);
    }
}

function onDragOver(e){
    overed = e;
}


