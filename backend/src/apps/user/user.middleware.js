const nodemailer = require('nodemailer');
require('dotenv').config();
const env = process.env;

const pportMiddleware = require('../../auth/passport.middleware');
const helper = require('../../utils/helper');
const service = require('./user.service');
const TOTP = require('../../utils/TOTP');

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

const verifyEmailGetCode = async (req, res, next)=>{
    // let [user, ] = await service.GetUser(req.user);
    let [User, ] = await service.GetUser('user1');

    User.verification_code = TOTP.generateAuthCode(env.OTPSECRET, 0) //code can be updated after a minute
    await service.saveCode(User)
    setTimeout(async () => {
        user.verification_code = null;
        await service.saveCode(User);
    }, 10*60*1000); //10min later the code will be erased from the database

    const config = {
        host: 'smtp.mail.com',
        port: 465,
        secure: true, // Set to true if you want to use a secure connection (e.g., SSL/TLS)
        auth: {
            user: env.EMAIL,
            pass: env.PSW
        }
    }
    const transport = nodemailer.createTransport(config);

    const mailOptions = {
        from: env.EMAIL,
        to: User.email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${User.firstname}</h2>
            <p>Thank you for subscribing. Please confirm your email 
            by entering the code <b>${User.verification_code}</b></p>
            </div>`
      };

    // Send the email
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occured while sending mail', error);
            return res.status(400).json({error : error})
        }
        console.log(info)
    });

    return res.status(200).json({verification_code : User.verification_code})
}

const verifyEmailConfirmCode = async (req, res, next) =>{
    let code = req.body.code;
    let [user, ] = await service.GetUser(req.user);

    if(user.verification_code == code){
        await service.SetUserActive(user);
        return res.status(200).json({success : true})
    }
    return res.status(400).json({error : 'code incorrect'})
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

const profilePicture = async (req, res, next) => {
    const [user, ] = await service.GetUser('user2')
    // const [user, ] = await service.GetUser(req.user)
    const img = req.files.img;
    // If no image submitted, exit
    if (!img) 
    return res.status(400).json({error: 'no file found'});
    //if not an image exit     
    if (!img.mimetype.match('image')) {
        return res.status(400).json({error: 'file is not an image'})
    }
    //change img name
    const ext = '.'+img.mimetype.substring(6);
    img.name = `user_00${user.id}${ext}`

    const imgPath = process.cwd() +'/public/profilepictures/' + img.name;
    
    // save the img path to databse
    img.mv(imgPath).then(async () =>{ 
        try{
            await service.setProfilePicture(imgPath, user)
            res.status(200).json({success : true})
        } catch(err){
            console.log(`an error occured while changing the profile picture ${err}`)
            res.status(400).json({error : err})
        }
    })
}

module.exports = {
    Logout,
    DeleteAcc,
    CreateUser,
    updateUser,
    GetUserInfo,
    updatePassword,
    forgetPassword,
    profilePicture,
    verifyEmailGetCode,
    verifyEmailConfirmCode,
}