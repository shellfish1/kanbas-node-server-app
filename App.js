import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import cors from "cors";
import AssignmentsRoutes from "./Kanbas/assignements/routes.js";
import mongoose from "mongoose";
import UserRoutes from "./Kanbas/users/routes.js";
import session from "express-session";
import "dotenv/config";
import QuizRoutes from "./Kanbas/quizzes/routes.js";

const uri = process.env.DB_CONNECTION_STRING;
mongoose.connect(uri)
console.log("Started")
const app = express()
const sessionOptions = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	save: true,
	saveUninitialized: false
};
if (process.env.NODE_ENV !== "development") {
	sessionOptions.proxy = true;
	sessionOptions.cookie = {
		sameSite: "none",
		secure: true,
		domain: process.env.HTTP_SERVER_DOMAIN,
	};
}

app.use(cors({
	origin: process.env.FRONTEND_URL,
	credentials: true,
}))
app.use(session(sessionOptions));
app.use(express.json());
Hello(app)
Lab5(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentsRoutes(app);
UserRoutes(app);
QuizRoutes(app);

app.listen(process.env.PORT || 4000);