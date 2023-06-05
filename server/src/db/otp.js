const nodemailer = require('nodemailer')

const { SEND_EMAIL, EMAIL_PASSWORD } = require('../constants')

exports.generateOTP = async()=>{
    try{
        return (otp = `${Math.floor(100000 + Math.random()*900000)}`)
    }catch(error){
        throw Error(error)
    }
}

exports.sendOTP = async({ email, subject, message, duration = 1})=>{
    try{
        if(!(email && subject && message)){
            throw Error("provide values for email , subject and message")
        }
        const mailOptions = {
            from: SEND_EMAIL,
            to: email,
            subject: subject,
            html:message
        }
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: SEND_EMAIL,
                pass: EMAIL_PASSWORD
            }
        })
        await transporter.sendMail(mailOptions)
    }catch(error){
        throw Error(error)
    }
}
