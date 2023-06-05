const bycrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

//secret
const { SECRET } = require('../constants')
// database postgrsql
const db = require('../db/db')
const { generateOTP, sendOTP } = require('../db/otp')

//auth middlewares
exports.register = async(req, res)=>{
    const { FullName, Site, Adresse, email, password, PhoneNumber,  Birthdate, Role } = req.body
    try{
        const hashedPassword = await bycrpt.hash(password,SECRET)
        await db.query('INSERT INTO users (full_name, site, addresse, email, password, phone_number, birth_day, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',[
            FullName, Site, Adresse, email, hashedPassword, PhoneNumber,  Birthdate, Role
        ]).then(()=>{
            //db.end()
            // sendVerificationEmail(email, res)
            res.status(201).json({
            success: true,
            message: 'The registraion was succefull',
        })
        }).catch((error)=>{
            //db.end()
            res.status(500).json({
                error: error.message,
            })
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}

exports.login = async (req, res) => {
    const { email, password} = req.body
    const user = await db.query('SELECT * from users WHERE email = $1', [email])
    //db.end()
    if(user.rows.length){
        const validPassword = await bycrpt.compare(password, user.rows[0].password)
        if (validPassword && user.rows.length) {
            let payload = {
                id: user.rows[0].user_id,
                email: user.rows[0].email,
            }
            try {
                const token = await jwt.sign(payload, SECRET, {expiresIn:'15 days'})
                return res.status(200).json({
                    status: true,
                    token: token,
                    role: user.rows[0].role
                })
            } catch (error) {
                return res.status(500).json({
                    error: error.message,
                })
            }
        }else{
            res.status(401).json({
                status:false,
                message:'Wrong Password or Email'
            })
        }
    }else{
        res.status(401).json({
            status:false,
            message:'Wrong Password or Email'
        })
    }
    
}

// exports.logout = async (req, res) => {
//     try {
//         return res.status(200).clearCookie('token', { httpOnly: true }).json({
//         success: true,
//         message: 'Logged out succefully',
//         })
//     }catch (error) {
//         console.log(error.message)
//         return res.status(500).json({
//         error: error.message,
//         })
//     }
// }



exports.verifyEmail = async(req, res)=>{
    let { email } = req.body
    db.query('UPDATE users SET verify = true WHERE email = $1;',[email])
    db.query('DELETE FROM userverification WHERE email = $1;',[email]).then(()=>{
        res.json({
            status:"SUCCES",
            message:"Email verified"
        })
    }).catch((error)=>{
        res.json({
            status:"FAILED",
            message:"Somthing wrong try again"
        })
    })
}
exports.updatePassword = async(req, res)=>{
    let { email, password } = req.body
    const hashedPassword = await bycrpt.hash(password,SECRET)
    db.query('UPDATE users SET password = $1 WHERE email = $2;',[hashedPassword, email]).then(()=>{
        res.json({
            status:"SUCCES",
            message:"password changed"
        })
    }).catch((error)=>{
        res.json({
            status:"FAILED",
            message:error
        })
    })
}
exports.changePassword = async(req, res)=>{
    const user_id = req.user.id
    const { password } = req.body
    const hashedPassword = await bycrpt.hash(password,SECRET)
    db.query('UPDATE users SET password = $1 WHERE user_id = $2;',[hashedPassword, user_id]).then(()=>{
        res.json({
            status:"SUCCES",
            message:"password changed"
        })
    }).catch((error)=>{
        res.json({
            status:"FAILED",
            message:error
        })
    })
}

exports.SendVerificationEmail = async(req, res)=>{
    const { email } = req.body
    const { rows } = await db.query('SELECT user_id FROM users WHERE email = $1;',[email]).catch((error)=>{
        console.log(error)
    })
    if(!rows.length){
        res.json({
            status:'FAILED',
            message: 'invalid email'
        })
    }else{
        const id = rows[0].user_id
        const otp = await generateOTP()
        const mailOptions = {
            email: email,
            subject: "Verify Email",
            message: `Verify your email address to complete the signup and login into your accout.This code expires in 1 hours. ${otp}`
        }
        const hashedOTP = await bycrpt.hash(otp, SECRET)
        try {
            await db.query("INSERT INTO userverification (user_id, uniqueString, email) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET uniqueString = $2;", [id, hashedOTP, email])
            await sendOTP(mailOptions)
            res.json({
              status: 'SUCCESS',
              message: 'verification code sent to your email'
            });
        } catch (error) {
            res.json({
              status: 'FAILED',
              message: error
            });
            return; // Exit the middleware when an error occurs
        }
    }
}