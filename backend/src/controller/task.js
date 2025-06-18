const { PrismaClient, Status } = require("@prisma/client");
const { WebSocketServerInstance } = require("../lib/websocket");
const prisma = new PrismaClient();

const getMyTasks = async (req, res) => {
  const userId = req.user.id;
  console.log("🚀 ~ getMyTasks ~ userId:", userId)
  
  try {
    const myCandidature = await prisma.candidature.findFirst({ 
      where: {
        userId:+userId,
        status: Status.ACCEPTED,
      },
    });
    console.log("🚀 ~ getMyTasks ~ myCandidature:", myCandidature)
    if (!myCandidature) {
      return res.status(400).json({ message: "No candidature found" });
    }

    const existTask = await prisma.task.findMany({
      where: {
        userId:myCandidature.supervisorId,
        candidatureId:myCandidature.id
      },
    });
    console.log("🚀 ~ getMyTasks ~ existTask:", existTask)
    if (!existTask) {
      return res.status(400).json({ message: "No task found" });
    }
    // const tasks = await prisma.task.findMany({
    //   where: { userId: myCandidature.supervisorId },
    // });
    res.json(existTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  const { name, description, deadline } = req.body;
  const candidatureId = req.params.id
  const userId = req.user.id;
  const taskDeadline = new Date(deadline);
  try {
    const taskExiste = await prisma.task.findFirst({
        where: {
            name,
            userId,
        },
        });
    if (taskExiste) {
        return res.status(400).json({ message: "Task existe" });
    }
    
    const task = await prisma.task.create({
      data: {
        name,
        description,
        deadline: taskDeadline,
        userId,
        candidatureId:parseInt(candidatureId),
      },
    });
    WebSocketServerInstance.broadcast(
      JSON.stringify({
        event: "new-task",
        data: task,
      })
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, description, deadline } = req.body;
  const userId = req.user.id;

  const taskDeadline = new Date(deadline);
  try {
    const taskExiste = await prisma.task.findFirst({
        where: {
            id:+id
        },
        });
    if (!taskExiste) {
        return res.status(400).json({ message: "Task n'existe pas" });
    }
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        deadline: taskDeadline,
      },
    });

    WebSocketServerInstance.broadcast(
      JSON.stringify({
        event: "update-task",
        data: updatedTask,
      })
    );
    res.json(updatedTask);
  } catch (error) {
    console.log("🚀 ~ updateTask ~ error:", error)
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    WebSocketServerInstance.broadcast(
      JSON.stringify({
        event: "delete-task",
        data: { id: parseInt(id) },
      })
    );
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
const getAllTasks = async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { candidatureId: parseInt(id) },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

const valideTaskToggle = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    });
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { valide: !task.valide },
    });
    WebSocketServerInstance.broadcast(
      JSON.stringify({
        event: "toggle-task",
        data: updatedTask,
      })
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
}

module.exports = {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,getAllTasks,valideTaskToggle
};
