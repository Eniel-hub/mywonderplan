const service = require('./transactions.service');
const pportMiddleware = require('../../auth/passport.middleware');

const GetHistory =  async (req, res, next) => { 
    let user = await pportMiddleware.GetUser({username : req.user});
    let userID = user.id;
    try {
        const history = await service.GetTransactionHistory(userID);
        res.status(200).json({history})
    } catch (err) {
        console.log(`an error occured while getting the history : ${err.message}`);
        res.status(404).json({error: err.message})
    }
}

const GetHistoryDetails = async (req, res, next) =>{
    let transactionId = req.query.tranid

    try {
        const details = await service.GetTransactionHistoryDetails(transactionId);
        res.json({details})
    } catch (err) {
        console.log(`une erreure c'est produite au moment de retrouver les details: ${err.message}`);
        res.status(404).json({error: err.message})
    }
}

const SaveTransaction = async (req, res, next) =>{
    let user = req.user
    let body = req.body;
    let d = new Date()
    let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`

    //save transaction first
    let transaction = {
        user_id : user,
        date : date,
        date_de_depart : body.date_de_depart,
        date_d_arriver : body.date_d_arriver
    }

    await service.SaveTransaction(transaction);

    //save activities
    let activites = [
        
    ]
}

module.exports = {
    GetHistory,
    GetHistoryDetails,
    SaveTransaction
}