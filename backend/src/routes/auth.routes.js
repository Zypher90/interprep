import {Router} from "express";
import {loginUser, registerUser, logoutUser, whoAmI} from "../controllers/auth.controllers.js";
import {authorizeUser, validateResponse} from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);
authRouter.get('/whoami', authorizeUser, whoAmI);

export default authRouter;