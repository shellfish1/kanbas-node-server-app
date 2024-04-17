import model from "./model.js";

export const findUserCourses = (userId) => {
	const ans =  model.find({user: userId}).select('course').then( (cs) => {
		return cs.map((c) => c.course)
	})
	return ans ? ans : []
}