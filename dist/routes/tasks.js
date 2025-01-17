"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Get all tasks for a user by user_id
router.get("/user/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("assigned_to", user_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
//Get tasks for user by user_email
router.get("/user/email/:user_email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_email } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("assigned_to", user_email);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get tasks for a user by user_id that are upcoming
router.get("/user/:user_id/upcoming", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("assigned_to", user_id)
        .gt("start_date", today);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get tasks for a user by user_id under a specific tag
router.get("/user/:user_id/tag/:tag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, tag } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("assigned_to", user_id)
        .ilike("tags", `%${tag}%`);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get tasks for a user by user_id under a specific status
router.get("/user/:user_id/status/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, status } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("assigned_to", user_id)
        .eq("status", status);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get all tasks
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase.from("antbib_tasks").select("*");
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get tasks with specific status
router.get("/status/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("*")
        .eq("status", status);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get subtasks under a specific task
router.get("/:task_id/subtasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_subtasks")
        .select("*")
        .eq("task_id", task_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get all assignees under a task
router.get("/:task_id/assignees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("assigned_to")
        .eq("task_id", task_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Create task
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, tags, start_date, end_date, priority, created_by, assigned_to, } = req.body;
    const { data, error } = yield supabase.from("antbib_tasks").insert([
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
}));
// Assign task.assignee to different person (update task.assignee)
router.put("/:task_id/assignee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id } = req.params;
    const { assigned_to } = req.body;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .update({ assigned_to })
        .eq("task_id", task_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Update task
router.put("/:task_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id } = req.params;
    const { title, description, status, tags, start_date, end_date, priority, assigned_to, } = req.body;
    const { data, error } = yield supabase
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
}));
// Delete task
router.delete("/:task_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .delete()
        .eq("task_id", task_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
exports.default = router;
