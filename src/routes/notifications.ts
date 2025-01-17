import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Notification is created when assignment is changed
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { user_id, message } = req.body;
  const { data, error } = await supabase
    .from("antbib_notifications")
    .insert([{ user_id, message }]);

  if (error) res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

//create notificatoin for specific user using user_email
// router.post("/email", async (req: Request, res: Response): Promise<void> => {
//   const { user_email, message } = req.body;
//   const { data: userData, error: userError } = await supabase
//     .from("antbib_users")
//     .select("user_id")
//     .eq("user_email", user_email);

//   if (userError) {
//     res.status(500).json({ error: userError.message });
//     return;
//   }

//   const user_id = userData[0].user_id;
//   const { data, error } = await supabase
//     .from("antbib_notifications")
//     .insert([{ user_id, message }]);

//   if (error) res.status(500).json({ error: error.message });
//   res.status(201).json(data);
// });

// See notifications for specific user_email
router.get(
  "/user/email/:user_email",
  async (
    req: Request<{ user_email: string }>,
    res: Response
  ): Promise<void> => {
    const { user_email } = req.params;
    const { data: userData, error: userError } = await supabase
      .from("antbib_users")
      .select("user_id")
      .eq("user_email", user_email);

    if (userError) {
      res.status(500).json({ error: userError.message });
      return;
    }

    const user_id = userData[0].user_id;
    const { data, error } = await supabase
      .from("antbib_notifications")
      .select("*")
      .eq("user_id", user_id);

    if (error) res.status(500).json({ error: error.message });
    res.status(200).json(data);
  }
);

export default router;
