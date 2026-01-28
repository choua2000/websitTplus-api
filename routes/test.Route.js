import express, { response } from "express";
import JWT from '../libs/utils/authenticate';
import {Auth} from '../middlewares/auth.guard'

const router  = express.Router();
router.get("/nice",async(req,res,next)=>{
    const payload = {
        id:1,
        phone:"99999999"
    }
    const accessToken = JWT.genAccessJWT(payload);
    const refreshToken = JWT.genRefreshJWT(payload);

    return res.json({
        success: true,
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
        
    });

});
router.get("/nigga",async(req,res,next)=>{
    const payload = {
        id:2,
        phone:"55555555"
    }
    const accessToken = JWT.genAccessJWT(payload);
    const refreshToken = JWT.genRefreshJWT(payload);

    return res.json({
        success: true,
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
        
    });

});
router.get("/bie",async(req,res,next)=>{
    const payload = {
        id:3,
        phone:"11111111"
    }
    const accessToken = JWT.genAccessJWT(payload);
    const refreshToken = JWT.genRefreshJWT(payload);

    return res.json({
        success: true,
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
        
    });

});
router.post("/nice",Auth,(req,res,next)=>{
  return res.status(200).json({
      data:req.user
  });

});


export default router;