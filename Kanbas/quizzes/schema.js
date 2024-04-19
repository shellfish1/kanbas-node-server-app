import mongoose, {Schema} from "mongoose"
const optionSchema = new Schema({
	key: {
		required: true,
		type: String
	},
	value: {
		required: true,
		type: String
	}
})
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
		type: [optionSchema],
		required: false
	},
	correctAnswers: {
		type: [String],
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
		enum: [ "Published", "Unpublished" ],
		required: true,
		default: "Unpublished"
	},
	assignment_group: {
		type: String,
		required: true,
		enum: ["Quizzes", "Assignments", "Projects", "Exams"],
		default: "Quizzes"
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
		required: true,
		default: 20
	},
	attempts: {
		type: Number,
		required: true,
		default: 1
	},
	access_code: {
		type: String,
		required: true,
		default : ""
	},
	webcam_required: {
		type: Boolean,
		default: false,
		required: true
	},
	lock_questions : {
		type: Boolean,
		default: false,
		required: true
	},
	one_question_at_time: {
		type: Boolean,
		default: true,
		required: true
	},
	show_correct_answers: {
		type: Boolean,
		default: false,
		required: true
	},
	questions: [questionSchema]
}, { collection: "quizzes", strict: false })

export default quizSchema;