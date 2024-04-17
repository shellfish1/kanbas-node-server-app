import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
	title: String,
	id: {
		required: true,
		type: String
	},
	type: {
		type: String,
		enum: ["Multiple Choice", "True False", "Fill in Blanks"],
		default: "Multiple Choice"
	},
	question: String,
	points: Number,
	options: {
		type: [String],
		required: false
	},
	correctAnswer: {
		type: String,
		required: false
	},
	possibleAnswers: {
		type: [String],
		required: false
	},
});

const quizSchema = new mongoose.Schema({
	title: { type: String, required: true},
	course: {type: String, required: true},
	description: String,
	points: { type: Number, required: true},
	status: {
		type: String,
		enum: [ "Published", "Unpublished", "Deleted" ],
		required: true
	},
	quiz_type: {
		type: String,
		enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey" ],
		required: true
	},
	shuffle_answers : {
		type: Boolean,
		default: true,
		required: true
	},
	available_from: {
		type: String,
		required: true
	},
	due_date: {
		type: String,
		required: true
	},
	available_till: {
		type: String,
		required: true
	},
	timed: {
		type: Boolean,
		required: true
	},
	duration: {
		type: Number,
		required: false,
		default: 20
	},
	attempts: {
		type: Number,
		required: true,
		default: 1
	},
	access_code: {
		type: String,
		required: false,
		default : ""
	},
	webcam_required: {
		type: Boolean,
		default: false,
		required: false
	},
	lock_questions : {
		type: Boolean,
		default: false,
		required: false
	},
	questions: [questionSchema]
}, { collection: "quizzes", strict: false })

export default quizSchema;