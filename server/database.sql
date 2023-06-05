-- users table
CREATE TABLE users(
    user_id bigserial primary key,
    user_name varchar(255) not null,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    created_at date default current_date,
    birth_day date,
    phone_number varchar(14),
    role varchar(20)
);
41938516amr


CREATE TABLE userverification (
  user_id bigserial PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  uniqueString VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  expiresAt TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '48 HOUR'
);

CREATE TABLE job_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company TEXT NOT NULL,
    assignments TEXT NOT NULL,
    job_requirements TEXT NOT NULL,
    location TEXT NOT NULL,
    salary NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expire_at TIMESTAMP
);

CREATE TABLE JobApplication (
  id SERIAL PRIMARY KEY,
  job_post_id INT REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(255)
);

ALTER TABLE JobApplication 
ADD CONSTRAINT fk_cv_id 
FOREIGN KEY (cv_id) 
REFERENCES cv(id) 
ON DELETE CASCADE;





CREATE TABLE quizzes (
  quiz_id SERIAL PRIMARY KEY,
  quiz_name VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL,
  post_id INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES job_posts (id) ON DELETE CASCADE
);











  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CREATE TABLE Quiz (
  quiz_id INT NOT NULL AUTO_INCREMENT,
  quiz_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (quiz_id)
);

CREATE TABLE Question (
  question_id INT NOT NULL AUTO_INCREMENT,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  PRIMARY KEY (question_id),
  FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE
);

CREATE TABLE Option (
  option_id INT NOT NULL AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (option_id),
  FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE
);











  SELECT *
  FROM Quiz q
  LEFT JOIN Question qu ON q.quiz_id = qu.quiz_id
  LEFT JOIN Option o ON qu.question_id = o.question_id
  WHERE q.quiz_id = ?
  ORDER BY qu.question_id, o.option_id






    const quizId = req.params.quizId;

  // Query the database to retrieve the quiz and its questions and options
  connection.query(`
    SELECT *
    FROM Quiz q
    LEFT JOIN Question qu ON q.quiz_id = qu.quiz_id
    LEFT JOIN Option o ON qu.question_id = o.question_id
    WHERE q.quiz_id = ?
    ORDER BY qu.question_id, o.option_id
  `, [quizId], (err, rows) => {
    if (err) {
      console.error('Error retrieving quiz from database:', err);
      res.status(500).json({ error: 'Failed to retrieve quiz' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
    } else {
      // Transform the database rows into a JSON object
      const quiz = {
        quizId: rows[0].quiz_id,
        quizName: rows[0].quiz_name,
        quizDescription: rows[0].quiz_description,
        questions: []
      };
      let currentQuestion = null;
      for (const row of rows) {
        if (row.question_id !== currentQuestion?.questionId) {
          // Start a new question
          currentQuestion = {
            questionId: row.question_id,
            questionText: row.question_text,
            options: []
          };
          quiz.questions.push(currentQuestion);
        }
        // Add the option to the current question
        currentQuestion.options.push({
          optionId: row.option_id,
          optionText: row.option_text,
          isCorrect: row.is_correct
        });
      }
      res.json(quiz);
    }
  });



 SELECT * FROM job_posts
      WHERE 
        description ILIKE '%' || 'python' || '%' OR
        salary::text ILIKE '%' || 'python' || '%' OR
        title ILIKE '%' || 'python' || '%' OR
        assignments ILIKE '%' || 'python' || '%' OR
        job_requirements ILIKE '%' || 'python' || '%' OR
        company ILIKE '%' || 'python' || '%' OR
        location ILIKE '%' || 'python' || '%'
    ;