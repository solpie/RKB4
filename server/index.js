const { app, BrowserWindow, ipcMain } = require('electron');
app.on('ready', _ => {
    win = new BrowserWindow({
        // width: 950, height: 540,
        width: 800,
        height: 1024,
        resizable: true,
        frame: true,
        autoHideMenuBar: false,
        webaudio: false
    });
    win.setMenuBarVisibility(false);

    win.loadURL(`file://${__dirname}/index.html`);
    // win.loadURL(`file://${__dirname}resources/app/static/index.js`);
    win.toggleDevTools({ mode: 'detach' });
    win.on('closed', function() {
        win = null;
    });
});