let username;
let password;
let action = "Adminlogin";

function signin() {
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;
  let payload = {
    action: action,
    username: username,
    password: password,
  };

  ajax(payload, payload.action);
}

// function signin() {
//   let payload = {
//     action: "Get_Logs",
//   };

//   ajax(payload, payload.action);
// }

function ajax(payload, action) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", "http://13.234.211.133:85/actions");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send(JSON.stringify(payload));
  console.log(payload);
  xhr.onload = function () {
    const response = xhr.response;
    console.log(response);
    if (response.action == "Adminlogin") {
      if (response.Status == 100) {
        Swal.fire({
          text: "Sorry, the username and password are incorrect, please try again.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } else if (response.Status == 200) {
        Swal.fire({
          text: "You have successfully logged in!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(function (result) {
          if (result.isConfirmed) {
            if (response.Camera.length > 0) {
              // Camera array is not empty
              const notRunningCameras = response.Camera.filter(
                (camera) => camera.running === false
              );
              const notRunningCameraIndices = notRunningCameras.map(
                (camera) => camera.index
              );

              if (notRunningCameraIndices.length > 0) {
                // There are cameras not running
                console.log("Cameras not running. Performing action A.");
                console.log(
                  "Indices of not running cameras:",
                  notRunningCameraIndices
                );
                // Perform action A
                var payload = {
                  action: "Camera_Selection",
                  Camera: notRunningCameraIndices,
                  Username: "Administrator",
                };
                ajax(payload, payload.action);
              } else {
                // All cameras are running, do something else
                console.log("All cameras are running. Performing action B.");
                // Perform action B
                location.href = "/surveillance";
              }
            } else {
              // Camera array is empty, do something else
              console.log("Camera array is empty. Performing action C.");
              // Perform action C
              location.href = "/onboarding";
            }
            /////
            if (response.Camera.length > 0) {
              // Camera array is not empty
              const isAnyCameraRunning = response.Camera.some(
                (camera) => camera.running === false
              );

              if (isAnyCameraRunning) {
                // At least one camera is not running, do something
                console.log(
                  "At least one camera is not running. Performing action A."
                );
                // Perform action A
                location.href = "/onboarding";
              } else {
                // All cameras are running, do something else
                console.log("All cameras are running. Performing action B.");
                // Perform action B
                ocation.href = "/surveillance";
              }
            } else {
              // Camera array is empty, do something else
              console.log("Camera array is empty. Performing action C.");
              // Perform action C
              location.href = "/onboarding";
            }
          }
        });
      }
    } else if (response.action == "Camera_Selection") {
      if (response.Status == 200) {
        location.href = "/surveillance";
      }
    }
  };
}
