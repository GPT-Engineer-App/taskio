import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveTask = (task) => {
    if (taskToEdit) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, { ...task, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setTaskToEdit(null)}>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{taskToEdit ? "Edit Task" : "Add Task"}</DialogTitle>
            </DialogHeader>
            <TaskForm task={taskToEdit} onSave={handleSaveTask} onCancel={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={() => handleEditTask(task)} onDelete={() => handleDeleteTask(task.id)} />
        ))}
      </div>
    </div>
  );
};

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState(task?.priority || "Low");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: task?.id, title, description, dueDate, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const TaskCard = ({ task, onEdit, onDelete }) => (
  <Card>
    <CardHeader>
      <CardTitle>{task.title}</CardTitle>
    </CardHeader>
    <CardContent>
      {task.description && <p>{task.description}</p>}
      {task.dueDate && <p>Due: {format(new Date(task.dueDate), "PPP")}</p>}
      <p>Priority: {task.priority}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onEdit}>Edit</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </CardContent>
  </Card>
);

export default Tasks;