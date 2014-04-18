
// ROUTES FOR OUR API
// =============================================================================
var loginController = require('./controllers/login');// get an instance of the express Router


module.exports = function(router, passport){
    router.get('/', loginController.home);

    //Auth Routes
    router.post('/login',loginController.login);
    router.get('/login/register',loginController.registerPage);
    router.post('/login/register',loginController.registerPost);

}