import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("EnrollmentsModel", schema);
export default model;