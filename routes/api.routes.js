const router=require('express').Router()
const authRouter=require('./../modules/auth/auth.controller')
const userRouter=require('./../modules/users/user.controller')
const authenticate=require('./../middlewares/authenticate')
const venueRouter=require('../modules/venues/venue.controller')
const adminRouter=require('../modules/venues/venue.admin.controller')

router.use('/auth',authRouter)
router.use('/user',authenticate,userRouter)
router.use('/booking',authenticate,venueRouter)
router.use('/admin',adminRouter)

module.exports=router
