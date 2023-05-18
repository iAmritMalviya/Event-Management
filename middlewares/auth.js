
const auth = module.exports
 auth.isLoggedIn = function (req, res, next) {
    req.uid = 336 
    return next() 
}