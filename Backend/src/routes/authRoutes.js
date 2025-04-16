import express from "express"
import { Signin, Signout, Signup, updateProfile, checkAuth} from "../controllers/authcontrollers.js"
import protectUpdateRoute from "../middleware/protectUpdateRoute.js"
const router = express.Router()


router.get('/check-auth', protectUpdateRoute, checkAuth)

router.post('/signup', Signup)

router.post('/signin', Signin)
router.post('/signout', Signout)

router.put('/update-profile', protectUpdateRoute, updateProfile)
export default router;