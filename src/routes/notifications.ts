// import { Router, Request, Response } from "express";
// import { createClient } from "@supabase/supabase-js";

// const router = Router();
// const supabaseUrl = process.env.SUPABASE_URL || "";
// const supabaseKey = process.env.SUPABASE_KEY || "";
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Notification is created when assignment is changed
// router.post("/", async (req: Request, res: Response): Promise<void> => {
//   const { user_id, message } = req.body;
//   const { data, error } = await supabase
//     .from("antbib_notifications")
//     .insert([{ user_id, message }]);

//   if (error) res.status(500).json({ error: error.message });
//   res.status(201).json(data);
// });

// // See notifications for specific user_id
// router.get(
//   "/user/:user_id",
//   async (req: Request<{ user_id: string }>, res: Response): Promise<void> => {
//     const { user_id } = req.params;
//     const { data, error } = await supabase
//       .from("antbib_notifications")
//       .select("*")
//       .eq("user_id", user_id);

//     if (error) res.status(500).json({ error: error.message });
//     res.status(200).json(data);
//   }
// );

// export default router;
