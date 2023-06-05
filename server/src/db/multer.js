const multer = require('multer')
const path = require('path')
const fs = require('fs');
const db = require('../db/db')

const Storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/Images/')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname))
    }
})


exports.upload = multer({ storage:Storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('file')   //5MB

exports.update_img = async (req, res) =>{
    const id = req.user.id
    const oldPath = await db.query(`SELECT img FROM users WHERE user_id = $1`,[id])
    db.query(`UPDATE users SET img = $1 WHERE user_id = $2`, [req.file.path, id]).then((result)=> {
        if(oldPath !== 'uploads/Images/default.png'){
            fs.unlink(oldPath.rows[0].img, (err)=>{
                if(err){
                    console.error(err)
                    return
                }
            })
        }
        res.status(200).json({ message: 'Image uploaded successfully', imagePath: req.file.path });
      }).catch((err)=>{
        res.status(400).json({ message: 'Error storing image path in database', error: err });
      })
}


exports.getImage = async (req, res) =>{
    const id = req.user.id
    db.query(`SELECT img FROM users WHERE user_id = $1`, [id]).then((result)=>{
        const imagePath = result.rows[0].img
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const image = fs.readFileSync(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/png' })
        res.end(image, 'binary')
    }).catch((error)=>{
        console.log(error)
    })
}
exports.getImage_by_id = async (req, res) =>{
    const email = req.header('email')
    db.query(`SELECT img FROM users WHERE email = $1`, [email]).then((result)=>{
        const imagePath = result.rows[0].img
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const image = fs.readFileSync(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/png' })
        res.end(image, 'binary')
    }).catch((error)=>{
        console.log(error)
    })
}



//CV
const Storage_cv = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/CVs/')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname))
    }
})




exports.upload_cv = multer({ storage:Storage_cv, limits: { fileSize: 5 * 1024 * 1024 } }).single('file')   //5MB

exports.save_resume=(req, res) =>{
    const id = req.user.id
    if (req.file.path){
        db.query(`INSERT INTO cv (user_id, file_path) VALUES ( $1, $2);`,[id, req.file.path]).then((result)=>{
            res.status(200).json({ message: 'Image uploaded successfully', imagePath: req.file.path });
        }).catch((err)=>{
            console.log(err)
            res.status(400).json({ message: 'Error storing image path in database', error: err });
        })
    }else{
        res.status(400).json({ message: 'Error storing image path in database', error: err });
    }
}



exports.getCV = async(req, res) =>{
    const id = req.header('id')
    const cvPath = await db .query(`SELECT file_path FROM cv WHERE id = $1`,[id])
    if (!fs.existsSync(cvPath.rows[0].file_path)) {
      return res.status(404).json({ message: 'CV not found' });
    }
    const cv = fs.readFileSync(cvPath.rows[0].file_path);
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    res.end(cv, 'binary');
}



exports.consult_cv = async (req, res)=>{
    const user_id = req.user.id
    await db.query(`SELECT * FROM cv WHERE user_id = $1;`,[user_id]).then((result)=>{
        res.json({
            status:"Succes",
            msg: result.rows
        })
    }).catch((err)=>{
        res.json({
            status: 'failed',
            msg: err 
        })
    })
}

exports.delete_cv = async (req, res)=>{
    const id = req.query.id
    const user_id = req.user.id
    const test = await db.query(`SELECT COUNT(*) > 0 AS test FROM JobApplication WHERE cv_id = $1 AND status = $2;`,[id , "abandoned"])
    if(test.rows[0].test){
        const oldPath = await db.query(`SELECT file_path FROM cv WHERE id = $1 AND user_id = $2`,[id, user_id])
        await db.query(`DELETE FROM cv WHERE id = $1 AND user_id = $2 RETURNING id`,[id, user_id]).then((result)=>{
            fs.unlink(oldPath.rows[0].file_path, (err)=>{
                if(err){
                    console.error(err)
                }
            })
            res.json({
                status: 'succes',
                msg: result
            })
        }).catch((err)=>{
            res.json({
                status: 'failed',
                msg: err
            })
        })
    }else{
        res.json({
            status:'failed',
            msg: 'you need to disable you application first '
        })
    }
}