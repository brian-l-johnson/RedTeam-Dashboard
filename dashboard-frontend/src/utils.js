export function checkPermissions(requiredPermission) {
    let promise = new Promise(function(resolve, reject) {
        console.log("checking if logged in");
        fetch(window.API_URL+'/auth/permissions', {credentials: 'include'})
        .then(response => {
            if(!response.ok) {
              resolve(false);
            }
            console.log("logged in");
            resolve(true);
        },
        error => reject(error))
    }) 
    return promise;

  }