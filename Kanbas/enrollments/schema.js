import mongoose from "mongoose"

const enrollmentSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	course: {
		type: String,
		required: true
	}
}, { collection: "enrollments", strict: false })

export default enrollmentSchema