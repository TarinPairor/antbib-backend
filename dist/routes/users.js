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
router.get("/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_users")
        .select("*")
        .eq("user_id", user_id)
        .single();
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get user from email
router.get("/email/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { data, error } = yield supabase
        .from("antbib_users")
        .select("*")
        .eq("user_email", email)
        .single();
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Create user in supabase (after logging in)
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user_email } = req.body;
    const { data, error } = yield supabase
        .from("antbib_users")
        .insert([{ username, user_email }]);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(201).json(data);
}));
// Update username
router.put("/:user_id/username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { username } = req.body;
    const { data, error } = yield supabase
        .from("antbib_users")
        .update({ username })
        .eq("user_id", user_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
// Get all users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase.from("antbib_users").select("*");
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
exports.default = router;
