export function checkPermissions(requiredPermission) {
    let promise = new Promise(function(resolve, reject) {
        console.log("checking if logged in");
        fetch(window.API_URL+'/auth/permissions', {credentials: 'include'})
        .then(response => {
            if(response.status === '401') {
              resolve(false);
            }
            console.log("logged in");
            return response.json();
        },
        error => reject(error))
        .then(permissions => {
            console.log(permissions);
            if(permissions.indexOf(requiredPermission) > -1) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
    }) 
    return promise;

  }