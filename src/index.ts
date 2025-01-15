// src/index.ts
import express, { Express } from "express";
import { Request, Response } from "express-serve-static-core";
import dotenv from "dotenv";
import apiRouter from "./routes/api";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get(
  "/supabase_healthcheck",
  async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from("test").select();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
