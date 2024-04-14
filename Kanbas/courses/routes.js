import * as dao from "./dao.js";

export default function CourseRoutes(app) {

	const createCourse = async (req, res) => {
		const course = await dao.createCourse(req.body);
		res.json(course);
	};
	const deleteCourse = async (req, res) => {
		const { id } = req.params;
		const status = await dao.deleteCourse(id);
		res.status(status);
	};
	const findAllCourses = async (req, res) => {
		const allCourses = await dao.findAllCourses()
		res.json(allCourses)
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
