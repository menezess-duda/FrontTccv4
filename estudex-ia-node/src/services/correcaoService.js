// src/services/correcaoService.js

const Redacao = require('../models/Redacao');

class CorrecaoService {
    
    // Método principal de correção
    async corrigirRedacao(titulo, texto, tema) {
        const redacao = new Redacao(titulo, texto, tema);
        
        // Análise por competências
        this.analisarCompetencia1(redacao); // Domínio da norma culta
        this.analisarCompetencia2(redacao); // Compreensão do tema
        this.analisarCompetencia3(redacao); // Organização dos argumentos
        this.analisarCompetencia4(redacao); // Mecanismos linguísticos
        this.analisarCompetencia5(redacao); // Proposta de intervenção
        
        // Calcular nota total
        redacao.calcularNotaTotal();
        
        // Gerar feedback geral
        this.gerarFeedbackGeral(redacao);
        
        return redacao;
    }

    // Competência 1: Domínio da norma culta
    analisarCompetencia1(redacao) {
        const texto = redacao.texto;
        let nota = 200; // Começa com nota máxima
        const feedback = [];
        
        // Verificar erros comuns
        const erros = {
            ortografia: (texto.match(/[^\s]+\s+[^\s]+/g) || []).length > 0 ? this.verificarOrtografia(texto) : 0,
            concordancia: this.verificarConcordancia(texto),
            pontuacao: this.verificarPontuacao(texto),
            paragrafacao: this.verificarParagrafacao(texto)
        };
        
        // Calcular desconto baseado nos erros
        if (erros.ortografia > 5) nota -= 40;
        else if (erros.ortografia > 2) nota -= 20;
        
        if (erros.concordancia > 3) nota -= 40;
        else if (erros.concordancia > 1) nota -= 20;
        
        if (erros.pontuacao < 0.7) nota -= 20; // Menos de 70% de pontuação correta
        
        if (erros.paragrafacao < 3) nota -= 40; // Menos de 3 parágrafos
        
        // Garantir nota mínima de 40 (zero na competência 1 é 40)
        nota = Math.max(40, Math.min(200, nota));
        
        // Feedback específico
        if (nota >= 180) {
            feedback.push("Excelente domínio da norma culta, pouquíssimos desvios.");
        } else if (nota >= 140) {
            feedback.push("Bom domínio, mas com alguns desvios gramaticais.");
        } else if (nota >= 100) {
            feedback.push("Domínio mediano, com diversos desvios que comprometem parcialmente.");
        } else {
            feedback.push("Domínio insuficiente, muitos desvios graves.");
        }
        
        redacao.competencias.competencia1.nota = Math.round(nota / 40) * 40; // Arredondar para múltiplos de 40
        redacao.competencias.competencia1.feedback = feedback.join(" ");
    }

    // Competência 2: Compreensão do tema
    analisarCompetencia2(redacao) {
        const texto = redacao.texto.toLowerCase();
        const tema = redacao.tema.toLowerCase();
        let nota = 200;
        const feedback = [];
        
        // Extrair palavras-chave do tema
        const palavrasTema = tema.split(/\s+/).filter(p => p.length > 3);
        let palavrasEncontradas = 0;
        
        palavrasTema.forEach(palavra => {
            if (texto.includes(palavra)) {
                palavrasEncontradas++;
            }
        });
        
        // Calcular percentual de cobertura do tema
        const cobertura = palavrasEncontradas / palavrasTema.length;
        
        if (cobertura >= 0.8) {
            nota = 200;
            feedback.push("Excelente compreensão do tema, desenvolvimento completo.");
        } else if (cobertura >= 0.6) {
            nota = 160;
            feedback.push("Boa compreensão, mas poderia explorar mais aspectos do tema.");
        } else if (cobertura >= 0.4) {
            nota = 120;
            feedback.push("Compreensão parcial, tangenciou o tema em alguns momentos.");
        } else {
            nota = 80;
            feedback.push("Compreensão insuficiente, fuga parcial do tema.");
        }
        
        redacao.competencias.competencia2.nota = nota;
        redacao.competencias.competencia2.feedback = feedback.join(" ");
    }

    // Competência 3: Organização dos argumentos
    analisarCompetencia3(redacao) {
        const texto = redacao.texto;
        let nota = 200;
        const feedback = [];
        
        // Verificar estrutura (introdução, desenvolvimento, conclusão)
        const paragrafos = texto.split('\n\n').filter(p => p.trim().length > 0);
        const temIntroducao = paragrafos.length >= 1;
        const temDesenvolvimento = paragrafos.length >= 2;
        const temConclusao = paragrafos.length >= 3;
        
        // Verificar conectivos
        const conectivos = ['portanto', 'assim', 'dessa forma', 'além disso', 'contudo', 'entretanto', 'porém', 'também'];
        let conectivosEncontrados = 0;
        conectivos.forEach(con => {
            if (texto.toLowerCase().includes(con)) {
                conectivosEncontrados++;
            }
        });
        
        // Calcular nota
        if (temIntroducao && temDesenvolvimento && temConclusao && conectivosEncontrados >= 3) {
            nota = 200;
            feedback.push("Excelente organização, com introdução, desenvolvimento, conclusão e boa variedade de conectivos.");
        } else if (temIntroducao && temDesenvolvimento && temConclusao) {
            nota = 160;
            feedback.push("Boa organização, mas poderia usar mais conectivos para conectar as ideias.");
        } else if (temIntroducao && temDesenvolvimento) {
            nota = 120;
            feedback.push("Organização regular, falta uma conclusão adequada.");
        } else {
            nota = 80;
            feedback.push("Organização insuficiente, texto mal estruturado.");
        }
        
        redacao.competencias.competencia3.nota = nota;
        redacao.competencias.competencia3.feedback = feedback.join(" ");
    }

    // Competência 4: Mecanismos linguísticos
    analisarCompetencia4(redacao) {
        const texto = redacao.texto;
        let nota = 200;
        const feedback = [];
        
        // Verificar variedade vocabular
        const palavras = texto.split(/\s+/);
        const palavrasUnicas = new Set(palavras.map(p => p.toLowerCase()));
        const variedade = palavrasUnicas.size / palavras.length;
        
        // Verificar coesão (pronomes, conjunções)
        const elementosCoesivos = ['este', 'esta', 'esse', 'essa', 'aquele', 'aquela', 'o qual', 'a qual', 'cujo'];
        let coesivosEncontrados = 0;
        elementosCoesivos.forEach(elem => {
            if (texto.toLowerCase().includes(elem)) {
                coesivosEncontrados++;
            }
        });
        
        if (variedade > 0.6 && coesivosEncontrados >= 3) {
            nota = 200;
            feedback.push("Excelente uso de mecanismos linguísticos, boa variedade e coesão.");
        } else if (variedade > 0.5 && coesivosEncontrados >= 2) {
            nota = 160;
            feedback.push("Bom uso, mas poderia diversificar mais o vocabulário.");
        } else if (variedade > 0.4) {
            nota = 120;
            feedback.push("Uso regular, vocabulário repetitivo e pouca coesão.");
        } else {
            nota = 80;
            feedback.push("Uso insuficiente, texto pouco coeso e vocabulário limitado.");
        }
        
        redacao.competencias.competencia4.nota = nota;
        redacao.competencias.competencia4.feedback = feedback.join(" ");
    }

    // Competência 5: Proposta de intervenção
    analisarCompetencia5(redacao) {
        const texto = redacao.texto.toLowerCase();
        let nota = 200;
        const feedback = [];
        
        // Verificar se tem proposta de intervenção (geralmente no último parágrafo)
        const paragrafos = texto.split('\n\n');
        const ultimoParagrafo = paragrafos[paragrafos.length - 1] || "";
        
        // Elementos de uma boa proposta
        const elementos = {
            agente: ['governo', 'estado', 'ministério', 'sociedade', 'escola', 'família', 'mídia'],
            acao: ['criar', 'implementar', 'desenvolver', 'promover', 'estabelecer', 'criar'],
            meio: ['por meio de', 'através de', 'via', 'com', 'através'],
            finalidade: ['para', 'com o objetivo de', 'a fim de', 'visando']
        };
        
        let elementosEncontrados = 0;
        
        // Verificar cada elemento
        for (let tipo in elementos) {
            elementos[tipo].forEach(palavra => {
                if (ultimoParagrafo.includes(palavra)) {
                    elementosEncontrados++;
                }
            });
        }
        
        if (elementosEncontrados >= 8) {
            nota = 200;
            feedback.push("Excelente proposta, detalhada com agente, ação, meio e finalidade.");
        } else if (elementosEncontrados >= 5) {
            nota = 160;
            feedback.push("Boa proposta, mas poderia detalhar mais os elementos.");
        } else if (elementosEncontrados >= 3) {
            nota = 120;
            feedback.push("Proposta superficial, faltam detalhes importantes.");
        } else {
            nota = 80;
            feedback.push("Proposta insuficiente ou inexistente.");
        }
        
        redacao.competencias.competencia5.nota = nota;
        redacao.competencias.competencia5.feedback = feedback.join(" ");
    }

    // Gerar feedback geral
    gerarFeedbackGeral(redacao) {
        const sugestoes = [];
        const pontosFortes = [];
        const pontosFracos = [];
        
        // Analisar cada competência
        for (let comp in redacao.competencias) {
            const nota = redacao.competencias[comp].nota;
            
            if (nota >= 160) {
                pontosFortes.push(redacao.competencias[comp].nome);
            } else if (nota <= 120) {
                pontosFracos.push(redacao.competencias[comp].nome);
                
                // Sugestões específicas
                switch(comp) {
                    case 'competencia1':
                        sugestoes.push("Revise gramática, pontuação e concordância.");
                        break;
                    case 'competencia2':
                        sugestoes.push("Leia mais sobre o tema e mantenha o foco no assunto proposto.");
                        break;
                    case 'competencia3':
                        sugestoes.push("Estruture melhor seus parágrafos e use mais conectivos.");
                        break;
                    case 'competencia4':
                        sugestoes.push("Amplie seu vocabulário e use mais elementos de coesão.");
                        break;
                    case 'competencia5':
                        sugestoes.push("Detalhe sua proposta com agente, ação, meio e finalidade.");
                        break;
                }
            }
        }
        
        redacao.sugestoes = sugestoes;
        redacao.pontosFortes = pontosFortes;
        redacao.pontosFracos = pontosFracos;
    }

    // Utilitários
    verificarOrtografia(texto) {
        // Simulação simples - em produção, usaria um dicionário
        return Math.floor(Math.random() * 3); // 0-2 erros simulados
    }

    verificarConcordancia(texto) {
        // Simulação simples
        return Math.floor(Math.random() * 2); // 0-1 erros simulados
    }

    verificarPontuacao(texto) {
        // Percentual de pontuação correta (simulado)
        return 0.7 + (Math.random() * 0.3);
    }

    verificarParagrafacao(texto) {
        const paragrafos = texto.split('\n\n').filter(p => p.trim().length > 0);
        return paragrafos.length;
    }
}

module.exports = new CorrecaoService();