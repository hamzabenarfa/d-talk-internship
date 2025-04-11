import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../../../../axios-instance";
import Toast from "react-hot-toast";
import TaskCard from "@/pages/Encadrant/page/stage/components/task-card";
import { useSelector } from "react-redux";
const Avancement = () => {
  const [tache, setTache] = useState([]);
  const [comments, setComments] = useState({});
  const [progressUpdates, setProgressUpdates] = useState({});
  const [fileAttachments, setFileAttachments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const userId = useSelector((state) => state.auth.user.user.id);

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [editCommentModal, setEditCommentModal] = useState(false);
  const [editComment, setEditComment] = useState({
    id: null,
    content: "",
    tacheID: null,
  });

  async function getMyAdvancement() {
    try {
      const res = await axiosInstance.get("/candidature/my-avancement");
    } catch (err) {
      Toast.error(err.response.data.error);
    }
  }

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");

    // Listen for messages from the server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === "new-task") {
        // Add the new task to the state
        setTache((prevTasks) => [...prevTasks, message.data]);
      } else if (message.event === "new-comment") {
        // Update comments for the specific task
        const { taskId, comment } = message.data;
        setComments((prevComments) => ({
          ...prevComments,
          [taskId]: [...(prevComments[taskId] || []), comment],
        }));
      } else if (message.event === "delete-comment") {
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

    fetchTasks();
    setCurrentUser(userId);
  }, []);

  const fetchComments = async (taskId) => {
    try {
      const response = await axiosInstance.get(
        `commentaire/get/task/${taskId}`
      );
      setComments((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (error) {
      Toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (id) => {
    const commentData = {
      content: progressUpdates[id],
      date: new Date().toISOString(),
    };

    try {
      await axiosInstance.post(`commentaire/create/${id}`, commentData);
      await fetchComments(id);
      setProgressUpdates((prev) => ({ ...prev, [id]: "" }));
      setFileAttachments((prev) => ({ ...prev, [id]: [] }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    const { id, content, tacheID } = editComment;
    const updatedComment = { content, date: new Date().toISOString() };
    try {
      await axiosInstance.put(`commentaire/update/${id}`, updatedComment);
      await fetchComments(tacheID);
      setEditCommentModal(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, tacheId) => {
    try {
      await axiosInstance.delete(`commentaire/delete/${commentId}`);
      await fetchComments(tacheId);
      Toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  const handleProgressChange = (id, value) => {
    setProgressUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileAttachment = (id, files) => {
    setFileAttachments((prev) => ({ ...prev, [id]: [...prev[id], ...files] }));
  };
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("task/getMyTasks");
      setTache(response.data || []);
      response.data.forEach(async (task) => {
        await fetchComments(task.id);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddTask = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(`task/update/${taskId}`, newTask);
      } else {
        await axiosInstance.post("task/create", newTask);
      }
      setShowModal(false);
      setIsEditing(false);
      setTaskId(null);
      const response = await axiosInstance.get("task/getMyTasks");
      setTache(response.data);
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setProgressUpdates({});
  };

  const calculateDeadlineDays = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const validTasks = tache.filter((task) => task.valide);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi de Progrès du Projet Étudiant
      </h1>
      <h1 className="text-2xl font-bold  text-gray-800 mb-6">
        Tache a faire :
      </h1>

      {tache
  .filter((task) => !task.valide) // Filter out validated tasks
  .map((task) => (
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

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {isEditing
                        ? "Modifier Tâche"
                        : "Ajouter une Nouvelle Tâche"}
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        placeholder="Nom de la tâche"
                        value={newTask.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-3"
                      />
                      <textarea
                        name="description"
                        placeholder="Description"
                        value={newTask.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-3"
                      />
                      <input
                        type="datetime-local"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddTask}
                >
                  {isEditing ? "Modifier" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setTaskId(null);
                    setNewTask({ name: "", description: "", deadline: "" });
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editCommentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className=" w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Modifier Commentaire
                    </h3>
                    <div className="mt-2 w-full ">
                      <textarea
                        name="content"
                        placeholder="Commentaire"
                        value={editComment.content}
                        onChange={(e) =>
                          setEditComment((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded mb-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdateComment}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setEditCommentModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <hr className="h-[1px] bg-gray-200 border-0" />
      <h1 className="text-2xl font-bold  text-gray-800 mb-6">Taches validé</h1>

      {validTasks.length === 0 ? (
        <p className="text-gray-600">Aucune tâche validée pour le moment.</p>
      ) : (
        validTasks.map((task) => (
          <div
            key={task.id}
            className="p-6 bg-green-100 border border-gray-300 rounded-lg shadow-lg mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{task.name}</h2>
              <span className="text-sm text-gray-500">
                Échéance dans {calculateDeadlineDays(task.deadline)} jours
              </span>
            </div>
            <p className="text-gray-600 mb-3">{task.description}</p>
            <p className="text-green-600 font-medium flex items-center gap-2">
              <FaCheckCircle /> Ce task a été validé.
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Avancement;
