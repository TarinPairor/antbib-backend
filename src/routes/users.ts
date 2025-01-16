import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get user_id from email
// router.get(
//   "/email/:email",
//   async (req: Request<{ email: string }>, res: Response): Promise<void> => {
//     const { email } = req.params;
//     const { data, error } = await supabase
//       .from("antbib_users")
//       .select("user_id")
//       .eq("user_email", email)
//       .single();

//     if (error) {
//       res.status(500).json({ error: error.message });
//       return;
//     }
//     res.status(200).json(data);
//   }
// );

// Get user from user_id
router.get(
  "/:user_id",
  async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get user from email
router.get(
  "/email/:email",
  async (req: Request<{ email: string }>, res: Response): Promise<void> => {
    const { email } = req.params;
    const { data, error } = await supabase
      .from("antbib_users")
      .select("*")
      .eq("user_email", email)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Create user in supabase (after logging in)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { username, user_email } = req.body;
  const { data, error } = await supabase
    .from("antbib_users")
    .insert([{ username, user_email }]);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

// Update username
router.put(
  "/:user_id/username",
  async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { username } = req.body;
    const { data, error } = await supabase
      .from("antbib_users")
      .update({ username })
      .eq("user_id", user_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

// Get all users
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("antbib_users").select("*");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json(data);
});

export default router;
