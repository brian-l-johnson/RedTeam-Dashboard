exports.isAuthenticated = () => { 
    return function(req, res, next) {
        console.log(req.session);
        if(req.session.authenticated) {
            next();
        }
        else{
            console.log(req.baseUrl)
            console.log(req.session);
            console.log("user is not logged in, sending 401")
            return res.status(401).send({"error": "not logged in"});	
        }
    }
};

exports.hasRole = (role) => {
    return function(req, res, next) {
        if(req.session.user.permissions.indexOf(role) > -1) {
            next();
        }
        else {
            console.log("user does not have required permission:"+role);
            return res.status(403).send({"error": "permission denied"});
        }
    }
}

