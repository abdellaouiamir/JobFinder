const { mlAPI } = require('../ML/FastAPI')
const db = require('../db/db')

exports.apply_job = async(req, res)=>{
    const candidate_id = req.user.id
    // const candidate_id = 8
    const { job_id, letter, cv_id } = req.body
    const result = await db.query(`SELECT * FROM JobApplication WHERE job_post_id = $1 AND applicant_id = $2;`,[job_id, candidate_id])
    if(!result.rows[0]){
        try{
        const d = await db.query(`INSERT INTO JobApplication (job_post_id, applicant_id, status, cover_letter, cv_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;`,[job_id, candidate_id, "applied", letter, cv_id])
            mlAPI(d.rows[0].id, cv_id)
            res.json({
                status:"Succes",
                msg: result.rows[0]
            })
        }catch(err){
            console.log(err)
            res.json({
                status:'Failed',
                msg: err
            })
        }
    }else if(result.rows[0].status === 'abandoned'){
        await db.query(`UPDATE JobApplication SET status = $1, cover_letter = $4, cv_id = $5 WHERE job_post_id = $2 AND applicant_id = $3;`,["applied", job_id, candidate_id, letter, cv_id]).then((result)=>{
        res.json({
            status:"Succes",
            msg: result.rows[0]
        })
    })
    }else{
        res.json({
            status:'Failed',
            msg:"already appliyed"
        })
    }
    
}

exports.abandon_job = async(req, res)=>{
    const user_id = req.user.id 
    const{ app_id }= req.body
    await db.query(`UPDATE JobApplication SET status = $1 WHERE id = $2 AND applicant_id = $3;`,['abandoned',app_id, user_id]).then((result)=>{
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

exports.consult_application_asCandidate = async(req, res)=>{
    const candidate_id= req.user.id
    await db.query(`SELECT JobApplication.*, users.full_name, users.email, job_posts.title
        FROM JobApplication
        JOIN job_posts ON JobApplication.job_post_id = job_posts.id
        JOIN users ON job_posts.user_id = users.user_id
        WHERE JobApplication.applicant_id = $1;`,[candidate_id]).then((result)=>{
            res.json({
                status:"Succes",
                msg: result.rows
            })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

exports.consult_application_asRecruiter = async(req, res)=>{
    const recruiter_id= req.user.id
    await db.query(`SELECT JobApplication.*, users.full_name ,users.email, job_posts.title
        FROM JobApplication 
        JOIN job_posts ON JobApplication.job_post_id = job_posts.id
        JOIN users ON JobApplication.applicant_id = users.user_id
        WHERE job_posts.user_id = $1;`,[recruiter_id]).then((result)=>{
            res.json({
                status:"Succes",
                msg: result.rows
            })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

// SELECT JobApplication.*, users.full_name, users.email, job_posts.title
// FROM JobApplication
// JOIN job_posts ON JobApplication.job_post_id = job_posts.id
// JOIN users ON job_posts.user_id = users.user_id
// WHERE JobApplication.applicant_id = $1;
// candidate 


// recruiter
// SELECT JobApplication.*, users.full_name ,users.email, job_posts.title
//         FROM JobApplication 
//         JOIN job_posts ON JobApplication.job_post_id = job_posts.id
//         JOIN users ON JobApplication.applicant_id = users.user_id
//         WHERE job_posts.user_id = $1;