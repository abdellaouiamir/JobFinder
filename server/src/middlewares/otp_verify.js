const { compare } = require('bcrypt')
const db = require('../db/db')

exports.verify = async (req, res, next)=>{
    let { email, OTP} = req.body
    const { rows } = await db.query('SELECT user_id, uniquestring FROM userverification WHERE email = $1',[email]).catch((error)=>{
        throw Error(error)
    })
    if (rows.length){
        if(rows.expiresAt < Date.now()){
            await db.query('DELETE FROM userverification WHERE user_id = $1',[id])
            res.json({
                status:"FAILED",
                message: "Your validation OTP expires. Please sign up again"
            })
        }else{
            const result = await compare(OTP, rows[0].uniquestring)
            if(result){
                await db.query("DELETE FROM userverification WHERE uniqueString = $1;", [rows[0].uniquestring])
                next()
            }else{
                res.json({
                    status:"FAILED",
                    message: "Your validation OTP is wrong. Please try again"
                })
            }
        }
    }else{
        res.json({
            status:"FAILED",
            message: "An error occured while checking for existing user verification. Please sign up again"
        })
    }
}