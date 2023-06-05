const http = require('http');
const db = require('../db/db')

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};



exports.mlAPI = async (id, cv)=>{
    console.log('hi2')
    const result = await db.query(`SELECT applicant_id, job_post_id FROM JobApplication WHERE id = $1`,[id])
    const user_id = result.rows[0].applicant_id
    const post_id = result.rows[0].job_post_id
    let cv_path = await (await db.query('SELECT file_path FROM cv WHERE id = $1',[cv])).rows[0].file_path
    cv_path =  "C:\\Users\\abdel\\Desktop\\PFE\\MainApp\\server\\" + cv_path
    const post_data = (await db.query('SELECT * FROM job_posts WHERE id = $1',[post_id])).rows[0]
    const data_post = post_data.title + " " + post_data.description + " " + post_data.company + " " + post_data.assignments + " " + post_data.job_requirements
    const data = JSON.stringify({
        cv: cv_path,
        jd: data_post
      });
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        let data = ""
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end',()=>{
            const json = JSON.parse(data)
            db.query('UPDATE JobApplication SET score = $1 WHERE applicant_id = $2 AND job_post_id = $3',[json.score, user_id, post_id])
        })
    });
      
    req.on('error', (error) => {
        console.error(error);
    });
      
    req.write(data);
    req.end();
}

