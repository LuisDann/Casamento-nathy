import fetch from "node-fetch";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx68kIYLxZsN0eDyZfkCSLnRwEHjhArsEjKXdUyFrIJ2IAOIspf94n2jkqST2FOhZk19g/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ status: "erro", mensagem: "Método não permitido" });
    return;
  }

  try {
    const params = new URLSearchParams(req.body);
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: params
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao enviar compra:", error);
    res.status(500).json({ status: "erro", mensagem: "Falha ao enviar compra" });
  }
}
