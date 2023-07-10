"use strict"

// electron
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1150,
        height: 1000,
        icon: path.join(__dirname, 'assets/logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('views/index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (mainWindow === null) createWindow()
})   

/**
 * REST API
 */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const express = require('express');

const rest = express();
rest.use(express.json());
rest.use(express.urlencoded({ extended: true }));

var argv = yargs(hideBin(process.argv))
.option('host', {
    alias: 'h',
    type: 'string',
    description: 'host name',
    default: 'localhost',
    required: false
})
.option('port', {
    alias: 'p',
    type: 'number',
    description: 'port',
    default: 3030,
    required: false
})
.parse()

// Define a route for adding a new task
rest.post('/task', (req, res) => {
    const task = req.body.task;
    const timeLimit = req.body.timeLimit;
    const timeStart = req.body.timeStart;
  
    if (!task || !timeLimit || !timeStart) {
      return res.status(400).json({ error: 'Task, time limit and starting time are required.' });
    }
  
    const newTask = [task, timeLimit, timeStart];
    //tasks.push(newTask);

    mainWindow.webContents.send("add_task", newTask);
  
    return res.status(201).json(newTask);
});
  
// Start the server
rest.listen(argv.port, argv.host, () => {
    console.log(`Server started on http://${argv.host}:${argv.port}`);
});