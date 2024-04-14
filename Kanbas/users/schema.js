import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
		// _id: { type: mongoose.Schema.Types.ObjectId },
		// _id: {type: String},
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: String,
		email: String,
		lastName: String,
		dob: Date,
		role: {
			type: String,
			enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
			default: "USER",},
	},
	{ collection: "users", strict: false });
export default userSchema;