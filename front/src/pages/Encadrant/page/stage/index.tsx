import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../../axios-instance";
import { useSelector } from "react-redux";
import Toast from "react-hot-toast";
import EditComment from "./components/edit-comment";
import TaskCard from "./components/task-card";
import AddTask from "./components/add-task";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      tasks;
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

  const validTasks = tasks.filter((task) => task.valide);
  const pendingTasks = tasks.filter((task) => !task.valide);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Suivi de Progrès du Projet
        </h1>
        <Button
          onClick={() => {
            setNewTask({ name: "", description: "", deadline: "" });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Nouvelle Tâche
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock size={16} /> Tâches en cours{" "}
            <Badge variant="outline">{pendingTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle size={16} /> Tâches validées{" "}
            <Badge variant="outline">{validTasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">
                  Aucune tâche en cours pour le moment.
                </p>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setNewTask({ name: "", description: "", deadline: "" });
                    setIsEditing(false);
                    setShowModal(true);
                  }}
                >
                  Créer une tâche
                </Button>
              </CardContent>
            </Card>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
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
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {validTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <CheckCircle size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">
                  Aucune tâche validée pour le moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            validTasks.map((task) => (
              <Card key={task.id} className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">{task.name}</CardTitle>
                  <Badge variant="success" className="bg-green-500 text-white">
                    Validée
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{task.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Échéance: {formatDate(task.deadline)}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-green-200 pt-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={18} />
                    <span className="font-medium">
                      Cette tâche a été validée
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* <section className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </section> */}
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
