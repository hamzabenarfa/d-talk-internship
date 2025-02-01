/* eslint-disable react/prop-types */
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../../../../../axios-instance";

const TaskCard = ({
  task,
  handleDeleteComment,
  handleOpenEditCommentModal,
  currentUser,
  progressUpdates,
  handleFileAttachment,
  handleProgressChange,
  comments,
  handleSubmit,
  getMyAdvancement,
  setNewTask,
  setShowModal,
  setTaskId,
  setIsEditing
}) => {
  const calculateDeadlineDays = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const onValidateToggle = async (taskId) => {
    try {
      await axiosInstance.put(`task/valide/${taskId}`);
      getMyAdvancement();
    } catch (error) {
      console.error("Error updating task validation status:", error);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({
      name: task.name,
      description: task.description,
      deadline: task.deadline,
    });
    setTaskId(task.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      await axiosInstance.delete(`task/delete/${id}`);
      await getMyAdvancement();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <div
      key={task.id}
      className={`p-6 border border-gray-300 rounded-lg shadow-lg mb-5 ${
        task.validated ? "bg-green-100" : "bg-white"
      } transition-transform transform hover:scale-105`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{task.name}</h2>
          <span className="text-sm font-medium text-gray-500">
            Échéance dans {calculateDeadlineDays(task.deadline)} jours
          </span>
          <div className="flex flex-row gap-2">
              <button
                onClick={() => handleEditTask(task)}
                className="text-blue-500"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500"
              >
                <FaTrashAlt />
              </button>
            </div>
        </div>
      </div>
      <p className="text-gray-600 mb-3">{task.description}</p>

      <>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          placeholder="Mettez à jour votre progrès..."
          value={progressUpdates[task.id] || ""}
          onChange={(e) => handleProgressChange(task.id, e.target.value)}
        />
        {/* <label className="block mb-2 cursor-pointer">
          <span className="sr-only">Choisir le fichier</span>
          <input
            type="file"
            multiple
            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
            onChange={(e) =>
              handleFileAttachment(task.id, Array.from(e.target.files))
            }
          />
        </label> */}
        <div className="flex flex-row justify-between">
          <button
            className="bg-[#38A3A5] hover:bg-[#38a3a589] w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleSubmit(task.id)}
          >
            Ajouter Commentaire
          </button>
          <button
            className={`ml-4 py-2 px-4 rounded focus:outline-none ${
              task.valide
                ? "bg-red-500 hover:bg-red-700"
                : "bg-[#57CC99] hover:bg-green-700"
            } text-white font-bold`}
            onClick={() => onValidateToggle(task.id)}
          >
            {task.valide ? "Invalider" : "Valider"}
          </button>
        </div>
      </>

      {comments[task.id] && comments[task.id].length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Commentaires:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {comments[task.id].map((comment) => (
              <li
                key={comment.id}
                className="flex justify-between items-start mb-2"
              >
                <div className=" w-full">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-bold text-gray-700 capitalize">
                      {comment.auteurName}
                    </p>
                    {currentUser && comment.auteurID === currentUser && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditCommentModal(comment)}
                          className="text-blue-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.id, task.id)
                          }
                          className="text-red-500"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                  <hr className="" />
                  <p className="text-gray-600">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
