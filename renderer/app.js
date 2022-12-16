const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

//home screen data of cpu, memory and ram
ipcRenderer.on("cpu", (event, data) => {
  document.getElementById("cpu").innerHTML = data.toFixed(2);
});
ipcRenderer.on("mem", (event, data) => {
  document.getElementById("mem").innerHTML = (100 - data).toFixed(2);
});
ipcRenderer.on("total-mem", (event, data) => {
  document.getElementById("total-mem").innerHTML = data.toFixed(2);
});

//system information for scanning
ipcRenderer.on("os", (event, data) => {
  localStorage.setItem("os", data);
  document.getElementById("os").innerText = data;
});

ipcRenderer.on("model", (event, data) => {
  localStorage.setItem("model", data);
  document.getElementById("model").innerText = data;
});

ipcRenderer.on("cpuInfo", (event, data) => {
  localStorage.setItem("cpuInfo", data);
  document.getElementById("cpuInfo").innerText = data;
});

ipcRenderer.on("video", (event, data) => {
  localStorage.setItem("video", data);
  document.getElementById("video").innerText = data;
});

ipcRenderer.on("storage", (event, data) => {
  localStorage.setItem("storage", data);
  document.getElementById("storage").innerText = data;
});

ipcRenderer.on("totalStorageAvailable", (event, data) => {
  localStorage.setItem("totalStorageAvailable", data);
  document.getElementById("totalStorageAvailable").innerText = data;
});

//browsing history
ipcRenderer.on("browsingHistory", (event, data) => {
  data.forEach((element) => {
    if (element.length !== 0) {
      element.forEach((e) => {
        const outerDiv = document.createElement("div");
        outerDiv.className = "col-12";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.style.textAlign = "left";
        cardDiv.style.marginBottom = "10px";

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        const urlTitle = document.createElement("strong");
        urlTitle.innerText = e.title;

        const breakLine = document.createElement("br");

        const paraLine = document.createElement("a");
        paraLine.innerText = e.url;
        paraLine.href = e.url;
        paraLine.target = "_blank";

        cardBodyDiv.appendChild(urlTitle);
        cardBodyDiv.appendChild(breakLine);
        cardBodyDiv.appendChild(paraLine);

        cardDiv.appendChild(cardBodyDiv);

        outerDiv.appendChild(cardDiv);

        document.getElementById("browsinghistorylist").appendChild(outerDiv);
      });
    }
  });
});

function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function isPremiumUser() {
  if (localStorage.getItem("activationKeyEntered") === "true") {
    const profile = JSON.parse(localStorage.getItem("profile"));

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://varillapccareapi.herokuapp.com/users`, false); // false for synchronous request
    xmlHttp.send({ activationKey: profile?.activationKey });
    const validTill = new Date(JSON.parse(xmlHttp.response)[0].validTill);

    const today = new Date();
    return validTill > today;
  } else {
    return false;
  }
}

window.onload = () => {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`pass${i}`).value = localStorage.getItem(
      `pass${i}`
    );
  }

  //get the home page statistics every 3 seconds
  setInterval(() => {
    document.getElementById("ping").innerText = getRandomArbitrary(10, 70);
    document.getElementById("download").innerText = getRandomArbitrary(50, 100);
    document.getElementById("upload").innerText = getRandomArbitrary(60, 100);
  }, 3000);

  //if the user has entered the activation key already, get from the localstorage
  if (localStorage.getItem("activationKeyEntered") === "true") {
    document.getElementById("noActivationCode").style.display = "none";
    document.getElementById("hasActivationCode").style.display = "block";

    getProfile();

    const profile = JSON.parse(localStorage.getItem("profile"));
    document.getElementById("name").value = profile.name;
    document.getElementById("phone").value = profile.phoneNumber;
    document.getElementById("phone2").value = profile.phoneNumber2;
    document.getElementById("address").value = profile.address;
    document.getElementById("zip").value = profile.zipcode;
    const output = new Date(profile.validTill);
    const valid =
      output.getDate() +
      " / " +
      (output.getMonth() + 1).toString() +
      " / " +
      output.getFullYear();
    document.getElementById("validtill").innerText = valid;

    //if the user is active
    if (output > new Date()) {
      document.getElementById("protectionBottomActive").style.display = "block";
      document.getElementById("protectionBottomNotActive").style.display =
        "none";
      document.getElementById("freeAccountLocked").style.display = "none";
      document.getElementById("premiumAccountUnlocked").style.display = "block";
    } else {
      document.getElementById("protectionBottomActive").style.display = "none";
      document.getElementById("protectionBottomNotActive").style.display =
        "block";
      document.getElementById("freeAccountLocked").style.display = "block";
      document.getElementById("premiumAccountUnlocked").style.display = "none";
    }
  } else {
    document.getElementById("noActivationCode").style.display = "block";
    document.getElementById("hasActivationCode").style.display = "none";

    document.getElementById("protectionBottomNotActive").style.display =
      "block";
    document.getElementById("protectionBottomActive").style.display = "none";
    document.getElementById("freeAccountLocked").style.display = "block";
    document.getElementById("premiumAccountUnlocked").style.display = "none";
  }
};

//toggle the visibility of the password 1
function togglepass1() {
  const currentEye = document.getElementById("eye1").name;

  if (currentEye === "eye-off-outline") {
    document.getElementById("eye1").name = "eye-outline";
    document.getElementById("pass1").type = "text";
  } else {
    document.getElementById("eye1").name = "eye-off-outline";
    document.getElementById("pass1").type = "password";
  }
}

//toggle the visibility of the password 2
function togglepass2() {
  const currentEye = document.getElementById("eye2").name;

  if (currentEye === "eye-off-outline") {
    document.getElementById("eye2").name = "eye-outline";
    document.getElementById("pass2").type = "text";
  } else {
    document.getElementById("eye2").name = "eye-off-outline";
    document.getElementById("pass2").type = "password";
  }
}

//toggle the visibility of the password 3
function togglepass3() {
  const currentEye = document.getElementById("eye3").name;

  if (currentEye === "eye-off-outline") {
    document.getElementById("eye3").name = "eye-outline";
    document.getElementById("pass3").type = "text";
  } else {
    document.getElementById("eye3").name = "eye-off-outline";
    document.getElementById("pass3").type = "password";
  }
}

//toggle the visibility of the password 3
function togglepass4() {
  const currentEye = document.getElementById("eye4").name;

  if (currentEye === "eye-off-outline") {
    document.getElementById("eye4").name = "eye-outline";
    document.getElementById("pass4").type = "text";
  } else {
    document.getElementById("eye4").name = "eye-off-outline";
    document.getElementById("pass4").type = "password";
  }
}

// store the passwords to localStorage on 'save' button
function savePasswords() {
  for (let i = 1; i <= 4; i++) {
    localStorage.setItem(`pass${i}`, document.getElementById(`pass${i}`).value);
  }
}

// remove the saved passwords from localstorage on 'delete' button
function deletePasswords() {
  for (let i = 1; i <= 4; i++) {
    localStorage.clear();
    document.getElementById(`pass${i}`).value = "";
  }
}

//function for scrolling the pages automatically (used to show system specs after scanning)
function pageScroll() {
  if (document.getElementById("protectionSection").style.display === "block") {
    window.scrollBy(0, 1);
    scrolldelay = setTimeout(pageScroll, 100);
  }
}

// function to execute on 'scan now'
function scanNow() {
  document.getElementById("beforescanclicked").style.display = "none";
  document.getElementById("afterscanclicked").style.display = "block";

  for (let i = 1; i <= 6; i++) {
    setTimeout(() => {
      document.getElementById(`loader${i}`).style.display = "none";
      document.getElementById(`check${i}`).style.display = "inline-block";
    }, 10000 * i);
  }

  setTimeout(() => {
    document.getElementById("afterscanclicked").style.display = "none";
    document.getElementById("scancompleted").style.display = "block";

    const profile = JSON.parse(localStorage.getItem("profile"));
    const output = new Date(profile.validTill);

    //if the user is active
    if (output > new Date()) {
      document.getElementById("protectionBottomActive").style.display = "block";
      document.getElementById("protectionBottomNotActive").style.display =
        "none";
      document.getElementById("freeAccountLocked").style.display = "none";
      document.getElementById("premiumAccountUnlocked").style.display = "block";
    } else {
      console.log("Not Active");
      document.getElementById("protectionBottomActive").style.display = "none";
      document.getElementById("protectionBottomNotActive").style.display =
        "block";
      document.getElementById("freeAccountLocked").style.display = "block";
      document.getElementById("premiumAccountUnlocked").style.display = "none";
    }

    //set the system specs from localstorage
    document.getElementById("os").innerText = localStorage.getItem("os");
    document.getElementById("model").innerText = localStorage.getItem("model");
    document.getElementById("cpuInfo").innerText =
      localStorage.getItem("cpuInfo");
    document.getElementById("video").innerText = localStorage.getItem("video");
    document.getElementById("storage").innerText =
      localStorage.getItem("storage");
    document.getElementById("totalStorageAvailable").innerText =
      localStorage.getItem("totalStorageAvailable");
  }, 63000);

  //start scrolling the page after the scan is complete, not before that
  setTimeout(() => {
    pageScroll();
  }, 64000);
}

//function to switch between sections
function activate(sectionName) {
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("protectionSection").style.display = "none";
  document.getElementById("privacySection").style.display = "none";
  document.getElementById("networkSection").style.display = "none";
  document.getElementById("profileSection").style.display = "none";

  document.getElementById("homeBtn").style.color = "white";
  document.getElementById("protectionBtn").style.color = "white";
  document.getElementById("privacyBtn").style.color = "white";
  document.getElementById("networkBtn").style.color = "white";
  document.getElementById("profileBtn").style.color = "white";

  document.getElementById(`${sectionName}Section`).style.display = "block";
  document.getElementById(`${sectionName}Btn`).style.color = "black";
}

function activateHome() {
  activate("home");
}

function activateProtection() {
  activate("protection");
  pageScroll();
}

function activatePrivacy() {
  activate("privacy");
}

function activateNetwork() {
  activate("network");
}

function activateProfile() {
  activate("profile");
}

// get profile info from the server
function getProfile() {
  document.getElementById("getProfileBtn").innerText = "Loading ...";
  document.getElementById("getProfileBtn").setAttribute("disabled", true);
  const activationKey =
    document.getElementById("activationCode").value ||
    JSON.parse(localStorage.getItem("profile")).activationKey;

  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    `https://varillapccareapi.herokuapp.com/users?activationKey=${activationKey}`,
    false
  ); // false for synchronous request
  xmlHttp.send(null);
  const profile = JSON.parse(xmlHttp.response)[0];
  localStorage.setItem("profile", JSON.stringify(profile));
  if (profile === undefined) {
    localStorage.setItem("activationKeyEntered", false);
    document.getElementById("getProfileBtn").innerText = "Activate";
    document.getElementById("getProfileBtn").removeAttribute("disabled");
  } else {
    document.getElementById("getProfileBtn").innerText = "Activate";
    document.getElementById("getProfileBtn").removeAttribute("disabled");

    localStorage.setItem("activationKeyEntered", "true");
    document.getElementById("hasActivationCode").style.display = "block";
    document.getElementById("noActivationCode").style.display = "none";

    document.getElementById("name").value = profile.name;
    document.getElementById("phone").value = profile.phoneNumber;
    document.getElementById("phone2").value = profile.phoneNumber2;
    document.getElementById("address").value = profile.address;
    document.getElementById("zip").value = profile.zipcode;
    const output = new Date(profile.validTill);
    const valid =
      output.getDate() +
      " / " +
      (output.getMonth() + 1).toString() +
      " / " +
      output.getFullYear();
    document.getElementById("validtill").innerText = valid;
  }
}

//logout - clears all the info from the localstorage
function logout() {
  localStorage.setItem("activationKeyEntered", false);

  document.getElementById("noActivationCode").style.display = "block";
  document.getElementById("hasActivationCode").style.display = "none";

  document.getElementById("protectionBottomActive").style.display = "none";
  document.getElementById("protectionBottomNotActive").style.display = "block";
  document.getElementById("freeAccountLocked").style.display = "block";
  document.getElementById("premiumAccountUnlocked").style.display = "none";

  localStorage.setItem("profile", "");
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("phone2").value = "";
  document.getElementById("address").value = "";
  document.getElementById("zip").value = "";
  document.getElementById("validtill").innerText = "";
}

//clock js

document.addEventListener("DOMContentLoaded", () => {
  // Unix timestamp (in seconds) to count down to
  var twoDaysFromNow = new Date().getTime() / 1000 + 900 * 2 + 1;

  // Set up FlipDown
  var flipdown = new FlipDown(twoDaysFromNow)

    // Start the countdown
    .start()

    // Do something when the countdown ends
    .ifEnded(() => {
      console.log("The countdown has ended!");
    });

  // Show version number
  var ver = document.getElementById("ver");
  ver.innerHTML = flipdown.version;
});

function openPaymentScreen() {
  ipcRenderer.send("paymentScreen");
}
