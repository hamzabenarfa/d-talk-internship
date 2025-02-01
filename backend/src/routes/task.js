const express = require("express");
const router = express.Router();
const {
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,getAllTasks,valideTaskToggle
    } = require("../controller/task");
router.get('/getMyTasks',getMyTasks);

router.get('/getAll/:id',getAllTasks);
router.post('/create/:id',createTask);
router.put('/update/:id',updateTask);
router.put('/valide/:id',valideTaskToggle);
router.delete('/delete/:id',deleteTask);

module.exports = router;