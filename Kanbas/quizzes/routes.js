import * as dao from "./dao.js";
import * as enrollmentDao from "../enrollments/dao.js"
import mongoose from "mongoose";

export default function QuizRoutes(app) {

	const createQuiz = async (req, res) => {
		const { courseId } = req.params
		const user = req.session["currentUser"]
		
		if(user && (user.role === "TEACHER" || user.role === "ADMIN")){
			const quiz = await dao.createQuiz({ ...req.body, course: courseId});
			res.json(quiz);
		}else if (user){
			res.json({message: `Your role ${user.role} doesn't give you access to create quizzes`})
				.status(403)
		}else {
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
		
	};
	const createQuestion = async (req, res) => {
		const {courseId, quizId} = req.params
		const user = req.session["currentUser"]

		const question = { ...req.body, id: new mongoose.mongo.ObjectId().toString() }
		const quiz = await dao.findQuizById(quizId).catch( (err) => {
			return res.status(500)
				.json({ message: `Unable to find Quiz with ID ${quizId}` });
		})
		quiz.questions = [ ...quiz.questions, question]

		const enrolledCourses = (user) ? await enrollmentDao.findUserCourses(user._id):[]

		if(user && (user.role === "TEACHER" || user.role === "ADMIN")){
			if(enrolledCourses.includes(quiz.course)){
				const status = await dao.updateQuiz(quizId, quiz).catch(err => {
					return res.status(500)
						.json({ message: `Creation of new question for ${quizId} failed` });
				});
				return dao.findQuestionById(quizId, question.id)
					.then(q => res.json(q))
					.catch( (err) => res.status(500).message({message: `Some issue happened : ${err.message}`}))
			}else{
				res.status(403)
					.json("You cant perform the action on an unenrolled course")
			}

		}else if(user){
			res.json({message: `Your role ${user.role} doesn't give you access to create quiz questions`})
				.status(403)
		}else {
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};
	const findAllQuizzes = async (req, res) => {
		const quizzes = await dao.findAllQuizzes();
		const user = req.session["currentUser"]
		const { courseId } = req.params

		if(user && (user.role === "ADMIN")){
			const courseQuizzes = quizzes
				.filter((q) => courseId === q.course)
			res.json(courseQuizzes)
		}else if(user){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			const courseQuizzes = quizzes
				.filter((q) => enrolledCourseIds.includes(q.course))
				.filter((q) => courseId === q.course)
			res.json(courseQuizzes)
		}else{
			return res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};
	const findAllQuestions = async (req, res) => {
		const {courseId, quizId} = req.params
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
		const quiz = await dao.findQuizById(quizId)
			.catch(err => {
				return res.status(500)
					.json({ message: `Unable to find Quiz with ID ${quizId}` });
			});
		if(user && user.role === "ADMIN"){
			return res.json(quiz.questions)
		}else if( user ){
			if(enrolledCourseIds.includes(quiz.course) && quiz.course === courseId){
				return res.json(quiz.questions)
			}else{
				return res.status(403)
					.json("You cant perform the action on an unenrolled course")
			}
		} else {
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};
	const findQuizById = async (req, res) => {
		const { courseId, quizId } = req.params;
		const quiz = await dao.findQuizById(quizId)
				.catch(err => {
					return res.status(500)
						.json({ message: `Unable to find Quiz with ID ${quizId}` });
				});
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)

		if(user && user.role === "ADMIN"){
			return res.json(quiz)
		}else if(user){
			if(enrolledCourseIds.includes(quiz.course) && quiz.course === courseId){
				return res.json(quiz)
			}else{
				return res.status(403)
					.json("You cant view a quiz from an unenrolled course")
			}
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}

	};
	const findQuestionById = async (req, res) => {
		const { courseId, quizId, questionId } = req.params;
		await dao.findQuestionById(quizId, questionId)
			.then( question => res.json(question) )
			.catch(err => {
				return res.status(500)
					.json({ message: `Unable to find Question ${questionId} from quiz ${quizId}` });
			});
	}
	const deleteQuiz = async (req, res) => {
		const { courseId, quizId } = req.params;
		const quiz = await dao.findQuizById(quizId)
			.catch(err => {
				return res.status(500)
					.json({ message: `Unable to find Quiz with ID ${quizId}` });
			});
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)

		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			if(enrolledCourseIds.includes(quiz.course) && quiz.course === courseId){
				await dao.deleteQuiz(quizId).then(() => {
					return res.status(204)
				}).catch((err) => {
					return res.status(404)
						.json({ message: err.message})
				})
			}else{
				return res.status(403)
					.json("You cant delete an unenrolled quiz")
			}
		}else if(user){
			res.json({message: `Your role ${user.role} doesn't give you access to delete quiz`})
				.status(403)
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}

	};
	const deleteQuestion = async (req, res) => {
		const { courseId, quizId, questionId } = req.params
		const quiz = await dao.findQuizById(quizId)
			.catch((err)=>{
				return res.json({ message: `Finding quiz ${quizId} failed`}).status(500)
			})
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)


		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			if(enrolledCourseIds.includes(quiz.course)  && quiz.course === courseId ){
				quiz.questions = quiz.questions.filter( (q) => q.id !== questionId)
				await dao.updateQuiz(quizId, quiz)
					.catch((err)=>{
						return res.json({ message: `Deleting question ${questionId} from quiz ${quizId} failed`}).status(500)
					})

				await dao.findAllQuestions(quizId).then( (ans) => {
					return res.json(ans)
				}).catch(
					(err)=>{
						return res.json({ message: `Deleting question ${questionId} from quiz ${quizId} failed`}).status(500)
					}
				)
			}else{
				return res.status(403)
					.json("You cant delete an unenrolled quiz question")
			}
		}else if(user){
			res.json({message: `Your role ${user.role} doesn't give you access to delete quiz question`})
				.status(403)
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	}

	const updateQuestion = async (req, res) => {
		const { courseId, quizId, questionId } = req.params;
		const updatedQuestion = { ...req.body, id: questionId }
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)

		const quiz = await dao.findQuizById(quizId)
			.catch((err)=>{
				return res.json({ message: `Finding quiz ${quizId} failed`}).status(500)
			})
		quiz.questions = quiz.questions.map( (q) => {
			if (q.id !== questionId){
				return q;
			}else{
				return updatedQuestion;
			}
		})

		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			if(enrolledCourseIds.includes(quiz.course) && quiz.course === courseId){
				await dao.updateQuiz(quizId, quiz)
					.catch((err)=>{
						return res.json({ message: `Updating question ${questionId} from quiz ${quizId} failed`}).status(500)
					})
				await dao.findAllQuestions(quizId).then( (ans) => {
					return res.json(ans.find((q) => q.id === questionId))
				}).catch(
					(err)=>{
						return res.json({ message: `Updating question ${questionId} from quiz ${quizId} failed`}).status(500)
					}
				)
			}else{
				return res.status(403)
					.json("You cant update an unenrolled quiz question")
			}
		}else if(user){
			res.json({message: `Your role ${user.role} doesn't give you access to update quiz question`})
				.status(403)
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	}

	const updateQuiz = async (req, res) => {
		const { courseId, quizId } = req.params;
		const user = req.session["currentUser"]
		const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
		const quiz = await dao.findQuizById(quizId)
			.catch((err)=>{
				return res.json({ message: `Finding quiz ${quizId} failed`}).status(500)
			})
		const course = quiz.course
		const updatedQuiz = {...quiz, ...req.body}

		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			if(enrolledCourseIds.includes(quiz.course) && quiz.course === courseId){
				await dao.updateQuiz(quizId, updatedQuiz)
					.then( () => {
						res.status(200);
					}).catch((err) => {
						return res.json({ message: `Updating quiz ${quizId} failed`}).status(500)
					})
				await dao.findQuizById(quizId).then( (ans) => {
					res.json(ans)
				}).catch((err) => {
					return res.json({ message:  `Updating quiz ${quizId} failed`}).status(500)
				})
			}else{
				return res.status(403)
					.json("You cant update an unenrolled quiz")
			}
		}else if(user){
			res.json({message: `Your role ${user.role} doesn't give you access to update quiz`})
				.status(403)
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};

	app.post("/api/courses/:courseId/quizzes", createQuiz);
	app.post("/api/courses/:courseId/quizzes/:quizId/questions", createQuestion);
	app.get("/api/courses/:courseId/quizzes", findAllQuizzes);
	app.get("/api/courses/:courseId/quizzes/:quizId", findQuizById);
	app.delete("/api/courses/:courseId/quizzes/:quizId", deleteQuiz);
	app.delete("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", deleteQuestion);
	app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);
	app.get("/api/courses/:courseId/quizzes/:quizId/questions", findAllQuestions)
	app.get("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", findQuestionById)
	app.put("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", updateQuestion)
}
