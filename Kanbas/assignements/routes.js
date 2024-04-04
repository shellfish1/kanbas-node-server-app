import  Database from "../Database/index.js";

export default function AssignmentsRoutes(app) {
	app.get("/api/:cid/assignments", (req, res) => {
		const { cid } = req.params;
		const assignments = Database.assignments.filter( (a) => a.course === cid )
		res.json(assignments)
	});
	app.get("/api/assignments", (req, res) => {
		res.json(Database.assignments)
	});
	app.get("/api/:cid/assignments/:aid", (req, res) => {
		const { cid, aid } = req.params;
		const assignment = Database.assignments.find( (a) => a.course === cid && a._id === aid)
		if (!assignment) {
			res.status(404).send("assignment not found");
			return;
		}
		res.json(assignment)
	});
	app.post("/api/:cid/assignments", (req, res) => {
		const {cid} = req.params
		const newA = { ...req.body,
			course : cid,
			_id: new Date().getTime().toString()
		}
		Database.assignments.push(newA)
		res.json(newA)
	})
	app.delete("/api/:cid/assignments/:aid", (req, res) => {
		const {cid, aid} = req.params;
		Database.assignments = Database.assignments.filter( a => a.course !== cid || ( a.course === cid && a._id !== aid ))
		res.sendStatus(204)
	})
	app.put("/api/:cid/assignments/:aid", (req, res) => {
		const {cid, aid} = req.params;
		const updatedA = req.body;
		Database.assignments = Database.assignments.map((a) =>
			a.course === cid && a._id === aid ? {...a, ...updatedA } : a
		)
		res.sendStatus(204)
	})
}
