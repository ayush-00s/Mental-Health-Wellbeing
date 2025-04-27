import express from "express";
import { signin, signup } from "../controller/user.controller.js";
const router = express.Router();

router.post("/SignUp", signup);
router.post("/SignIn", signin);
router.post("/Logout", (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
});

export default router;