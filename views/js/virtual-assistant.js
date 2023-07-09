let calendar;
window.onload = function() {
  var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek'
    });
    calendar.render();
    loadSettings();
    updateCalendar();
}


// Define a function to add a task to the time boxing list
function addTask(task, timeLimit, date) {
    tasks.push({ task: task, timeLimit: timeLimit, timeLeft: timeLimit * 60, date: date });
    saveSettings();
    console.log(`${task} added to the time boxing list.`);
    updateCalendar();
    document.getElementById("add-task").value = "";
    document.getElementById("add-timelimit").value = "";
    document.getElementById("add-date").value = "";
  }
  
// Define a function to display the time boxing list
function displayTasks() {
  console.log("Time boxing list:");
  tasks.forEach(function (task, index) {
    const minutesLeft = Math.floor(task.timeLeft / 60);
    const secondsLeft = task.timeLeft % 60;
    console.log(`${index + 1}. ${task.task} (${minutesLeft} min ${secondsLeft} sec)`);
  });
}
  // Define a function to remove a task from the time boxing list
  function removeTask(index) {
    tasks.splice(index - 1, 1);
    saveSettings();
    console.log(`Task ${index} removed from the time boxing list.`);
    updateCalendar();
  }
  
  // Define a function to clear the time boxing list
  function clearTasks() {
    var events = calendar.getEvents();
    events.forEach(function(event){
      event.remove();
    })

    tasks = [];
    saveSettings();
    console.log("Time boxing list cleared.");
    updateCalendar();
  }
  
  // Define a function to update the FullCalendar display
  function updateCalendar() {
    //$('#calendar').fullCalendar('removeEvents');
    var events = calendar.getEvents();
    events.forEach(function(event){
      event.remove();
    })
    tasks.forEach(function(task) {
      console.log({
        title: task.task,
        start: new Date(task.date).toISOString(),
        end: new Date(moment(task.date).add(task.timeLimit, 'minutes')).toISOString()
      })
      calendar.addEvent({
        title: task.task,
        start: new Date(task.date).toISOString(),
        end: new Date(moment(task.date).add(task.timeLimit, 'minutes')).toISOString()
      })
    });
  }
  
// Define a function to save the time boxing list to local storage
function saveSettings() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Define a function to load the time boxing list from local storage
function loadSettings() {
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Define a function to start the timer
function startTimer() {
  console.log("Timer started.");
  setInterval(function () {
    tasks.forEach(function (task) {
      if (task.timeLeft > 0) {
        task.timeLeft--;
      }
    });
    saveSettings();
  }, 1000);
}

// Define a function to handle user input
function handleInput(input) {
  const command = input.split(" ")[0];
  switch (command) {
    case "add":
      const task = input.split(" ")[1];
      const timeLimit = parseInt(input.split(" ")[2]);
      addTask(task, timeLimit);
      break;
    case "remove":
      const index = parseInt(input.split(" ")[1]);
      removeTask(index);
      break;
    case "display":
      displayTasks();
      break;
    case "clear":
      clearTasks();
      break;
    case "start":
      startTimer();
      break;
    default:
      console.log("Invalid command.");
  }
}

// Define a function to listen for user input
function listen() {
  const input = prompt("What would you like to do?");
  handleInput(input);
}

// Start the virtual assistant
console.log("Welcome to the time boxing list virtual assistant!");
let tasks = [];
let settings = { timerStarted: false };
loadSettings();
//while (true) {
//  listen();
//}
