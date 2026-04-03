// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({}); // pega automaticamente GEMINI_API_KEY

// ===== ENDPOINTS EXISTENTES =====

app.post("/gerar-tema", async (req, res) => {
  try {
    const temaResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere um tema de redação no estilo ENEM, atual e relevante. Responda APENAS com o tema, sem explicações, sem introduções, sem 'Aqui está'. Exemplo de formato: 'Os desafios da inclusão digital no Brasil'"
    });

    const tema = temaResponse.text?.trim() || "Tema não disponível no momento.";
    res.json({ tema });

  } catch (error) {
    console.error("❌ ERRO GEMINI:", error);
    res.status(500).json({ erro: error.message });
  }
});

app.post("/gerar-texto-apoio", async (req, res) => {
  try {
    const { tema } = req.body;
    
    if (!tema) {
      return res.status(400).json({ erro: "Tema não fornecido" });
    }
    
    const prompt = `Crie um TEXTO MOTIVADOR CURTO E SIMPLES para o tema de redação: "${tema}"

O texto deve:
- Ter APENAS 1 ou 2 parágrafos curtos
- Contextualizar o tema de forma simples
- Trazer 1 ou 2 dados ou fatos relevantes
- Terminar com uma pergunta reflexiva

NÃO escreva uma redação completa
NÃO dê opiniões pessoais
NÃO use linguagem rebuscada
NÃO use frases como "Aqui está" ou "Texto motivador"

EXEMPLO (para outro tema):
"O acesso à informação digital tornou-se parte fundamental do cotidiano dos brasileiros. Dados do IBGE apontam que mais de 80% dos lares possuem acesso à internet, especialmente entre os jovens. No entanto, esse universo digital também apresenta desafios relacionados à privacidade e à disseminação de notícias falsas.

Diante desse cenário, como garantir que a população utilize as ferramentas digitais de forma crítica e consciente?"

AGORA crie um texto motivador simples seguindo esse modelo para o tema: "${tema}"`;

    const textoResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    let textoApoio = textoResponse.text?.trim() || "";
    
    // Pós-processamento
    textoApoio = textoApoio.replace(/^(Texto motivador:?|Aqui está|Claro|Com base nisso|Texto de apoio:?)/i, '').trim();
    
    res.json({ textoApoio });

  } catch (error) {
    console.error("❌ ERRO AO GERAR TEXTO DE APOIO:", error);
    res.status(500).json({ erro: error.message });
  }
});

// ===== NOVO ENDPOINT PARA CORREÇÃO COM IA =====

app.post("/corrigir-redacao", async (req, res) => {
  try {
    const { titulo, texto, tema } = req.body;
    
    if (!titulo || !texto || !tema) {
      return res.status(400).json({ 
        erro: "Título, texto e tema são obrigatórios" 
      });
    }

    if (texto.split(' ').length < 50) {
      return res.status(400).json({ 
        erro: "A redação deve ter pelo menos 50 palavras" 
      });
    }

    // Prompt para correção pela IA
    const prompt = `Você é um corretor de redações do ENEM. Analise a redação abaixo e forneça um feedback detalhado seguindo as 5 competências do ENEM.

TEMA: ${tema}
TÍTULO: ${titulo}
REDAÇÃO:
${texto}

Forneça a correção no seguinte formato JSON (responda APENAS com o JSON, sem explicações adicionais):

{
  "nota": (nota total de 0 a 1000),
  "competencias": [
    {
      "nome": "Domínio da norma culta",
      "nota": (nota de 0 a 200),
      "feedback": "feedback específico para esta competência"
    },
    {
      "nome": "Compreensão do tema",
      "nota": (nota de 0 a 200),
      "feedback": "feedback específico para esta competência"
    },
    {
      "nome": "Organização dos argumentos",
      "nota": (nota de 0 a 200),
      "feedback": "feedback específico para esta competência"
    },
    {
      "nome": "Mecanismos linguísticos",
      "nota": (nota de 0 a 200),
      "feedback": "feedback específico para esta competência"
    },
    {
      "nome": "Proposta de intervenção",
      "nota": (nota de 0 a 200),
      "feedback": "feedback específico para esta competência"
    }
  ],
  "feedback": "feedback geral sobre a redação",
  "sugestoes": ["sugestão 1", "sugestão 2", "sugestão 3"]
}`;

    const correcaoResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    let correcaoTexto = correcaoResponse.text?.trim() || "";
    
    // Remover markdown de código se houver
    correcaoTexto = correcaoTexto.replace(/```json|```/g, '').trim();
    
    // Tentar parse do JSON
    let correcao;
    try {
      correcao = JSON.parse(correcaoTexto);
    } catch (e) {
      console.error("Erro ao parsear JSON:", e);
      // Fallback para formato estruturado
      correcao = {
        nota: 600,
        competencias: [
          { nome: "Domínio da norma culta", nota: 120, feedback: "Análise não disponível" },
          { nome: "Compreensão do tema", nota: 120, feedback: "Análise não disponível" },
          { nome: "Organização dos argumentos", nota: 120, feedback: "Análise não disponível" },
          { nome: "Mecanismos linguísticos", nota: 120, feedback: "Análise não disponível" },
          { nome: "Proposta de intervenção", nota: 120, feedback: "Análise não disponível" }
        ],
        feedback: "Correção automática realizada, mas houve erro no processamento.",
        sugestoes: ["Tente novamente mais tarde"]
      };
    }

    res.json({
      sucesso: true,
      dados: correcao
    });

  } catch (error) {
    console.error("❌ ERRO NA CORREÇÃO:", error);
    res.status(500).json({ 
      sucesso: false,
      erro: error.message 
    });
  }
});

// ===== ENDPOINT PARA GERAR MÚLTIPLOS TEMAS =====

app.post("/gerar-multiplos-temas", async (req, res) => {
  try {
    const { quantidade } = req.body;
    const numTemas = quantidade || 5;
    
    const prompt = `Gere ${numTemas} temas de redação no estilo ENEM, atuais e relevantes.
    Responda APENAS com os temas, um por linha, sem numeração, sem explicações.
    Exemplo de formato:
    Desafios da inclusão digital no Brasil
    A importância da leitura na formação do indivíduo`;

    const temasResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    const temasTexto = temasResponse.text?.trim() || "";
    const temas = temasTexto.split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map((texto, index) => ({
        id: Date.now() + index,
        texto: texto
      }));

    res.json({ 
      sucesso: true,
      dados: temas 
    });

  } catch (error) {
    console.error("❌ ERRO AO GERAR MÚLTIPLOS TEMAS:", error);
    res.status(500).json({ 
      sucesso: false,
      erro: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`✅ Servidor IA rodando na porta ${PORT}`);
  console.log(`📌 Endpoints disponíveis:`);
  console.log(`   POST /gerar-tema`);
  console.log(`   POST /gerar-texto-apoio`);
  console.log(`   POST /corrigir-redacao`);
  console.log(`   POST /gerar-multiplos-temas`);
  console.log(`=================================`);
});