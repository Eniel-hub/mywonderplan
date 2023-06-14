const db = require('../../_db/db.service');
const helper = require('../../utils/helper');

//Get 
const GetUser = async (username) =>{
    const result = await db.Query(
        'SELECT * FROM user WHERE username = ?',
        [username]
    );
    const user = helper.EmptyOrRows(result);
    return user;
}

const CreateUser = async(newUser) =>{     
    await db.Query(
        `INSERT INTO user (username, firstname, lastname, email, phone, hash, salt)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newUser.username, newUser.firstname, newUser.lastname, newUser.email,
            newUser.phone, newUser.hash, newUser.salt]
    );
}

const UpdateUser = async(updatedUser, userID) =>{     
    await db.Query(
        `UPDATE user  SET username = ?, firstname = ?, lastname = ?, email = ?, phone = ?
        WHERE id = ?`,
        [updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email,
            updatedUser.phone, userID]
    );
}

const ChangePassword = async (user) =>{
    await db.Query(
        `UPDATE user SET hash = ?, salt = ?
        WHERE username = ?`,
        [user.hash, user.salt, user.username]
    );
}

const setProfilePicture = async (profilePicture, user) => {
    await db.Query(
        'UPDATE user SET profile_picture = ? WHERE username = ?',
        [profilePicture, user.username]
    )
}

const deleteAcc = async (user) =>{
    await db.Query(
        `DELETE FROM user WHERE username = ?`,
        [user.username]
    )
}

module.exports = {
    GetUser,
    deleteAcc,
    CreateUser,
    UpdateUser,
    ChangePassword,
    setProfilePicture,
};