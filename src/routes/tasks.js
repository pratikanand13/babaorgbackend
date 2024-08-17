const router = require("express").Router();
const Tasks = require("../models/tasks");
const User = require("../models/User");
// const auth = require("./auth");
const authenticateToken = require("./auth");
const logMiddleware = require('../middlewares/logMiddleware')
router.use(logMiddleware)
// title, desc
router.post("/create-task", authenticateToken, async (req, res) => {
  console.log(req.body.title, req.body.desc);
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;
    const newTask = new Tasks({ title: title, desc: desc });
    const saveTask = await newTask.save();
    const taskId = saveTask._id;
    await User.findByIdAndUpdate(id, { $push: { tasks: taskId._id } });
    return res.status(200).json({ success: true, message: "Task Created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//getAllTasks :
router.get("/getAllTasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });
    await User.findOne({ id });
    return res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//Delete Task
router.delete("/deleteTasks/:id", authenticateToken, async (req, res) => {
  console.log("req")
  try {
    const { id } = req.headers;
    const userId = req.headers.id;
    await Tasks.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
    // const userData = await User.findById(userId);
    return res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//update Task
router.put("/updateTask/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    await Tasks.findByIdAndUpdate(id, { title: title, desc: desc });
    return res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//updateImpTask
router.put("/updateImpTask/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await Tasks.findById(id);
    const ImpTask = taskData.important;
    await Tasks.findByIdAndUpdate(id, { important: !ImpTask });
    return res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
//completeTask
router.put("/updateCompleteTask/:id", authenticateToken, async (req, res) => {
  console.log("req.params :", req.params);
  try {
    const { id } = req.params;
    const taskData = await Tasks.findById(id);
    const completeTask = taskData.complete;
    console.log(completeTask);
    await Tasks.findByIdAndUpdate(id, { complete: !completeTask });
    console.log(!completeTask);
    return res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
//All Imp Tickets
router.get("/getAllImpTasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });
    const ImpTaskData = Data.tasks;
    await User.findOne({ id });
    return res
      .status(200)
      .json({ success: true, message: "All Task", data: ImpTaskData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
//get completed Task
router.get("/getCompleteTasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const completedData = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });
    const completeData = completedData.tasks;
    await User.findOne({ id });
    return res
      .status(200)
      .json({ success: true, message: "All Task", data: completeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//getInCompleteTask
router.get("/getIncompleteTasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { important: false },
      options: { sort: { createdAt: -1 } },
    });
    const completeData = Data.tasks;
    await User.findOne({ id });
    return res
      .status(200)
      .json({ success: true, message: "All Task", data: completeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
