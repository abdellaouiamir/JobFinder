const db = require('../db/db')

exports.get_profile = async(req, res)=>{
    const { id }= req.user
    await db.query(`SELECT  full_name, addresse, email, birth_day, phone_number, site FROM users WHERE user_id = $1`,[id]).then((result)=>{
        const utcDate = new Date(result.rows[0].birth_day.toISOString());
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        result.rows[0].birth_day = localDate.toISOString().slice(0, 10);
        res.json({
            status:"Succes",
            msg: result.rows[0]
        })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

exports.get_profile_2 = async(req, res)=>{
    const email= req.header('email')
    await db.query(`SELECT  full_name, addresse, email, birth_day, phone_number, site FROM users WHERE email = $1`,[email]).then((result)=>{
        const utcDate = new Date(result.rows[0].birth_day.toISOString());
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        result.rows[0].birth_day = localDate.toISOString().slice(0, 10);
        res.json({
            status:"Succes",
            msg: result.rows[0]
        })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

exports.update_profile = async(req, res)=>{
    const user_id = req.user.id
    const { FullName, Adresse, email, PhoneNumber,  Birthdate, site } = req.body
    await db.query(`UPDATE users SET full_name = $1, addresse = $2, email = $3, birth_day = $4, phone_number = $5, site = $6 WHERE user_id = $7`,[FullName, Adresse, email,  Birthdate, PhoneNumber, site, user_id]).then((result)=>{
        res.json({
            status:"Succes",
            msg: result
        })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}
