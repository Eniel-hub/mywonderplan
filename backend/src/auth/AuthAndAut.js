
//Auth
const IsAuth = (req, res, next) =>{
    next(); //just for testing reason
    // if(req.isAuthenticated()){
    //     next();
    // } 
    // else {
    //     res.json({isAuth : false});
    //     console.log('not authenticated')
    // }
}


module.exports = {
    IsAuth
}