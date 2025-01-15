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
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
app.use(express_1.default.json());
app.use("/api", api_1.default);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/supabase_healthcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase.from("test").select();
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
