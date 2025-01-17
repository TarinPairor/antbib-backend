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
//get all tag under tasks assigned to a specific user
router.get("/user/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { data, error } = yield supabase
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
    const tags = data.map((task) => task.tags).join(",");
    const uniqueTags = [...new Set(tags.split(","))];
    res.status(200).json(uniqueTags);
    // res.status(200).json(tags);
}));
//get all tags from a specific user_email
router.get("/user/email/:user_email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_email } = req.params;
    // get user_id from user_email
    const { data: userData, error: userError } = yield supabase
        .from("antbib_users")
        .select("user_id")
        .eq("user_email", user_email);
    if (userError) {
        res.status(500).json({ error: userError.message });
        return;
    }
    const user_id = userData && userData.length > 0 ? userData[0].user_id : null;
    if (!user_id) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const { data, error } = yield supabase
        .from("antbib_tasks")
        .select("tags")
        .eq("assigned_to", user_id);
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    const tags = data.map((task) => task.tags).join(",");
    const uniqueTags = [...new Set(tags.split(","))];
    res.status(200).json(uniqueTags);
}));
exports.default = router;
