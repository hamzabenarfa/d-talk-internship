// @ts-nocheck

import { useState, useEffect } from "react"
import { CheckCircle, Calendar, Clock, Plus } from "lucide-react"
import axiosInstance from "../../../../axios-instance"
import { toast } from "react-hot-toast"
import TaskCard from "@/pages/Encadrant/page/stage/components/task-card"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Avancement = () => {
  const [tache, setTache] = useState([])
  const [comments, setComments] = useState({})
  const [progressUpdates, setProgressUpdates] = useState({})
  const [fileAttachments, setFileAttachments] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const userId = useSelector((state) => state.auth.user.user.id)

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
  })
  const [editCommentModal, setEditCommentModal] = useState(false)
  const [editComment, setEditComment] = useState({
    id: null,
    content: "",
    tacheID: null,
  })



  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_URL)

    // Listen for messages from the server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.event === "new-task") {
        // Add the new task to the state
        setTache((prevTasks) => [...prevTasks, message.data])
      } else if (message.event === "new-comment") {
        // Update comments for the specific task
        const { taskId, comment } = message.data
        setComments((prevComments) => ({
          ...prevComments,
          [taskId]: [...(prevComments[taskId] || []), comment],
        }))
      } else if (message.event === "delete-comment") {
        const { id } = message.data
        setComments((prev) =>
          Object.fromEntries(
            Object.entries(prev).map(([taskId, comments]) => [taskId, comments.filter((c) => c.id !== id)]),
          ),
        )
      } else if (message.event === "update-comment") {
        const updatedComment = message.data
        setComments((prev) =>
          Object.fromEntries(
            Object.entries(prev).map(([taskId, comments]) => [
              taskId,
              comments.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
            ]),
          ),
        )
      }
      else if (message.event === "update-task") {
        // Update the specific task in the state
        setTache((prevTasks) =>
          prevTasks.map((task) =>
            task.id === message.data.id ? message.data : task
          )
        );
      } else if (message.event === "delete-task") {
        // Remove the deleted task from the state
        setTache((prevTasks) =>
          prevTasks.filter((task) => task.id !== message.data.id)
        );
      } else if (message.event === "toggle-task") {
        // Update the toggled task in the state
        setTache((prevTasks) =>
          prevTasks.map((task) =>
            task.id === message.data.id ? message.data : task
          )
        );
      }
    };

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    setCurrentUser(userId)
  }, [])

  const fetchComments = async (taskId) => {
    try {
      const response = await axiosInstance.get(`commentaire/get/task/${taskId}`)
      setComments((prev) => ({ ...prev, [taskId]: response.data }))
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleSubmit = async (id) => {
    const commentData = {
      content: progressUpdates[id],
      date: new Date().toISOString(),
    }

    try {
      await axiosInstance.post(`commentaire/create/${id}`, commentData)
      await fetchComments(id)
      setProgressUpdates((prev) => ({ ...prev, [id]: "" }))
      setFileAttachments((prev) => ({ ...prev, [id]: [] }))
      toast.success("Commentaire ajouté avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire")
    }
  }

  const handleUpdateComment = async () => {
    const { id, content, tacheID } = editComment
    const updatedComment = { content, date: new Date().toISOString() }
    try {
      if (!content) {
        toast.error("Le commentaire ne peut pas être vide");
        return;
      }
      await axiosInstance.put(`commentaire/update/${id}`, updatedComment)
      await fetchComments(tacheID)
      setEditCommentModal(false)
      toast.success("Commentaire mis à jour avec succès")
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = async (commentId, tacheId) => {
    try {
      await axiosInstance.delete(`commentaire/delete/${commentId}`)
      await fetchComments(tacheId)
      toast.success("Commentaire supprimé avec succès")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Erreur lors de la suppression du commentaire")
    }
  }

  const handleOpenEditCommentModal = (comment) => {
    setEditComment({
      id: comment.id,
      content: comment.content,
      tacheID: comment.tacheID,
    })
    setEditCommentModal(true)
  }

  const handleProgressChange = (id, value) => {
    setProgressUpdates((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileAttachment = (id, files) => {
    setFileAttachments((prev) => ({ ...prev, [id]: [...(prev[id] || []), ...files] }))
  }

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("task/getMyTasks")
      setTache(response.data || [])
      response.data.forEach(async (task) => {
        await fetchComments(task.id)
      })
    } catch (error) {
      console.log(error)
    }
  }




  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  const validTasks = tache.filter((task) => task.valide)
  const pendingTasks = tache.filter((task) => !task.valide)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Suivi de Progrès du Projet</h1>

      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock size={16} /> Tâches en cours <Badge variant="outline">{pendingTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle size={16} /> Tâches validées <Badge variant="outline">{validTasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">Aucune tâche en cours pour le moment.</p>
               
                
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
                <p className="text-gray-600 text-center">Aucune tâche validée pour le moment.</p>
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
                    <span className="font-medium">Cette tâche a été validée</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

  
      {/* Edit Comment Modal */}
      <Dialog open={editCommentModal} onOpenChange={setEditCommentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le commentaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              placeholder="Votre commentaire"
              
              value={editComment.content}
              onChange={(e) =>
                setEditComment((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded mb-3 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCommentModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateComment}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Avancement
