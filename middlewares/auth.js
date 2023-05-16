
const auth = module.exports
 auth.isLoggedIn = function (req, res, next) {
    req.uid = 336 
    console.log(req.body, "asdfasdf")
    // auth logic will be here
    return next() 
}