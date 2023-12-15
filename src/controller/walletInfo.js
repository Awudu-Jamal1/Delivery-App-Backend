const {Wallet} =require('../models')

module.exports={
    async info(req,res){
        const wallet = await Wallet.findOne({where:req.body})
        res.send(wallet)
        
    }
}