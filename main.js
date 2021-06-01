const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { Menu } = require('electron');
const { triggerAsyncId } = require('async_hooks');

const {app,BrowserWindow,ipcMain,dialog,TouchBar} = electron;
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar
let mainWindow,selectPresentation,workspace;

ipcMain.on("pres:new",function(e,item){
    newFile();

});
function newRoom(){
    if(workspace){
        workspace.webContents.executeJavaScript("presentationExport()");
    } else {
        selectPresentation.webContents.executeJavaScript("window.alert('Please create a presentation before starting a presentation room.')");
    }
}
ipcMain.on("action:present",function(){
    workspace.setTouchBar(touchBar);
});
ipcMain.on("login:status",function(e,item){
    if(item == "TRUE"){
        selectPresentation = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
            },
            frame: true
        });
        selectPresentation.loadURL(url.format({
            pathname: path.join(__dirname,'main.html'),
            protocol: 'file:',
            slashes: true
        }));
        // mainWindow.webContents.send("login:info","yes");
    }
});
function undo(){
    if(workspace){
        workspace.webContents.executeJavaScript("undo()");
    }
}
function save(){
    if(workspace){
        workspace.webContents.executeJavaScript("saveAll()");
    }
}
function logoff(){
    app.quit();
}

app.on("ready",function(){
    mainWindow = new BrowserWindow({
        width: 500,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // set recent files
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});
async function openFile(window){
    var file = await dialog.showOpenDialog({ properties: ['openFile'] });
    window.webContents.send("file:loadbyname",file.filePaths[0]);
}
    const prev = new TouchBarButton({
        label: '← Back',
        backgroundColor: '#4287f5',
        click: () => {
            workspace.webContents.executeJavaScript("prevSlide()");
        }
    });

    const next = new TouchBarButton({
        label: 'Next →',
        backgroundColor: '#4287f5',
        click: () => {
            workspace.webContents.executeJavaScript("nextSlide()");
        }
    });

    const touchBar = new TouchBar({
        items: [
            prev,
            new TouchBarSpacer({ size: 'large' }),
            next
        ]
    });

function newFile(){
    workspace = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        frame: true
    });
    workspace.loadURL(url.format({
        pathname: path.join(__dirname, 'workspace.html'),
        protocol: 'file:',
        slashes: true
    }));
    setTimeout(function(){
        workspace.maximize();
    },10);
}

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Presentation",
                accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl+N",
                click(){
                    newFile();
                }
            },
            {
                label: "Open Recent",
                submenu: []
            },
            {
                label: "Save",
                accelerator: process.platform == "darwin" ? "Command+S" : "Ctrl+S",
                click() {
                    save();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Undo",
                accelerator: process.platform == "darwin" ? "Command+Z" : "Ctrl+Z",
                click() {
                    undo();
                }
            },
            {
                label: "Redo",
                accelerator: process.platform == "darwin" ? "Command+Y" : "Ctrl+Y",
                click() {
                    redo();
                }
            }
        ]
    },
    {
        label: "Insert",
        submenu: [
            {
                label: "Textbox",
                click() {
                    if (workspace) {
                        workspace.webContents.executeJavaScript("textBox()");
                    }
                }
            },
            {
                label: "Image",
                click() {
                    if (workspace) {
                        workspace.webContents.executeJavaScript("setNode(0,'block')");
                    }
                }
            },
            {
                label: "Link",
                click() {
                    if (workspace) {
                        workspace.webContents.executeJavaScript("newLink()");
                    }
                }
            },
            {
                label: "Shape",
                submenu: [
                    {
                        label: "Circle",
                        click() {
                            if (workspace) {
                                workspace.webContents.executeJavaScript("newShape('circle')");
                            }
                        }
                    },
                    {
                        label: "Square",
                        click() {
                            if (workspace) {
                                workspace.webContents.executeJavaScript("newShape('square')");
                            }
                        }
                    },
                    {
                        label: "Rounded Square",
                        click() {
                            if (workspace) {
                                workspace.webContents.executeJavaScript("newShape('curvedsquare')");
                            }
                        }
                    },
                    {
                        label: "Pentagon",
                        click() {
                            if (workspace) {
                                workspace.webContents.executeJavaScript("newShape('pentagon')");
                            }
                        }
                    },
                    {
                        label: "Star",
                        click() {
                            if (workspace) {
                                workspace.webContents.executeJavaScript("newShape('star')");
                            }
                        }
                    }
                ]
            },
            {
                label: "Webcam Capture",
                click() {
                    workspace.webContents.executeJavaScript("newShape('photo')");
                }
            },
            {
                label: "QR Code",
                click() {
                    workspace.webContents.executeJavaScript("newShape('barcode')");
                }
            },
            {
                label: "Emoji",
                click() {
                    workspace.webContents.executeJavaScript("newShape('emoji')");
                }
            }
        ]
    },
    {
        label: "Present",
        submenu: [
            {
                label: "New Synk Room",
                accelerator: process.platform == "darwin" ? "Command+P" : "Ctrl+P",
                click() {
                    newRoom();
                }
            }
        ]
    },
    {
        label: "Account",
        submenu: [
            {
                label: "Log Out",
                accelerator: process.platform == "darwin" ? "Command+L" : "Ctrl+L",
                click() {
                    logoff();
                }
            }
        ]
    }
];
if(process.platform == "darwin"){
    menuTemplate.unshift({label:"HI"});
}
if(process.env.NODE_ENV !== "production"){
    menuTemplate.push({
        label: "Developer Tools",
        submenu: [{
            label: "Developer Tools",
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: "reload"
        }]
    });
}