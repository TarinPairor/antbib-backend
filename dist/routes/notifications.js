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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Notification is created when assignment is changed
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, message } = req.body;
    const { data, error } = yield supabase
        .from("antbib_notifications")
        .insert([{ user_id, message }]);
    if (error)
        res.status(500).json({ error: error.message });
    res.status(201).json(data);
}));
// See notifications for specific user_id
router.get("/user/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { data, error } = yield supabase
        .from("antbib_notifications")
        .select("*")
        .eq("user_id", user_id);
    if (error)
        res.status(500).json({ error: error.message });
    res.status(200).json(data);
}));
exports.default = router;
