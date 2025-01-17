import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all tasks for a user by user_id
router.get(
  "/user/:user_id",
  async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("assigned_to", user_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  }
);

//Get tasks for user by user_email
router.get(
  "/user/email/:user_email",
  async (
    req: Request<{ user_email: string }>,
    res: Response
  ): Promise<void> => {
    const { user_email } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("assigned_to", user_email);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  }
);

// Get tasks for a user by user_id that are upcoming
router.get(
  "/user/:user_id/upcoming",
  async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("assigned_to", user_id)
      .gt("start_date", today);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get tasks for a user by user_id under a specific tag
router.get(
  "/user/:user_id/tag/:tag",
  async (
    req: Request<{ user_id: string; tag: string }>,
    res: Response
  ): Promise<void> => {
    const { user_id, tag } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("assigned_to", user_id)
      .ilike("tags", `%${tag}%`);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get tasks for a user by user_id under a specific status
router.get(
  "/user/:user_id/status/:status",
  async (
    req: Request<{ user_id: string; status: string }>,
    res: Response
  ): Promise<void> => {
    const { user_id, status } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("assigned_to", user_id)
      .eq("status", status);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get all tasks
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("antbib_tasks").select("*");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json(data);
});

// Get tasks with specific status
router.get(
  "/status/:status",
  async (req: Request<{ status: string }>, res: Response): Promise<void> => {
    const { status } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("*")
      .eq("status", status);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get subtasks under a specific task
router.get(
  "/:task_id/subtasks",
  async (req: Request<{ task_id: string }>, res: Response): Promise<void> => {
    const { task_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_subtasks")
      .select("*")
      .eq("task_id", task_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get all assignees under a task
router.get(
  "/:task_id/assignees",
  async (req: Request<{ task_id: string }>, res: Response): Promise<void> => {
    const { task_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("assigned_to")
      .eq("task_id", task_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Create task
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    status,
    tags,
    start_date,
    end_date,
    priority,
    created_by,
    assigned_to,
  } = req.body;
  const { data, error } = await supabase.from("antbib_tasks").insert([
    {
      title,
      description,
      status,
      tags,
      start_date,
      end_date,
      priority,
      created_by,
      assigned_to,
    },
  ]);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

// Assign task.assignee to different person (update task.assignee)
router.put(
  "/:task_id/assignee",
  async (req: Request<{ task_id: string }>, res: Response): Promise<void> => {
    const { task_id } = req.params;
    const { assigned_to } = req.body;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .update({ assigned_to })
      .eq("task_id", task_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Update task
router.put(
  "/:task_id",
  async (req: Request<{ task_id: string }>, res: Response): Promise<void> => {
    const { task_id } = req.params;
    const {
      title,
      description,
      status,
      tags,
      start_date,
      end_date,
      priority,
      assigned_to,
    } = req.body;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .update({
        title,
        description,
        status,
        tags,
        start_date,
        end_date,
        priority,
        assigned_to,
      })
      .eq("task_id", task_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Delete task
router.delete(
  "/:task_id",
  async (req: Request<{ task_id: string }>, res: Response): Promise<void> => {
    const { task_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .delete()
      .eq("task_id", task_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

export default router;
