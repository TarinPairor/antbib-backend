import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Api Route Working");
});

export default router;
