// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/enviar", async (req, res) => {
  const r = await fetch("https://script.google.com/macros/s/AKfycbyapZ0u8gL8jO1fdPsZEKQWsbbH0K592FL4gB_qBlUzD5K6n60HBtT2dpNBLdFHoJNYaA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const json = await r.text();
  res.send(json);
});

app.get("/presente", async (req, res) => {
  const dados = {
    nome: req.query.nome,
    quantidade: req.query.quantidade,
    limite: req.query.limite,
    comprador: req.query.comprador
  };

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyapZ0u8gL8jO1fdPsZEKQWsbbH0K592FL4gB_qBlUzD5K6n60HBtT2dpNBLdFHoJNYaA/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    }
  );

  const text = await response.text();
  res.send(text);
});




app.listen(3000, () => console.log("Proxy rodando 3000"));