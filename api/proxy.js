import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Cole aqui o link do seu Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx68kIYLxZsN0eDyZfkCSLnRwEHjhArsEjKXdUyFrIJ2IAOIspf94n2jkqST2FOhZk19g/exec";

// GET — consulta os dados da planilha
app.get("/dados", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ status: "erro", mensagem: "Falha ao buscar dados" });
  }
});

// POST — envia uma compra para o Apps Script
app.post("/comprar", async (req, res) => {
  try {
    const params = new URLSearchParams(req.body);
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: params,
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro ao enviar compra:", error);
    res.status(500).json({ status: "erro", mensagem: "Falha ao enviar compra" });
  }
});

export default app;
