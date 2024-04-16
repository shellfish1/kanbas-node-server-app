import model from "./model.js";

export const findUserCourses = (userId) => {
	return model.find({user: userId})
		.select('course')
}