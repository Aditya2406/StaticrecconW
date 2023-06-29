function ajax(payload, action)
      {
              const xhr = new XMLHttpRequest();
              xhr.responseType = 'json';
              xhr.open('POST', action_url);
              xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              xhr.send(JSON.stringify(payload))
              console.log(payload);
              xhr.onload = function() {
                  const response = xhr.response;
                  console.log(response);
                  if(response.action == 'cameraIndex')
                  {
                    if(response.Status == 200){
                        console.log(response);
                    }
                }
            }
        }