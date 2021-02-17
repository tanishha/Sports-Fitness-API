const router=require('express').Router()
const authRouter=require('./../modules/auth/auth.controller')
const userRouter=require('./../modules/users/user.controller')
const authenticate=require('./../middlewares/authenticate')

router.use('/auth',authRouter)
router.use('/user',authenticate,userRouter)

module.exports=router
