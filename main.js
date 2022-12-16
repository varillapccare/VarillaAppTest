const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  ipcMain,
  Notification,
  screen,
} = require("electron");
const path = require("path");
const si = require("systeminformation");
const os = require("os-utils");
const BrowserHistory = require("node-browser-history");

app.setLoginItemSettings({
  openAtLogin: true,
});

function showNotification(title, body) {
  new Notification({
    title,
    body,
    icon: nativeImage.createFromPath("build/icon.png"),
  }).show();
}

let win;
let saleWindow;
let discountWindow;
let adWindow;
let paymentWindow;
let tray = null;

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function createSaleWindow() {
  saleWindow = new BrowserWindow({
    width: 800,
    height: 850,
    minHeight: 850,
    minWidth: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    center: true,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath("build/icon.png"),
  });

  saleWindow.loadFile("renderer/sales.html");
}

function createDiscountWindow() {
  discountWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    minHeight: 600,
    minWidth: 1100,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    center: true,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath("build/icon.png"),
  });

  discountWindow.loadFile("renderer/discount.html");
}

function createAdWindow() {
  const screenSize = screen.getPrimaryDisplay();
  adWindow = new BrowserWindow({
    width: 600,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath("build/icon.png"),
  });

  adWindow.loadFile("renderer/ad.html");
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 800,
    minWidth: 1200,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    center: true,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath("build/icon.png"),
  });

  win.loadFile("renderer/index.html");
}

function createPaymentWindow() {
  const screenSize = screen.getPrimaryDisplay();
  paymentWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath("build/icon.png"),
  });

  paymentWindow.loadURL("https://varilla.jp/specialpageforapp.html");
}

app.whenReady().then(() => {
  createWindow();
  createAdWindow();
  createSaleWindow();
  createDiscountWindow();
  setTimeout(() => {
    // adWindow.hide();
    saleWindow.hide();
    discountWindow.hide();
  }, 500);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.setAppUserModelId("Varilla PC Care");

  //main window
  win.on("minimize", (event) => {
    event.preventDefault();
    win.hide();
  });

  win.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }

    return false;
  });

  //sale window
  saleWindow.on("minimize", (event) => {
    event.preventDefault();
    saleWindow.hide();
  });

  saleWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      saleWindow.hide();
    }

    return false;
  });

  //discount window
  discountWindow.on("minimize", (event) => {
    event.preventDefault();
    discountWindow.hide();
  });

  discountWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      discountWindow.hide();
    }

    return false;
  });

  //ad window
  adWindow.on("minimize", (event) => {
    event.preventDefault();
    adWindow.hide();
  });

  adWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      adWindow.hide();
    }

    return false;
  });

  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Launch Varilla",
      click: function () {
        win.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray = new Tray(nativeImage.createFromPath("build/icon.png"));
  tray.setToolTip("Varilla PC Care");
  tray.setContextMenu(contextMenu);

  // generate random integer between a range
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  //show the main window after every 20-40 minute
  setInterval(() => {
    win.show();
    win.setAlwaysOnTop(true, "screen");
  }, randomNumber(12, 24) * 100000);

  //toggle the ad window after every 5-15 minute
  setInterval(() => {
    win.webContents
      .executeJavaScript("isPremiumUser()", true)
      .then((result) => {
        if (result === true) {
          adWindow.hide();
        } else {
          if (adWindow.isVisible()) {
            adWindow.hide();
          } else {
            adWindow.show();
            // adWindow.setAlwaysOnTop(true, "pop-up-menu");
          }
        }
      });
  }, randomNumber(3, 9) * 10000);

  //toggle the sale window after every 15-25 minute
  setInterval(() => {
    win.webContents
      .executeJavaScript("isPremiumUser()", true)
      .then((result) => {
        if (result === true) {
          saleWindow.hide();
        } else {
          if (saleWindow.isVisible()) {
            saleWindow.hide();
          } else {
            saleWindow.show();
            saleWindow.setAlwaysOnTop(true, "screen");
          }
        }
      });
  }, randomNumber(9, 15) * 1000000);

  //toggle the discount window after every 20-40 minute
  setInterval(() => {
    win.webContents
      .executeJavaScript("isPremiumUser()", true)
      .then((result) => {
        if (result === true) {
          discountWindow.hide();
        } else {
          if (discountWindow.isVisible()) {
            discountWindow.hide();
          } else {
            discountWindow.show();
            discountWindow.setAlwaysOnTop(true, "screen");
          }
        }
      });
  }, randomNumber(12, 24) * 100000);

  //send os usage to home screen
  setInterval(() => {
    os.cpuUsage(function (v) {
      win.webContents.send("cpu", v * 100);
      win.webContents.send("mem", os.freememPercentage() * 100);
      win.webContents.send("total-mem", os.totalmem() / 1024);
    });
  }, 1000);

  //sending browser history
  setInterval(() => {
    BrowserHistory.getAllHistory(100)
      .then((history) => {
        win.webContents.send("browsingHistory", history);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 10000);

  //sending system information
  si.osInfo().then((data) => {
    win.webContents.send("os", data.distro);
  });

  si.system().then((data) => {
    win.webContents.send("model", data.manufacturer + " / " + data.model);
  });

  si.cpu().then((data) => {
    win.webContents.send("cpuInfo", data.manufacturer + ", " + data.brand);
  });

  si.graphics().then((data) => {
    win.webContents.send("video", data.controllers[0].model);
  });

  si.diskLayout().then((data) => {
    win.webContents.send("storage", data[0].type + " / " + data[0].name);
    win.webContents.send("totalStorageAvailable", formatBytes(data[0].size));
  });

  //notification 1 - after every 10-30 minutes
  setInterval(() => {
    const NOTIFICATION_TITLE = "VARILLAようこそ";
    const NOTIFICATION_BODY =
      "スキャン ボタンをクリックして、コンピュータの問題を確認してください";
    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
  }, randomNumber(6, 18) * 100000);

  //notification 2 - after every 10-30 minutes
  setInterval(() => {
    const NOTIFICATION_TITLE = "VARILLAようこそ";
    const NOTIFICATION_BODY =
      "スキャン ボタンをクリックして、コンピュータの問題を確認してください";
    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
  }, randomNumber(6, 18) * 100000);

  //notification 3 - after every 10-30 minutes
  setInterval(() => {
    const NOTIFICATION_TITLE = "VARILLAようこそ";
    const NOTIFICATION_BODY =
      "スキャン ボタンをクリックして、コンピュータの問題を確認してください";
    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
  }, randomNumber(6, 18) * 100000);
});

ipcMain.on("saleScreen", () => {
  createSaleWindow();
});

ipcMain.on("discountScreen", () => {
  createDiscountWindow();
});

ipcMain.on("adScreen", () => {
  createAdWindow();
});

ipcMain.on("paymentScreen", () => {
  createPaymentWindow();
  paymentWindow.maximize();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
