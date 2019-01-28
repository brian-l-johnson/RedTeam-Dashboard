exports.isAuthenticated = () => { 
    return function(req, res, next) {
        if(req.session.authenticated) {
            next();
        }
        else{
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
            return res.status(403).send({"error": "permission denied"});
        }
    }
}

