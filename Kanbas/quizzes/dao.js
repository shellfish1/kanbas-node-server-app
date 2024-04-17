import model from "./model.js";
import mongoose from "mongoose";

export const createQuiz = (quiz) => {
	delete quiz._id
	return model.create(quiz);
}
export const findAllQuizzes = () => model.find().lean();
export const findQuizById = (_id) => model.findById(_id).lean();
export const deleteQuiz = (_id) =>
	model.deleteOne({ _id: _id });
export const updateQuiz = (_id, quiz) =>{
	return model.updateOne({ _id: _id }, { $set: quiz });
}

export const findQuestionById = (quizId, questionId) => {
	return model.findById(quizId).then( quiz => {
		return quiz.questions.find( q => q.id === questionId).lean();
	})
}
export const findAllQuestions = (quizId) => {
	return model.findById(quizId).then( quiz => {
		if(quiz && quiz.questions){
			return quiz.questions
		}else{
			return []
		}
	}).lean();
}
export const updateQuestion = (quizId, questionId, updatedQuestion) => {

	quiz.questions = quiz.questions.map( q => {
		if(q.id === questionId){
			return updatedQuestion
		}else {
			return q
		}
	}).lean();
	return updateQuiz(quizId, quiz)
}