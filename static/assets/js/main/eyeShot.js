let camStatus;
let name;
let unique_id = document.getElementById("unique_id").value;
let designation = document.getElementById("designation").value;
let rank = document.getElementById("rank").value;
// Initialize array to store captured images
let imagesArray = [];
//general functions
document.getElementById("name").addEventListener("keyup", function(event) {
    name = document.getElementById("name").value;
    document.getElementById('nameUpdate') = name;
    // if (event.key === "Enter") {
      
    // }
  });


document.getElementById("unique_id").addEventListener("keyup", function(event) {
    unique_id = document.getElementById("unique_id").value;
    document.getElementById('idUpdate') = unique_id;
    // if (event.key === "Enter") {
      
    // }
  });


window.onload = function () {
  // Your code here
  startCamera();
};

// Get capture button
// const captureBtn = document.getElementById("captureBtn");
function capture() {
  document.getElementById("unique_id").value;
  for (let i = 0; i < 100; i++) {
    unique_id = document.getElementById("unique_id").value;
    captureSnapshot(unique_id);
    sendImages(imagesArray);
    console.log(i + "snapshot captured");
    if (i == 99) {
      Swal.fire({
        text: "Face captured successfully",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then(function (result) {
        if (result.isConfirmed) {
          console.log("refresh...");
          //   location.href = "/bulkOnboarding";
        }
      });
    }
  }
}

function startCamera() {
  const video = document.getElementById("video");
  video.style.display = "flex";
  const canvas = document.getElementById("canvas");
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      camStatus = 1;
    })
    .catch((error) => {
      console.error(`Failed to access camera: ${error}`);
      camStatus = 0;
      Swal.fire(
        "Failed to access camera. Please grant camera access to use this feature."
      );
    });

  video.addEventListener("error", (event) => {
    if (event.target.error.code === 1) {
      console.error(
        "Camera access denied. Please grant camera access to use this feature."
      );
      Swal.fire(
        "Camera access denied. Please grant camera access to use this feature."
      );
      camStatus = 0;
      stopCamera();
      startCamera();
    }
  });
}

// Stop video stream
function stopCamera() {
  if (camStatus == 1) {
    clearInterval(intervalId);
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    video.srcObject = null;
  } else {
    //do nothing
  }
}

function captureSnapshot(unique_id) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
  imagesArray.push(dataURL);
}

// Add event listener to capture button
// captureBtn.addEventListener("click", capture);

// Function to send images via XMLHttpRequest
function sendImages(images) {
  const payload = {
    action: "eyeshotCapture",
    ID: unique_id,
    Images: imagesArray,
  };
  ajax(payload, payload.action);
  console.log(payload);
}

function complete(){
    var payload={
        action:'Create_Personal',
        person:{name:name,unique_id:unique_id,rank:rank,designation:designation, photoUploaded:true},
    };

    ajax(payload, payload.action);
}

function ajax(payload, action) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", "/actions");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send(JSON.stringify(payload));
  console.log(payload);
  xhr.onload = function () {
    const response = xhr.response;
    console.log(response);
    if (response.action == "eyeshotCapture") {
      if (response.Status == 100) {
        Swal.fire({
          text: "please capture your face again.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } else if (response.Status == 200) {
        // Swal.fire({
        //   text: "Face captured successfully",
        //   icon: "success",
        //   buttonsStyling: false,
        //   confirmButtonText: "Ok, got it!",
        //   customClass: {
        //     confirmButton: "btn btn-primary",
        //   },
        // }).then(function (result) {
        //   if (result.isConfirmed) {
        //     console.log("refresh...");
        //     location.href='/bulkOnboarding';
        //   }
        // });
      }
    }
  };
}
