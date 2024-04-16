import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("quizzes", schema);
export default model;