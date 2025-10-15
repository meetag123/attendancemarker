import { Addemployee, Deleteemployee, Getemployee } from "../controller/user.js";
import express from 'express';
const router=express.Router();
router.post('/add',Addemployee);
router.get('/all',Getemployee);
router.delete('/delete/:id',Deleteemployee)
export default router;