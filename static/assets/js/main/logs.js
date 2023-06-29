window.onload = function () {
  Get_logs();
  // let payload4 = {
  //   action: "Count",
  // };
  // ajax(payload4);
};
// document.getElementById("logsTable_next").classList.add = "d-none";

let weaponOn = false;
let CaptureFace = false;
let counter = 0;
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const host = "ws://3.111.20.182:8083/mqtt";
const username = "admin";
const password = "Amrit4aku#6";
let payloadNew = {};

const options2 = {
  keepalive: 30,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
  username: username,
  password: password,
};

let check = false;
let detectedPersons = []; // Array to store detected persons
let detectedWeapons = []; // Array to store detected weapons
let displayDetectedPerson = {}; // Object to store detected persons
let displayDetectedPersonWithWeapon = {}; // Object to store detected persons with matching weapons
let currentIndex = 0;
let regId;
let rankSave;
let nameSave;
let gunType;
let gunSave;
let departmentSave;
let personDiv = document.getElementById("personWithWeapon");
let updateScheduled = false; // Flag to track if an update is already scheduled

function Get_logs() {
  let payload = {
    action: "Get_Logs",
  };

  let payload2 = {
    action: "Get_Recognised_personels",
  };

  let payload3 = {
    action: "Get_weapons",
  };

  let payload4 = {
    action: "Get_Unrecognised_personels",
  };

  ajax(payload);
  ajax(payload2);
  ajax(payload3);
  ajax(payload4);
}

// function Get_logs() {
//   let payload = {
//     action: "Get_Logs",
//   };

//   ajax(payload);
// }

// function Get_logs() {
//   let payload = {
//     action: "Get_Logs",
//   };

//   ajax(payload);
// }

let tabledataRes;

function ajax(payload) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", "http://13.234.211.133:85/actions");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send(JSON.stringify(payload));
  console.log(payload);
  xhr.onload = function () {
    const response = xhr.response;
    console.log(response);
    if (response.action == "Get_Logs") {
      if (response.Status == 100) {
        // Swal.fire({
        //   text: "Sorry, the username and password are incorrect, please try again.",
        //   icon: "error",
        //   buttonsStyling: false,
        //   confirmButtonText: "Ok, got it!",
        //   customClass: {
        //     confirmButton: "btn btn-primary",
        //   },
        // });
      } else if (response.Status == 200) {
        tabledataRes = response;
        const tableData = response.Logs.map((log) => [
          log.Data.User.Name,
          log.Data.User.Regt_Id,
          log.Data.User.WeaponId,
          log.Data.User.Time,
          log.Data.User.ActionStatus,
        ]);

        const table = $("#logsTable").DataTable({
          data: tableData,
          columns: [
            { title: "Name" },
            { title: "Registration" },
            { title: "WeaponId" },
            { title: "Time of detection" },
            { title: "Weapon Status" },
          ],
        });
      }
    } else if (response.action == "Get_Unrecognised_personels") {
      console.log(response);
      let displayUnrecognisedPerson = [];
      for (const person of response.Personals) {
        // const person = response.Personals[personId];
        displayUnrecognisedPerson.push(`
        <div class="card rounded w-50 col-3 bg-dark p-5 m-3">
        <div class="image-container">
        <img src="data:image/jpeg;base64,${person.Snapshot}" alt="Example Image">
        </div>
            <label class="form-label p-2 text-white fw-bold">Person: UNKNOWN</label>
            <label class="form-label p-2 text-white fw-bold">Time of detection: ${person.Time}</label>
            <a href="javascript:;" id="submitBtn" onclick="openSweetAlert();" class="btn btn-flex btn-light-primary p-2">
                <i class="fas fa-plus fs-3"></i>
                Add Label
            </a>
        </div>`);
      }
      // displayUnrecognisedPerson.shift();
      document.getElementById("displayUnrecognisedPerson").innerHTML =
        displayUnrecognisedPerson.join("");
    } else if (response.action == "Get_Recognised_personels") {
      console.log(response);
      let displayRecognisedPerson = [];
      for (const person of response.Personals) {
        // const person = response.Personals[personId];
        console.log(person);
        displayRecognisedPerson.push(`
        <div class="card rounded col-3 bg-dark p-2 m-1">
        <div class="image-container">
        <img src="data:image/jpeg;base64,${person.Snap}" alt="Example Image">
        </div>
        <div class="form-group row mb-1">
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Name: ${person.Name}</label>
            </div>
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Rank: ${person.Rank}</label>
            </div>
        </div>
        <div class="form-group row mb-1">
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Department: ${person.Department}</label>
            </div>
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Gun: ${person.Gun}</label>
            </div>
        </div>
        <div class="form-group row mb-1">
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Regt_Id: ${person.Regt_Id}</label>
            </div>
            <div class="col-6">
            <label class="form-label p-2 text-white fw-bold">Weapon Status: ${person.Action}</label>
            </div>
        </div>            
        </div>`);
      }
      document.getElementById("displayRecognisedPerson").innerHTML =
        displayRecognisedPerson.join("");
    } else if (response.action == "Get_weapons") {
      console.log(response);
      let displayWeapons = [];
      for (const gun of response.Guns) {
        // const person = response.Personals[personId];
        console.log(gun);
        displayWeapons.push(`
        <div class="card rounded w-50 col-3 bg-dark p-5 m-3">
        <div class="image-container">
        <img src="data:image/jpeg;base64,${gun.Snapshot}" alt="Example Image">
        </div>
            <label class="form-label p-2 text-white fw-bold">Weapon Id: ${gun.Weapon_id}</label>
            <label class="form-label p-2 text-white fw-bold">Weapon Type: ${gun.Type}</label>
        </div>`);
        document.getElementById("displayWeapons").innerHTML =
          displayWeapons.join("");
      }
    } else if (response.action == "Get_Camera") {
      console.log(response);
      for (const cam of response.Guns) {
        // const person = response.Personals[personId];
        console.log(gun);
        displayWeapons.push(`
        <div class="card rounded w-50 col-3 bg-dark p-5 m-3">
        <div class="image-container">
        <img src="data:image/jpeg;base64,${gun.Snapshot}" alt="Example Image">
        </div>
            <label class="form-label p-2 text-white fw-bold">Weapon Id: ${gun.Weapon_id}</label>
            <label class="form-label p-2 text-white fw-bold">Weapon Type: ${gun.Type}</label>
        </div>`);
        document.getElementById("displayWeapons").innerHTML =
          displayWeapons.join("");
      }
      document.getElementById("displayCameras").innerHTML = "";
    } else if (response.action == "Create_Personal") {
      console.log(response);
      if (response.Status == 200) {
        Swal.fire({
          icon: "success",
          title: "Person added Successfully!",
          confirmButtonText: "OK",
        });
        window.location.href = "/inventory";
      }
    } else if (response.action == "Create_Gun") {
      console.log(response);
      if (response.Status == 200) {
        Swal.fire({
          icon: "success",
          title: "Weapon added Successfully!",
          confirmButtonText: "OK",
        });
        window.location.href = "/inventory";
      }
    }
  };
}

$("#kt_daterangepicker_1").daterangepicker();

// console.log(document.getElementById("kt_daterangepicker_1").value);

function updateTable() {
  const dateRange = document.getElementById("kt_daterangepicker_1").value;
  const [startDateStr, endDateStr] = dateRange.split(" - ");

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const filteredLogs = tabledataRes.Logs.filter((log) => {
    const logTime = new Date(log.Data.User.Time);
    return logTime >= startDate && logTime <= endDate;
  });

  const tableData = filteredLogs.map((log) => [
    log.Data.User.Name,
    log.Data.User.Regt_Id,
    log.Data.User.WeaponId,
    log.Data.User.Time,
    log.Data.User.ActionStatus,
  ]);

  const table = $("#logsTable").DataTable({
    destroy: true,
    data: tableData,
    columns: [
      { title: "Name" },
      { title: "Registration" },
      { title: "WeaponId" },
      { title: "Time of detection" },
      { title: "Weapon Status" },
    ],
  });
}
// $("#kt_daterangepicker_1").daterangepicker(
//   {
//     startDate: "user_input_start_date", // Replace "user_input_start_date" with the actual user-selected start date
//     endDate: "user_input_end_date", // Replace "user_input_end_date" with the actual user-selected end date
//   },
//   function (start, end, label) {
//     const startDate = start.format("YYYY-MM-DD");
//     const endDate = end.format("YYYY-MM-DD");

//     const filteredLogs = response.Logs.filter((log) => {
//       const logTime = new Date(log.Data.User.Time);
//       return logTime >= new Date(startDate) && logTime <= new Date(endDate);
//     });

//     const tableData = filteredLogs.map((log) => [
//       log.Data.User.Name,
//       log.Data.User.Regt_Id,
//       log.Data.User.WeaponId,
//       log.Data.User.Time,
//       log.Data.User.ActionStatus,
//     ]);

//     const table = $("#logsTable").DataTable({
//       destroy: true,
//       data: tableData,
//       columns: [
//         { title: "Name" },
//         { title: "Regt_Id" },
//         { title: "WeaponId" },
//         { title: "Time" },
//         { title: "ActionStatus" },
//       ],
//     });
//   }
// );

// $("#kt_daterangepicker_1").daterangepicker(
//   {
//     startDate: "user_input_start_date", // Replace "user_input_start_date" with the actual user-selected start date
//     endDate: "user_input_end_date", // Replace "user_input_end_date" with the actual user-selected end date
//   },
//   function (start, end, label) {
//     const startDate = start.format("YYYY-MM-DD");
//     const endDate = end.format("YYYY-MM-DD");

//     const filteredLogs = tabledataRes.Logs.filter((log) => {
//       const logTime = new Date(log.Data.User.Time);
//       return logTime >= startDate && logTime <= endDate;
//     });

//     const tableData = filteredLogs.map((log) => [
//       log.Data.User.Name,
//       log.Data.User.Regt_Id,
//       log.Data.User.WeaponId,
//       log.Data.User.Time,
//       log.Data.User.ActionStatus,
//     ]);

//     const table = $("#logsTable").DataTable({
//       destroy: true,
//       data: tableData,
//       columns: [
//         { title: "Name" },
//         { title: "Regt_Id" },
//         { title: "WeaponId" },
//         { title: "Time" },
//         { title: "ActionStatus" },
//       ],
//     });
//   }
// );

// Function to open SweetAlert2 and handle user input
function openSweetAlert() {
  const disclaimer =
    "Please make sure your face is visible in the camera before submitting your details.";
  const iframeSrc = "http://13.234.211.133:8889/Cam/0/OUT";

  Swal.fire({
    title: `${disclaimer}`,
    html:`<div class="container row d-flex align-items-center justify-content-between">
        <div class="col-5 align-items-center">
          <iframe allowfullscreen src="${iframeSrc}" width="100%" height="400"></iframe>
        </div>
        <div class="col-5 align-items-cented">
            <input id="regtIdInput" class="swal2-input" placeholder="Regt ID" required>
          <input id="rankInput" class="swal2-input" placeholder="Rank" required>
          <input id="nameInput" class="swal2-input" placeholder="Name" required>
          <input id="GunInput" class="swal2-input" placeholder="GunId" required>
          <input id="departmentInput" class="swal2-input" placeholder="Department" required>
        </div>
      </div>`,
    showCancelButton: false,
    confirmButtonText: "Capture Snapshot & Submit",
    cancelButtonText: "Cancel",
    position: "center",
    customClass: {
      popup: "modal-lg",
      content: "content-height",
    },
    onOpen: () => {
      const swal2Content = document.getElementById("swal2-content");
      swal2Content.style.minHeight = "55vh";
    },
    preConfirm: () => {
      const regtId = document.getElementById("regtIdInput").value;
      const rank = document.getElementById("rankInput").value;
      const name = document.getElementById("nameInput").value;
      const gun_id = document.getElementById("GunInput").value;
      const department = document.getElementById("departmentInput").value;

      if (!regtId || !rank || !name || !department) {
        Swal.showValidationMessage("Please fill all the fields");
        return false;
      }
      regId = regtId;
      rankSave = rank;
      nameSave = name;
      gunSave = gun_id;
      departmentSave = department;
      CaptureFace = true;

      Swal.fire({
        title: "Please Wait! Your face is being captured...",
        text: "",
        html:`<div style="flex: 1;">
          <iframe allowfullscreen src="${iframeSrc}" width="100%" height="100%"></iframe>
        </div>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
    },
  }).then((result) => {
    if (CaptureFace) {
      Swal.fire({
        title: "Success!",
        text: "Data captured successfully.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  });
}

function openSweetAlert2() {
  const disclaimer =
    "Please make sure your weapon is visible in the camera before submitting the details.";
  const iframeSrc = "http://13.234.211.133:8889/Cam/0/OUT";

  Swal.fire({
    title: `${disclaimer}`,
    html:`<div class="container row d-flex align-items-center justify-content-between">
        <div class="col-5 align-items-center">
          <iframe allowfullscreen src="${iframeSrc}" width="100%" height="400"></iframe>
        </div>
        <div class="col-5 align-items-cented">
        <input id="gunType" class="swal2-input" placeholder="Weapon type" required>
        <input id="GunInput" class="swal2-input" placeholder="Weapon Id" required>
        </div>
      </div>`,
    showCancelButton: true,
    confirmButtonText: "Capture Snapshot & Submit",
    cancelButtonText: "Cancel",
    position: "center",
    customClass: {
      popup: "modal-lg",
      content: "content-height",
    },
    onOpen: () => {
      const swal2Content = document.getElementById("swal2-content");
      swal2Content.style.minHeight = "55vh";
    },
    preConfirm: () => {
      const gun_id = document.getElementById("GunInput").value;
      const gun_type = document.getElementById("gunType").value;

      if (!gun_id || !gun_type) {
        Swal.showValidationMessage("Please fill all the fields");
        return false;
      }
      gunSave = gun_id;
      gunType = gun_type;
      CaptureFace = true;

      Swal.fire({
        title: "Please Wait! Your weapon is being captured...",
        html:`<div style="flex: 1;">
          <iframe allowfullscreen src="${iframeSrc}" width="100%" height="100%"></iframe>
        </div>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
    },
  }).then((result) => {
    if (CaptureFace) {
      Swal.fire({
        title: "Success!",
        text: "Data captured successfully.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  });
}

function publishMessage2(topic, payload) {
  const message = JSON.stringify(payload);
  client.publish(topic, message, { qos: 2 }, (err) => {
    if (err) {
      console.error("Error publishing message:", err);
    } else {
      console.log("Message published:", message);
    }
  });
}

console.log("connecting mqtt client");
const client = mqtt.connect(host, options2);

client.on("error", (err) => {
  console.log("Connection error: ", err);
  client.end();
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
});

client.on("connect", () => {
  console.log("Client connected:" + clientId);
  client.subscribe("reconW/test", { qos: 1 });
});

client.on("message", (topic, message, packet) => {
  const receivedMessage = JSON.parse(message.toString());
  console.log("Received Message:", receivedMessage);

  if (Array.isArray(receivedMessage)) {
    console.log("check: " + check);
    console.log(detectedWeapons + "-------------------------");
    if (CaptureFace == true) {
      // Counter variable to keep track of the count

      for (const obj of receivedMessage) {
        if (obj.class === "person" && obj.Data == null) {
          var payload = {
            action: "AddPerson",
            Snapshot: obj.Snapshot,
            Regt_Id: regId,
            Rank: rankSave,
            Name: nameSave,
            Department: departmentSave,
            Gun: gunSave,
          };
          // Publish obj.Snapshot to 'reconW/addPerson' topic
          // until the count reaches 100
          if (counter < 100) {
            // Publish obj.Snapshot
            publishMessage2("reconW/AddPerson", payload);
            counter++;
            if (counter == 50) {
              payloadNew = {
                action: "Create_Personal",
                person: {
                  Action: "Deposit",
                  Snap: obj.Snapshot,
                  Regt_Id: regId,
                  Rank: rankSave,
                  Name: nameSave,
                  Department: departmentSave,
                  Gun: gunSave,
                },
              };
            }
          } else {
            CaptureFace = false;

            counter = 0;
            console.log(payloadNew);
            ajax(payloadNew);
            // redirect
          }
        } else if (obj.class === "Gun") {
          // detectedWeapons.unshift(obj);
          var payload = {
            action: "Create_Gun",

            Type: gunType,
            Weapon_id: gunSave,
          };
          // Publish obj.Snapshot to 'reconW/addPerson' topic
          // until the count reaches 100
          if (counter < 6) {
            // Publish obj.Snapshot
            // publishMessage2("reconW/AddPerson", payload);
            counter++;
            if (counter == 4) {
              payloadNew = {
                action: "Create_Gun",
                gundata: {
                  action: "Create_Gun",
                  Snapshot: obj.Snapshot,
                  Type: gunType,
                  Weapon_id: gunSave,
                },
              };
            }
          } else {
            CaptureFace = false;
            Swal.fire({
              icon: "success",
              title: "Weapon data Capture Successfully!",
              text: "",
              confirmButtonText: "OK",
            });
            counter = 0;
            console.log(payloadNew);
            ajax(payloadNew);
            // redirect
          }
        }
      }
    }
    if (CaptureFace == false) {
      // for (const obj of receivedMessage) {
      //   if (obj.class === "person") {
      //     if (!displayDetectedPerson.hasOwnProperty(obj.id)) {
      //       displayDetectedPerson[obj.Name] = obj;
      //     }
      //     if (check === false) {
      //       // handleDetectedPersonsUpdate();
      //     }
      //   }
      //   //   else if(obj.class === "person" && obj.Data == null){
      //   //     displayDetectedPerson[obj.id] = obj;
      //   //   }
      //   else if (obj.class === "Gun") {
      //     detectedWeapons.unshift(obj);
      //     console.log(obj.Text + "---------------------------");
      //     if (check === false) {
      //       // handleDetectedPersonsUpdate();
      //     }
      //   }
      // }
    }
  } else {
    console.log("Invalid Message Structure");
  }
});

client.on("close", () => {
  console.log(clientId + " disconnected");
});
