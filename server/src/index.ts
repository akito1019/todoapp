import express from "express";
import type { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const PORT = 8080;

app.use(express.json());
const prisma = new PrismaClient();

app.get("/allTodos", async (req: Request, res: Response) => {
  // 全てのTodoを取得する
  const allTodos = await prisma.todo.findMany();
  return res.json(allTodos);
});

app.post("/createTodo", async (req: Request, res: Response) => {
  try {
    // Todoを作成する
    const { title, isCompleted } = req.body;
    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    });
    return res.json(createTodo);
  } catch (error) {
    return res.json(error);
  }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, isCompleted } = req.body;
    const editTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        isCompleted,
      },
    });
    return res.json(editTodo);
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.delete("/deleteTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleteTodo = await prisma.todo.delete({
      where: { id },
    });
    return res.json(deleteTodo);
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.listen(PORT, () => console.log(`Server is running🏃`));
