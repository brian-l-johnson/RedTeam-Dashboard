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

  export function sortHosts(hostArray) {
    return hostArray.sort(function(a, b) {
        let ipa = a.ip.split('.');
        let ipb = b.ip.split('.');
        for(var i = 0; i<ipa.length; i++) {
            if((ipa[i] = parseInt(ipa[i])) < (ipb[i] = parseInt(ipb[i]))) {
                return -1;}
            else if (ipa[i] > ipb[i]) {
                return 1;
            }
        }
        return 0;
    });
}