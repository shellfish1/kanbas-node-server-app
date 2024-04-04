import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import cors from "cors";
import AssignmentsRoutes from "./Kanbas/assignements/routes.js";

const app = express()
app.use(cors());
app.use(express.json());
Hello(app)
Lab5(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentsRoutes(app);
app.listen(process.env.PORT || 4000);