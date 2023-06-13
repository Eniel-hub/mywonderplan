const service = require('./user.service');
const pportMiddleware = require('../../auth/passport.middleware');
const helper = require('../../utils/helper')

const GetUserInfo = async(req, res, next) =>{
    let [user, ] = await service.GetUser(req.user);
    return res.status(200).json({
        username : user.username, 
        firstname : user.firstname,
        lastname : user.lastname,
        email : user.email,
        phone : user.phone
    });
}

const Logout = async(req, res, next) =>{
    req.logOut((err) => {
        if (err) { 
            res.status(400).json({error:'error on logout'})
            return next(err);
        }
        res.status(200).json({success:true})
    });
}

const DeleteAcc = async (req, res, next) =>{
    let [user, ] = await service.GetUser(req.user);
    await userService.deleteAcc(user)
    res.status(200).json({success:true})
}

const CreateUser = async (req, res, next) =>{
    const user = req.body;
    let isFound = ''
    isFound = await service.GetUser(user.username)
    if(isFound != '')
        return res.status(400).json({error : 'username used'})
    try {
        password = helper.GenPassword(user.password)
        let newUser = {
            ...user,
            hash: password.hash,
            salt: password.salt
        }
        await service.CreateUser(newUser);
        res.status(200).json({success : true});
    } catch (err) {
        console.log(`error while creating new user ${err.message}`);
    }
}

const verifyEmail = async (email)=>{
    //todo create code
    // let code = helper.createVerificationCode(Date())

}

const updateUser = async(req, res, next) =>{   
    let [user, ] = await service.GetUser(req.user);
    let updatedUser = req.body
    let emailUpdated = !(user.email == updatedUser.email)
    let usernameUpdated = !(user.username == updatedUser.username);
    if(usernameUpdated){
        let isFound = ''
        isFound = await service.GetUser(updatedUser.username)
        if(isFound != '')
            return res.status(400).json({error : 'username used'})
    }
    try{
        updatedUser = {
            ...updatedUser,
            statut : emailUpdated? 'Pending' : 'Active'
        }
        await service.UpdateUser(updatedUser, user.id);
        return res.status(200).json({success : true})
    } catch (err) {
        console.log('an error occured while updating the user info ', err.message)
    }
}

const updatePassword = async (req, res, next) =>{
    let username = req.user;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    if(!newPassword)
        return res.status(400).json({error: "no new password"})
    let [user, ] = await service.GetUser(username)
    if(pportMiddleware.CheckPassword(password, user.hash, user.salt)){
        try {
            if(pportMiddleware.CheckPassword(newPassword, user.hash, user.salt))
                return res.status(400).json({error : "old password"})

            let pass = helper.GenPassword(newPassword);
            const User = {
                username : username,
                hash: pass.hash,
                salt: pass.salt
            }
            await service.ChangePassword(User);
            return res.status(200).json({success : true});
        } catch (err) {
            console.log(`error while updating password ${err.message}`);
            return res.status(400).json({error : "an error occured while updating the password"})
        }
    }
    else {
        return res.status(400).json({error : "wrong password"})
    }
}

const forgetPassword = async (req, res, next) =>{
    //todo: forget password
}

module.exports = {
    Logout,
    CreateUser,
    updateUser,
    updatePassword,
    forgetPassword,
    GetUserInfo,
    verifyEmail,
    DeleteAcc
}