import * as dao from "./dao.js";
import * as enrollmentDao from "../enrollments/dao.js"

export default function CourseRoutes(app) {

	const createCourse = async (req, res) => {
		const user = req.session["currentUser"]
		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			const course = await dao.createCourse(req.body);
			return res.json(course);
		}else{
			return res.status(403)
				.json({message: "Creating course is only available to loggedin admins"})
		}
	};
	const deleteCourse = async (req, res) => {
		const { id } = req.params;
		const user = req.session["currentUser"]
		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			const status = await dao.deleteCourse(id);
			return res.status(status);
		}else{
			return res.status(403)
				.json({message: "Deleting course is only available to loggedin admins"})
		}

	};
	const findAllCourses = async (req, res) => {
		const user = req.session["currentUser"]

		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			const allCourses = await dao.findAllCourses()
			res.json(allCourses)
		}else if(user){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			console.log(`user ${user._id} has enrolled for courses ${enrolledCourseIds}`)
			const enrolledCourses = await dao.findAllCourses()
				.then((ans) => {
					return ans.filter((c) => enrolledCourseIds.includes(c._id) )
				})
			res.json(enrolledCourses)
		}else{
			res.json([])
		}
	};
	const findCourseById = async (req, res) => {
		const { id } = req.params;
		const course = await dao.findCourseById(id);
		res.json(course)
	}
	const updateCourse = async (req, res) => {
		const { id } = req.params;
		const status = await dao.updateCourse(id, req.body);
		res.json(status)
	}
	app.get("/api/courses",findAllCourses);
	app.post("/api/courses", createCourse);
	app.delete("/api/courses/:id",deleteCourse);
	app.put("/api/courses/:id", updateCourse);
	app.get("/api/courses/:id", findCourseById);

}
