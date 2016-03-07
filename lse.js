
// Globals
var list = null;

// When the page has loaded do all this stuff
document.addEventListener("DOMContentLoaded", function(event) {
    list = getList();

    renderList();


    // Start listening for storage events
    window.addEventListener('storage', onStorageEvent, false);

    // Events for our buttons
    document.getElementById("add-item").addEventListener("click", function(){
        addItem();
    });

    document.getElementById("clear-list").addEventListener("click", function(){
        clearList();
    });
});


function onStorageEvent(storageEvent){
    list = getList();
    renderList();
}

// Create a blank list
function initList(){
    var list = {items:[]};
    localStorage.list = JSON.stringify(list);
    return list;
}

// Get the last saved list
function getList(){
    var list = localStorage.list;

    if(list == null || list == undefined || (list != null && list.length == 0)){
        list = initList();
    } else {
        try {
            list = JSON.parse(list);
        } catch(err) {
            list = initList();
        }

    }

    return list;
}

function setList(){
    localStorage.list = JSON.stringify(list);
}

function clearList(){
    list = initList();
    renderList();
}

function renderList(){
    var taskList = document.getElementById('task-list');

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    list.items.forEach(function(item){
        renderItem(item);
    });
}

// Add item to list object and render to page
function addItem(){
    var newItem = {id: 'item-'+(new Date).getTime() };
    list.items.push(newItem);
    setList();
    renderItem(newItem);
}

// Extend item with supplied values
function updateItem(id, obj){
    list.items.forEach(function(item){
        if(item.id == id){
            for(var key in obj){
                item[key] = obj[key];
            }
        }
    });

    setList();
}

function renderItem(item){
    var template = document.getElementById('item-template').textContent;
    template.match(/\{\{(.*?)\}\}/g).forEach(function(m){
        template = template.replace(m, (item[m.substring(2,m.length-2)] || ''));
    });

    var newEl = document.createElement('li');
    newEl.innerHTML = template;

    var taskList = document.getElementById('task-list');
    taskList.appendChild(newEl);

    // Add events for this item
    document.querySelector('#'+item.id +' input[type="checkbox"]').addEventListener("click", function(){
        var checked = (this.checked) ? "checked" : "";
        updateItem(item.id, {checked: checked})
    });

    document.querySelector('#'+item.id +' input[type="text"]').addEventListener("input", function(){
        updateItem(item.id, {label: this.value})
    });

}

