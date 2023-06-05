const { check,validationResult } = require('express-validator')
const db = require('../db/db')



//check register
const password = check('password').isLength({ min:8, max: 15 }).withMessage('Pasword has to be between 8 and 15')
const email = check('email').isEmail().withMessage('invalid email')
const emailExists = check('email').custom(async (value)=>{
    const { rows } = await db.query('SELECT user_id FROM users WHERE email = $1',[value])
    //db.end()
    if (rows.length){
        throw new Error("Email already exist")
    }
})
//check inf   username,first_name, last_name, email, password, phone,  birthDay
const FullName = check('FullName').notEmpty().withMessage('FullName is required')
const Site = check('Site').isLength({ max: 20 }).withMessage('Site must be less then 20 caractere')
const Adresse = check('Adresse').isLength({ max: 20 }).withMessage('Adresse must be less then 20 caractere')
const PhoneNumber = check('PhoneNumber').matches(/^\+?\d{1,3}[-\s]?\d{3,8}$/).withMessage('Invalid phone number format') //isMobilePhone()
const Birthdate = check('Birthdate').isISO8601().withMessage('Invalid birth date format. Must be YYYY-MM-DD')





const check_job_id = check('id').custom(async (value)=>{
    const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM job_posts WHERE id = $1)',[value])
    //db.end()
    if (!rows[0].exists){
        throw new Error("job-post doesn t exist")
    }
})
//check inf
const title = check('title').notEmpty().withMessage('title is required')
const description = check('description').notEmpty().withMessage('description is required')
const company = check('company').notEmpty().withMessage('company name is required')
const assignments = check('assignments').notEmpty().withMessage('assignments is required')
const job_requirements = check('job_requirements').notEmpty().withMessage('job requirements is required')
const location = check('location').notEmpty().withMessage('location is required')
const salary = check('salary').isNumeric().withMessage('Invalid Salary number') 
const expire_at = check('expire_at').isISO8601().withMessage('Invalid date format. Must be YYYY-MM-DD')

//results
const validationMiddleware = (req, res, next)=>{
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

module.exports = {
    registerValidation: [password, email, emailExists, FullName, Site, Adresse, PhoneNumber, Birthdate],
    loginValidation: [password, email],
    PostValidation: [title, description, company, assignments, job_requirements, location, salary, expire_at],
    Check_post_exist: [check_job_id],
    validationMiddleware
}