const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

//env variable
const lemail = 'abdellauiahmed2222@gmail.com'
const password = 'rkazpgtzksgraffb'
SECRET = "$2b$10$d/u81L5J1MN4Im/9n3AXUO"

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: lemail,
        pass: password
    }
})

transporter.verify((error, success)=>{
    if(error){
        console.log(error)
    }else{
        console.log("ready for message")
        console.log(success)
    }
})

const sendverificationemail = ({email})=>{ // id ,     //res  response
    //url to be used in the email
    const currentUrl = 'http://localhost:3000'
    //verification string
    //const uniquestring = "23465"

    // mail option
    const mailOptions = {
        from: lemail,
        to: email,
        subject: "verify email",
        html:`<p>hello</p><a hrep:"${currentUrl + "user/verify"}"`
    }
    //hash the uniquString and saved to the database
    // bcrypt.hash(uniquestring,SECRET).then((hashedstring)=>{
    //     const rows = db.query("queery") //register hash string
    // })
    // add this part to de.query.then()
    transporter.sendMail(mailOptions).then(()=>console.log('sent complete')).catch((error)=>console.log(error))
}

//sendverificationemail({email:"abdellaouiamir27@gmail.com"})

