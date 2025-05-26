"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, ListTodo } from "lucide-react"
import type { Task } from "@/app/page"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const todoTasks = tasks.filter((task) => task.status === "to-do").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const doneTasks = tasks.filter((task) => task.status === "done").length

  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  const completionRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completed",
      value: doneTasks,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.title === "Completed" && totalTasks > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {totalTasks > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{highPriorityTasks}</div>
                <div className="text-xs text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{mediumPriorityTasks}</div>
                <div className="text-xs text-gray-600">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{lowPriorityTasks}</div>
                <div className="text-xs text-gray-600">Low Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
