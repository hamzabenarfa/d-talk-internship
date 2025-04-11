import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../../axios-instance";
import { useSelector } from "react-redux";
import Toast from "react-hot-toast";
import EditComment from "./components/edit-comment";
import TaskCard from "./components/task-card";
import AddTask from "./components/add-task";
const Stage = () => {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [progressUpdates, setProgressUpdates] = useState({});
  const [fileAttachments, setFileAttachments] = useState({});
  const [editCommentModal, setEditCommentModal] = useState(false);
  const [editComment, setEditComment] = useState({
    id: null,
    content: "",
    tacheID: null,
  });
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const userId = useSelector((state) => state.auth.user.user.id);


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");

    // Listen for messages from the server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
     if (message.event === "new-comment") {
        // Update comments for the specific task
        const { taskId, comment } = message.data;
        setComments((prevComments) => ({
          ...prevComments,
          [taskId]: [...(prevComments[taskId] || []), comment],
        }));
      }
    else if (message.event === "delete-comment") {
      const { id } = message.data;
      setComments((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([taskId, comments]) => [
            taskId,
            comments.filter((c) => c.id !== id),
          ])
        )
      );
    } else if (message.event === "update-comment") {
      const updatedComment = message.data;
      setComments((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([taskId, comments]) => [
            taskId,
            comments.map((c) =>
              c.id === updatedComment.id ? updatedComment : c
            ),
          ])
        )
      );
    }
  };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    getMyAdvancement();
    setCurrentUser(userId);
  }, [id]);

  

  async function getMyAdvancement() {
    try {
      const response = await axiosInstance.get(`task/getAll/${id}`);
      setTasks(response.data);
      response.data.forEach(async (task) => {
        await fetchComments(task.id);
      });
    } catch (err) {
      console.log(err);
    }
  }

  const fetchComments = async (taskId) => {
    try {
      const response = await axiosInstance.get(
        `commentaire/getAll/task/${taskId}`
      );
      setComments((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleProgressChange = (id, value) => {
    setProgressUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileAttachment = (id, files) => {
    setFileAttachments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ...files],
    }));
  };

  const handleSubmit = async (id) => {
    const commentData = {
      content: progressUpdates[id],
      date: new Date().toISOString(),
    };
    if (commentData.content === "") {
      Toast.error("Veuillez remplir le champ commentaire");
      return;
    }

    try {
      await axiosInstance.post(`commentaire/create/${id}`, commentData);
      Toast.success("Commentaire ajouté avec succès");
      await fetchComments(id);
      setProgressUpdates((prev) => ({ ...prev, [id]: "" }));
      setFileAttachments((prev) => ({ ...prev, [id]: [] }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleOpenEditCommentModal = (comment) => {
    setEditComment({
      id: comment.id,
      content: comment.content,
      tacheID: comment.tacheID,
    });
    setEditCommentModal(true);
  };

  const handleDeleteComment = async (commentId, tacheId) => {
    try {
      await axiosInstance.delete(`commentaire/delete/${commentId}`);
      await fetchComments(tacheId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  /**
   * Add Task
   */

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const handleAddTask = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(`task/update/${taskId}`, newTask);
      } else {
        await axiosInstance.post(`task/create/${id}`, newTask);
      }
      setShowModal(false);
      setIsEditing(false);
      setTaskId(null);

      await getMyAdvancement();
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi de Progrès du Projet Étudiant
      </h1>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mb-6"
        onClick={() => setShowModal(true)}
      >
        Ajouter Tâche
      </button>

      <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            handleDeleteComment={handleDeleteComment}
            handleOpenEditCommentModal={handleOpenEditCommentModal}
            currentUser={currentUser}
            progressUpdates={progressUpdates}
            handleFileAttachment={handleFileAttachment}
            handleProgressChange={handleProgressChange}
            comments={comments}
            handleSubmit={handleSubmit}
            getMyAdvancement={getMyAdvancement}
            setNewTask={setNewTask}
            setShowModal={setShowModal}
            setTaskId={setTaskId}
            setIsEditing={setIsEditing}
            key={task.id}
          />
        ))}
      </section>
      {editCommentModal && (
        <EditComment
          editComment={editComment}
          setEditComment={setEditComment}
          fetchComments={fetchComments}
          setEditCommentModal={setEditCommentModal}
        />
      )}

      {showModal && (
        <AddTask
          isEditing={isEditing}
          newTask={newTask}
          handleChange={handleChange}
          handleAddTask={handleAddTask}
          setShowModal={setShowModal}
          setTaskId={setTaskId}
          setNewTask={setNewTask}
        />
      )}
    </div>
  );
};

export default Stage;
