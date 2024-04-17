import * as dao from "./dao.js";
import * as enrollmentDao from "../enrollments/dao.js"

export default function CourseRoutes(app) {

	const createCourse = async (req, res) => {
		const user = req.session["currentUser"]
		if(user && (user.role === "ADMIN" || user.role === "TEACHER")){
			const course = await dao.createCourse(req.body);
			return res.json(course);
		}else if(user){
			return res.status(403)
				.json({message: `Your role ${user.role} doesn't give you access to create course`})
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};
	const deleteCourse = async (req, res) => {
		const { id } = req.params;
		const user = req.session["currentUser"]
		if(user && (user.role === "ADMIN")){
			const status = await dao.deleteCourse(id);
			return res.status(status);
		}else if(user && user.role === "TEACHER"){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			if(enrolledCourseIds.includes(id)){
				const status = await dao.deleteCourse(id);
				return res.status(status);
			}else{
				return res.status(403)
					.json({message: `Your role ${user.role} doesn't give you access to delete course ${id} as you are not enrolled for the course`})
			}
		} else{
			return res.status(403)
				.json({message: "Deleting course is only available to loggedin admins"})
		}

	};

	const findAllCourses = async (req, res) => {
		const user = req.session["currentUser"]
		const allCourses = await dao.findAllCourses()

		if(user && (user.role === "ADMIN")){
			res.json(allCourses)
		}else if(user){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c._id.toString()))
			res.json(enrolledCourses)
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}
	};
	const findCourseById = async (req, res) => {
		const { id } = req.params;
		const user = req.session["currentUser"]
		const course = await dao.findCourseById(id)
			.catch((err)=>{
				return res.json({message: `No course ${id} found`})
			})

		if(user  && (user.role === "ADMIN")){
			res.json(course)
		}else if(user){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			if(enrolledCourseIds.includes(id)){
				res.json(course)
			}else{
				return res.status(403)
					.json({message: `Unable to find an enrollment for the course ${id}`})
			}
		}else{
			res.json({message: "Login before attempting the action"})
				.status(403)
		}

	}
	const updateCourse = async (req, res) => {
		const { id } = req.params;
		const user = req.session["currentUser"]

		if(user && (user.role === "ADMIN")){
			const status = await dao.updateCourse(id, req.body);
			res.json(status)
		}else if(user && user.role === "TEACHER"){
			const enrolledCourseIds = await enrollmentDao.findUserCourses(user._id)
			if(enrolledCourseIds.includes(id)){
				const status = await dao.updateCourse(id, req.body);
				res.json(status)
			}else{
				return res.status(403)
					.json({message: `Unable to find an enrollment for the course ${id}`})
			}
		} else if(user){
			res.status(403).json({message: `Your role ${user.role} doesn't give you access to Update course`})

		}else{
			res.status(403).json({message: "Login before attempting the action"})

		}

	}
	app.get("/api/courses",findAllCourses);
	app.post("/api/courses", createCourse);
	app.delete("/api/courses/:id",deleteCourse);
	app.put("/api/courses/:id", updateCourse);
	app.get("/api/courses/:id", findCourseById);

}
