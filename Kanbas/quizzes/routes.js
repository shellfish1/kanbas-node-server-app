import * as dao from "./dao.js";
import { updateQuiz } from "./dao.js";
import model from "./model.js";
import mongoose from "mongoose";

export default function QuizRoutes(app) {

	const createQuiz = async (req, res) => {
		const quiz = await dao.createQuiz(req.body);
		res.json(quiz);
	};
	const createQuestion = async (req, res) => {
		const {quizId} = req.params
		const question = { ...req.body, id: new mongoose.mongo.ObjectId().toString() }

		const quiz = await dao.findQuizById(quizId).catch( (err) => {
			return res.status(500)
				.json({ message: `Unable to find Quiz with ID ${quizId}` });
		})

		quiz.questions = [ ...quiz.questions, question]
		return await dao.updateQuiz(quizId, quiz).then( (status) => {
			if(status.acknowledged){
				return res.json(question)
			}else{
				return res.status(500)
					.json({message: `Creation of new quesiton for ${quizId} failed`})
			}
		}).catch(err => {
			return res.status(500)
				.json({ message: `Creation of new quesiton for ${quizId} failed` });
		});

	};
	const findAllQuizzes = async (req, res) => {
		const quizzes = await dao.findAllQuizzes();
		res.json(quizzes);
	};
	const findAllQuestions = async (req, res) => {
		const {quizId} = req.params
		const questions = await dao.findAllQuestions(quizId);
		res.json(questions);
	};
	const findQuizById = async (req, res) => {
		const { quizId } = req.params;
		await dao.findQuizById(quizId)
				.then( quiz => res.json(quiz) )
				.catch(err => {
					return res.status(500)
						.json({ message: `Unable to find Quiz with ID ${quizId}` });
				});
	};
	const findQuestionById = async (req, res) => {
		// "/api/quizzes/:quizId/questions/:questionId"
		console.log("I AM HERE ", JSON.stringify(req))
		const { quizId, questionId } = req.params;
		await dao.findQuestionById(quizId, questionId)
			.then( question => res.json(question) )
			.catch(err => {
				return res.status(500)
					.json({ message: `Unable to find Question ${questionId} from quiz ${quizId}` });
			});
	}
	const deleteQuiz = async (req, res) => {
		const { quizId } = req.params;
		await dao.deleteQuiz(quizId).then(() => {
			return res.status(204)
		}).catch((err) => {
			return res.status(404)
				.json({ message: err.message})
		})
	};
	const deleteQuestion = async (req, res) => {
		const { quizId, questionId } = req.params
		const quiz = await dao.findQuizById(quizId)
			.catch((err)=>{
				return res.json({ message: `Finding quiz ${quizId} failed`}).status(500)
			})

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
	}

	const updateQuestion = async (req, res) => {
		const { quizId, questionId } = req.params;
		const updatedQuestion = { ...req.body, id: questionId }

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
	}

	const updateQuiz = async (req, res) => {
		const { quizId } = req.params;
		await dao.updateQuiz(quizId, req.body)
			.then( () => {
				res.status(200);
			}).catch((err) => {
				return res.json({ message: err.message}).status(500)
			})

		await dao.findQuizById(quizId).then( (ans) => {
			res.json(ans)
		}).catch((err) => {
			return res.json({ message: err.message}).status(500)
		})
	};
	app.post("/api/quizzes", createQuiz);
	app.post("/api/quizzes/:quizId/questions", createQuestion);
	app.get("/api/quizzes", findAllQuizzes);
	app.get("/api/quizzes/:quizId", findQuizById);
	app.delete("/api/quizzes/:quizId", deleteQuiz);
	app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
	app.put("/api/quizzes/:quizId", updateQuiz);
	app.get("/api/quizzes/:quizId/questions", findAllQuestions)
	app.get("/api/quizzes/:quizId/questions/:questionId", findQuestionById)
	app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion)
}
