const Discount = require("../models/Discount"); // بدون {}





exports.applyDiscount = async (req,res)=> {
    const code = req.body.code;
    if(!code){
        return res.status(400).json({ message: 'Code is required' });
    }
    try {
        const discount = await Discount.findOne({
            where: {
                code: code
            }
        });
        if(!discount){
            return res.status(404).json({ message: 'Discount code not found' });
        }
        res.status(200).json({ message: 'Discount code found', discount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


exports.addDiscount = async (req,res)=>{
try{
    const {
        code,
        discount,
        type,
    }=req.body
    if (!code || !discount || !type){
        return res.status(400).json({message:"missing data"})
    }

    const Promo = await Discount.create({
        code,
        discount,
        type,
    })
    return res.status(201).json({ message: "Discount created", promo: Promo });

}
catch(error){
    res.status(400).json({ message: 'Invalid data', error: error.message });

}
}