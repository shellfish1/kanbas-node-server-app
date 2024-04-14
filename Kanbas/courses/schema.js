import mongoose from "mongoose";
const coursesSchema = new mongoose.Schema({
		// _id: { type: mongoose.Schema.Types.ObjectId },
		// _id: {type: String},
		id: {type: String},
		name: { type: String, required: true, unique: true },
		number: { type: String, required: true, unique: true },
		startDate: {type: Date, required: false},
		endDate: {type: Date, required: false},
		department: {type: String, required: false},
		credits: Number,
		description: {type: String, required: false},
	},
	{ collection: "courses", strict: false });
export default coursesSchema;