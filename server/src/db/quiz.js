const db = require('../db/db')

exports.addQuiz = async (req, res)=>{
  try {
    const { quizName, questions, post_id } = req.body;
    let t = JSON.stringify(questions)
    const existingQuiz = await db.query('SELECT * FROM quizzes WHERE post_id = $1', [post_id]);
    if (existingQuiz.rows.length > 0){
      const result = await db.query(
        'UPDATE quizzes SET quiz_name = $1, questions = $2 WHERE post_id = $3',
        [quizName, t, post_id]
      );
    }
    else{
      const result = await db.query('INSERT INTO quizzes (quiz_name, questions, post_id) VALUES ($1, $2, $3)', [quizName, t, post_id]);
    }
    res.json({
      status:"Success",
    })
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

exports.getQuiz = async (req, res)=>{
  try {
    const result = await db.query('SELECT * FROM quizzes WHERE quiz_id = $1', [req.query.id]);
    if (result.rows.length > 0) {
      const { quiz_name, questions } = result.rows[0];
      res.json({ quizName: quiz_name, questions: questions });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

exports.checkQuiz = async (req, res)=>{
  try {
    const result = await db.query('SELECT * FROM quizzes WHERE post_id = $1', [req.query.id]);
    if (result.rows.length > 0) {
      res.json({ quiz_id: result.rows[0].quiz_id });
    } else {
      res.json({ quiz_id: false });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

exports.saveScore = async (req, res)=>{
  try{
    const score = req.query.score
    const id_quiz = req.query.id
    const integerNumber = Math.floor(score);
    const user_id = req.user.id
    const post_id = await (await db.query('SELECT post_id FROM quizzes WHERE quiz_id = $1',[id_quiz])).rows[0].post_id
    await db.query('UPDATE JobApplication SET quiz_score = $1 WHERE applicant_id = $2 AND job_post_id = $3',[integerNumber, user_id, post_id]).then((result)=>{
      res.json({status:"Success"})
    }).catch((err)=>{
      res.json({err:err})
    })
  }catch(error){
    res.sendStatus(500)
  }
}