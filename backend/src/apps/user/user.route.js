const passport = require('passport');
const router = require ('express').Router();
const middleware = require('./user.middleware');
const auth = require('../../auth/AuthAndAut');

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', (err, user, info)=>{
        if(err) return next(err);
        if(!user) return res.status(400).json({error : info.error});
        req.logIn(user, (err) =>{
            if(err) return next(err);
            req.session.user = user;
            return res.status(200).json(user);
        });
    })(req, res, next)
})

router.get('/', auth.IsAuth, middleware.GetUserInfo)

router.get('/logout', auth.IsAuth, middleware.Logout);

router.get('/delete', auth.IsAuth, middleware.DeleteAcc);

router.get('/veremail', auth.IsAuth, middleware.verifyEmail);

router.post('/register',  middleware.CreateUser);

router.post('/fpassword', middleware.forgetPassword);

router.post('/update', auth.IsAuth, middleware.updateUser);

router.post('/password', auth.IsAuth, middleware.updatePassword);

router.post('/ppicture', auth.IsAuth, middleware.profilePicture)

//todo: save profile picture
module.exports = router;
