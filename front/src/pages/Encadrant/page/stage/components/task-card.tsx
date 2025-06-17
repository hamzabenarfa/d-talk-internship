// @ts-nocheck
import { useState } from "react"
import { Calendar, Clock, Edit2, Trash2, MessageSquare, Paperclip, Send, CheckCircle, MoreVertical, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import axiosInstance from "../../../../../axios-instance"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"

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
  setNewTask,
  setShowModal,
  setTaskId,
  setIsEditing,
}) => {

  const role = useSelector((state) => state.auth.user.user);

  const [showComments, setShowComments] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const [selectedFiles, setSelectedFiles] = useState([])

  const calculateDeadlineDays = (deadline) => {
    const now = new Date()
    const end = new Date(deadline)
    const diff = end - now
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      })
    } catch (error) {
      return "Date inconnue"
    }
  }

  const onValidateToggle = async (taskId) => {
    try {
      await axiosInstance.put(`task/valide/${taskId}`);
    } catch (error) {
      console.error("Error updating task validation status:", error);
    }
  };
  const handleEditTask = (task) => {
    setNewTask({
      name: task.name,
      description: task.description,
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
    })
    setTaskId(task.id)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`task/delete/${taskId}`)
      toast.success("Tâche supprimée avec succès")

    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Erreur lors de la suppression de la tâche")
    }
  }

  const handleFileChange = (e, taskId) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    handleFileAttachment(taskId, files)
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  const deadlineDays = calculateDeadlineDays(task.deadline)
  const isUrgent = deadlineDays <= 2
  const taskComments = comments[task.id] || []

  return (
    <Card className={cn("border", isUrgent ? "border-red-200" : "border-gray-200")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-xl">{task.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={isUrgent ? "destructive" : "outline"}
              className={cn("flex items-center gap-1", isUrgent ? "bg-red-100 text-red-700 hover:bg-red-100" : "")}
            >
              <Clock size={12} />
              {deadlineDays} {deadlineDays > 1 ? "jours" : "jour"} restants
            </Badge>
          </div>
        </div>
        {currentUser && task.userId === currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditTask(task)}>
              <Edit2 size={14} className="mr-2" /> Modifier
            </DropdownMenuItem>
            {
                role.role ==="PROF_SUPERVISOR" &&(
            <DropdownMenuItem onClick={() => onValidateToggle(task.id)}>
               {task.valide ? (<>            <XCircle className="h-16 w-16 text-red-600 mr-2" />
                <h1>Invalider</h1></>) : (<><CheckCircle className="h-16 w-16 text-green-600 mr-2" /><h1>Valider</h1></>)}
            </DropdownMenuItem>)}
            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600 focus:text-red-600">
              <Trash2 size={14} className="mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{task.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar size={16} />
          <span>
            Échéance:{" "}
            {new Date(task.deadline).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <Button variant="outline" size="sm" className="mb-4" onClick={() => setShowComments(!showComments)}>
          <MessageSquare size={16} className="mr-2" />
          {showComments ? "Masquer les commentaires" : "Afficher les commentaires"}
          <Badge variant="secondary" className="ml-2">
            {taskComments.length}
          </Badge>
        </Button>

        {showComments && (
          <div className="space-y-4 mb-4">
            <h3 className="font-medium text-sm text-gray-700">Commentaires</h3>

            {taskComments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun commentaire pour le moment</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                {taskComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(comment.user?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium capitalize">{comment.User?.nom || "Utilisateur"}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                      </div>
                      {currentUser && comment.auteurID === currentUser && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleOpenEditCommentModal(comment)}
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={() => handleDeleteComment(comment.id, task.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={progressUpdates[task.id] || ""}
                onChange={(e) => handleProgressChange(task.id, e.target.value)}
                className="mb-2"
                rows={3}
              />

              <div className="flex items-center gap-2">
                <div className="relative">

                </div>

                <Button
                  size="sm"
                  onClick={() => handleSubmit(task.id)}
                  disabled={!progressUpdates[task.id]}
                  className="ml-auto"
                >
                  <Send size={16} className="mr-2" />
                  Envoyer
                </Button>
              </div>

              
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskCard
