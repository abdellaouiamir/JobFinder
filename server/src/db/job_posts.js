const db = require('../db/db')

exports.create_job_post = async(req,res)=>{
    const user_id = req.user.id
    const { title, description, company, assignments, job_requirements, location, salary, expire_at }= req.body
    await db.query(
        `INSERT INTO job_posts (user_id, title, description, company, assignments, job_requirements, location, salary, expire_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [user_id, title, description, company, assignments, job_requirements, location, salary, expire_at]
    ).then((result)=>{
        res.json({
            status:"Success",
            msg:result.rows[0].id
        })
    }).catch((error)=>{
        res.json({
            status:'Failed',
            msg:error
        })
    })
}

exports.delete_job_post = async(req,res)=>{
    const user_id = req.user.id
    const id= req.query.id;
    await db.query(
        `DELETE FROM job_posts WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, user_id]
    ).then((result)=>{
        console.log(result)
        res.json({
            status:"Success",
            msg:"post delete it"+ result
        })
    }).catch((error)=>{
        console.log(error)
        res.json({
            status:"Failed",
            msg:error
        })
    })
}

exports.consult_job_post = async(req, res)=>{
    const job_id = req.query.id;
    await db.query(`SELECT * FROM job_posts WHERE id=$1`,[job_id]).then((result)=>{
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

exports.update_job_post = async(req, res)=>{
    const { title, description, company, assignments, job_requirements, location, salary, expire_at, id }= req.body
    await db.query(
        `UPDATE job_posts SET title = $1, description = $2, company = $3, assignments = $4, job_requirements = $5, location = $6, salary = $7, expire_at = $8 WHERE id = $9`,
        [title, description, company, assignments, job_requirements, location, salary, expire_at, id]
    ).then((result)=>{
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

exports.get_posts = async(req, res)=>{
    await db.query(
        `SELECT job_posts.*, users.email FROM job_posts JOIN users ON job_posts.user_id = users.user_id ORDER BY created_at;`
    ).then((result)=>{
        res.json({
            status:"Succes",
            msg:result.rows
        })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

exports.get_recruiter_posts = async(req, res)=>{
    const user_id = req.user.id
    await db.query(
        `SELECT * FROM job_posts WHERE user_id=$1 ORDER BY created_at;`,[user_id]
    ).then((result)=>{
        res.json({
            status:"Succes",
            msg:result.rows
        })
    }).catch((error)=>{
        res.json({
            status:"Failed",
            msg: error
        })
    })
}

exports.search = async(req, res)=>{
    try {
        const { query } = req.query;
        
        const result = await db.query(
          `SELECT * FROM job_posts
          WHERE 
            description ILIKE '%' || $1 || '%' OR
            salary::text ILIKE '%' || $1 || '%' OR
            title ILIKE '%' || $1 || '%' OR
            assignments ILIKE '%' || $1 || '%' OR
            job_requirements ILIKE '%' || $1 || '%' OR
            company ILIKE '%' || $1 || '%' OR
            location ILIKE '%' || $1 || '%'
        ;`,
          [`%${query}%`]
        );
        
        res.json({
          status: "Success",
          data: result.rows
        });
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
}

