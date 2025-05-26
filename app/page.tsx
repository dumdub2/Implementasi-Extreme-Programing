"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Plus } from "lucide-react"

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
  createdAt: Date
  updatedAt: Date
}

export default function TaskManagementApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskease-tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }))
        setTasks(parsedTasks)
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskease-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
    setShowForm(false)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">TaskEasy</h1>
          </div>
          <p className="text-lg text-gray-600">Lightweight Task Management for Agile Teams</p>
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingTask ? "Edit Task" : "Create New Task"}
                </CardTitle>
                <CardDescription>{editingTask ? "Update task details" : "Add a new task to your list"}</CardDescription>
              </CardHeader>
              <CardContent>
                {showForm || editingTask ? (
                  <TaskForm
                    onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
                    onCancel={handleCancelEdit}
                    initialData={editingTask || undefined}
                    isEditing={!!editingTask}
                  />
                ) : (
                  <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Organize and track your tasks by status and priority</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="to-do">To Do</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="done">Done</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <TaskList
                      tasks={tasks}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="to-do" className="mt-4">
                    <TaskList
                      tasks={tasks.filter((task) => task.status === "to-do")}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="in-progress" className="mt-4">
                    <TaskList
                      tasks={tasks.filter((task) => task.status === "in-progress")}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="done" className="mt-4">
                    <TaskList
                      tasks={tasks.filter((task) => task.status === "done")}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
