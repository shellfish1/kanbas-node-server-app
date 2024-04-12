import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import cors from "cors";
import AssignmentsRoutes from "./Kanbas/assignements/routes.js";
import mongoose from "mongoose";
import UserRoutes from "./Kanbas/users/routes.js";

const uri = "mongodb+srv://manikondanikhil:cs5600_1997@cs5610.kvkp5cw.mongodb.net/kanbas?retryWrites=true&w=majority&appName=cs5610";
mongoose.connect(uri)
console.log("Started")
const app = express()
app.use(cors());
app.use(express.json());
Hello(app)
Lab5(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentsRoutes(app);
UserRoutes(app);

app.listen(process.env.PORT || 4000);