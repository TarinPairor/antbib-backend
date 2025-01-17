import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

//get all tag under tasks assigned to a specific user
router.get(
  "/user/:user_id",
  async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("tags")
      .eq("assigned_to", user_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    // data is an array of objects with the following structure:
    // [
    //   {
    //     "tags": "urgent,meeting"
    //   },
    //   {
    //     "tags": "america,travel"
    //   }
    // ]
    // so instead you should join the tags into a single string with unique values
    // like this:
    const tags = data.map((task: any) => task.tags).join(",");
    const uniqueTags = [...new Set(tags.split(","))];
    res.status(200).json(uniqueTags);
    // res.status(200).json(tags);
  }
);

//get all tags from a specific user_email
router.get(
  "/user/email/:user_email",
  async (
    req: Request<{ user_email: string }>,
    res: Response
  ): Promise<void> => {
    const { user_email } = req.params;

    // get user_id from user_email
    const { data: userData, error: userError } = await supabase
      .from("antbib_users")
      .select("user_id")
      .eq("user_email", user_email);

    if (userError) {
      res.status(500).json({ error: userError.message });
      return;
    }

    const user_id =
      userData && userData.length > 0 ? userData[0].user_id : null;

    if (!user_id) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { data, error } = await supabase
      .from("antbib_tasks")
      .select("tags")
      .eq("assigned_to", user_id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const tags = data.map((task: any) => task.tags).join(",");
    const uniqueTags = [...new Set(tags.split(","))];
    res.status(200).json(uniqueTags);
  }
);

export default router;
