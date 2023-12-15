const{FeeSplit,Fee} =require("../models")
module.exports={
    async deposit(req,res){
        const {amount,merchant_id,order_id}=req.body
        const fee=await Fee.create({
            amount:amount,
            merchant_id: merchant_id,
            order_id:order_id
        })

        const merchant =60/100 * amount
        const agent =40/100 *amount
        const split =await FeeSplit.create({
            fee_id:fee.id,
            merchant_amt: merchant,
            agent_amt: agent,
            agent_id:agent_id,
            merchant_id:merchant_id
        })
    }
}