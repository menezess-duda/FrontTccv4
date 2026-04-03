// src/controllers/correcaoController.js

const correcaoService = require('../services/correcaoService');

class CorrecaoController {
    
    // POST /api/ia/corrigir
    async corrigirRedacao(req, res) {
        try {
            const { titulo, texto, tema } = req.body;
            
            
            if (texto.split(/\s+/).length < 50) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "A redação deve ter pelo menos 50 palavras"
                });
            }
            
            // Corrigir redação
            const redacaoCorrigida = await correcaoService.corrigirRedacao(titulo, texto, tema);
            
            res.json({
                sucesso: true,
                mensagem: "Redação corrigida com sucesso!",
                dados: redacaoCorrigida.toJSON()
            });
            
        } catch (error) {
            console.error('Erro na correção:', error);
            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao corrigir redação"
            });
        }
    }

    // GET /api/ia/competencias
    getCompetencias(req, res) {
        res.json({
            sucesso: true,
            dados: {
                competencia1: {
                    nome: "Domínio da norma culta",
                    descricao: "Avalia o conhecimento gramatical e ortográfico",
                    peso: 200
                },
                competencia2: {
                    nome: "Compreensão do tema",
                    descricao: "Avalia se o texto desenvolve o tema proposto",
                    peso: 200
                },
                competencia3: {
                    nome: "Organização dos argumentos",
                    descricao: "Avalia a estrutura e coerência do texto",
                    peso: 200
                },
                competencia4: {
                    nome: "Mecanismos linguísticos",
                    descricao: "Avalia a coesão e variedade vocabular",
                    peso: 200
                },
                competencia5: {
                    nome: "Proposta de intervenção",
                    descricao: "Avalia a solução apresentada para o problema",
                    peso: 200
                }
            }
        });
    }
}

module.exports = new CorrecaoController();