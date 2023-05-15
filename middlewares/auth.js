
const auth = module.exports
 auth.isLoggedIn = function (req, res, next) {
    req.uid = 336 
    // auth logic will be here
    return next() 
}