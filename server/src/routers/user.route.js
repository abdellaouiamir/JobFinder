const express = require('express')
const bodyParser = require('body-parser')

//export
const { register, login, SendVerificationEmail, verifyEmail, updatePassword, changePassword } = require('../controllers/user.auth')
const { registerValidation, validationMiddleware, loginValidation, PostValidation, Check_post_exist } = require('../middlewares/validator')
const { userAuth } = require('../middlewares/passport')
const { verify } = require('../middlewares/otp_verify')
const { upload, save_resume, getImage, upload_cv, update_img, getImage_by_id, getCV, delete_cv, consult_cv } = require('../db/multer')
const { create_job_post, delete_job_post, consult_job_post, update_job_post, get_posts, get_recruiter_posts, search } = require('../db/job_posts')
const { apply_job, abandon_job, consult_application_asCandidate, consult_application_asRecruiter } = require('../db/job_app')
const { get_profile, update_profile, get_profile_2 } = require('../db/user_data')
const { addQuiz, getQuiz, checkQuiz, saveScore } = require('../db/quiz')

//init
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))

//routers
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.post('/sendOTP', SendVerificationEmail)
router.post('/verifyEmail', verify, verifyEmail)
router.post('/forgetPassword', verify, updatePassword)
router.post('/changePassword', userAuth, changePassword)

router.post('/postJob', userAuth, PostValidation, validationMiddleware, create_job_post)
router.get('/get_my_posts', userAuth, get_recruiter_posts)
router.delete('/deleteJobPost',userAuth, Check_post_exist, validationMiddleware, delete_job_post)
router.get('/consult_post', userAuth, consult_job_post)
router.post('/update_post', userAuth, update_job_post)


router.post('/apply_job', userAuth, apply_job)
router.post('/abandon_job',userAuth, abandon_job)
router.post('/t', apply_job)

router.get('/consult_app_candidate', userAuth, consult_application_asCandidate)
router.get('/consult_app_recruiter', userAuth, consult_application_asRecruiter)
//profile
router.get('/get_profile', userAuth, get_profile)
router.get('/get_profile_2', get_profile_2)
router.post('/update_profile', userAuth, update_profile)
//search post
router.get('/get_posts', get_posts)
router.get('/search', search)

//Img
router.post('/upload_img', userAuth, upload, update_img)
router.get('/get_profile_img',userAuth, getImage)
router.get('/get_profile_img_by_email', getImage_by_id)
//CV
router.post('/upload_cv', userAuth, upload_cv, save_resume)
router.get('/consult_cv', userAuth, consult_cv)
router.get('/get_cv', getCV)
router.delete('/delete_cv',userAuth,  delete_cv)

//Quiz
router.post('/addQuiz', userAuth, addQuiz)
router.get('/getQuiz', userAuth, getQuiz)
router.get('/checkQuiz', userAuth, checkQuiz)
router.get('/save_score', userAuth, saveScore)

router.get('/test', userAuth, (req,res)=>{
    res.json({
        id: req.user,
        status:"Authorised"
    })
})
router.get('/candidate_app', (req,res)=>{
    res.json({
        status:"Succes",
        msg:[{
            "applicant_id": 26,
            "application_date": "2023-05-27T13:38:08.277Z",
            "cover_letter": "HI",
            "cv_id": 27,
            "email": "etc222@info.fr",
            "full_name": "etc",
            "id": 32,
            "job_post_id": 16,
            "quiz_score": 100,
            "score": 80,
            "status": "pending",
            "title": "Full Stack developer"
          },
          {
            "applicant_id": 33,
            "application_date": "2023-08-01T13:38:08.277Z",
            "cover_letter": "hello",
            "cv_id": 33,
            "email": "bank@info.fr",
            "full_name": "bank",
            "id": 22,
            "job_post_id": 15,
            "quiz_score": 50,
            "score": 60,
            "status": "rejected",
            "title": "developeur"
          },]
    })
})


module.exports = router