import  express  from "express";
import {  signin, signup } from "../controller/user.controller.js";
const router = express.Router();

router.post("/SignUp",signup)
router.post("/SignIn",signin)

export default router;