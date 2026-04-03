// js/ia-service.js

const IA_API = 'http://localhost:3000'; // Seu servidor na porta 3000

class IAService {
    
    // Gerar tema aleatório
    static async gerarTema() {
        try {
            const response = await fetch(`${IA_API}/gerar-tema`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.tema) {
                return {
                    sucesso: true,
                    tema: data.tema
                };
            } else {
                return {
                    sucesso: false,
                    erro: data.erro || 'Erro ao gerar tema'
                };
            }
        } catch (error) {
            console.error('Erro:', error);
            return {
                sucesso: false,
                erro: 'Erro de conexão com o servidor'
            };
        }
    }

    // Gerar texto de apoio
    static async gerarTextoApoio(tema) {
        try {
            const response = await fetch(`${IA_API}/gerar-texto-apoio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tema: tema })
            });
            
            const data = await response.json();
            
            if (data.textoApoio) {
                return {
                    sucesso: true,
                    textoApoio: data.textoApoio
                };
            } else {
                return {
                    sucesso: false,
                    erro: data.erro || 'Erro ao gerar texto de apoio'
                };
            }
        } catch (error) {
            console.error('Erro:', error);
            return {
                sucesso: false,
                erro: 'Erro de conexão com o servidor'
            };
        }
    }

    // CORRIGIR REDAÇÃO (para o histórico)
    static async corrigirRedacao(redacao) {
        try {
            const response = await fetch(`${IA_API}/corrigir-redacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: redacao.titulo || 'Sem título',
                    texto: redacao.texto,
                    tema: redacao.tema || 'Tema não especificado'
                })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                return {
                    sucesso: true,
                    dados: data.dados
                };
            } else {
                return {
                    sucesso: false,
                    erro: data.erro || 'Erro ao corrigir redação'
                };
            }
        } catch (error) {
            console.error('Erro na correção:', error);
            return {
                sucesso: false,
                erro: 'Erro de conexão com o servidor'
            };
        }
    }

    // Gerar múltiplos temas
    static async gerarMultiplosTemas(quantidade = 5) {
        try {
            const response = await fetch(`${IA_API}/gerar-multiplos-temas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: quantidade })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                return {
                    sucesso: true,
                    dados: data.dados
                };
            } else {
                return {
                    sucesso: false,
                    erro: data.erro || 'Erro ao gerar temas'
                };
            }
        } catch (error) {
            console.error('Erro:', error);
            return {
                sucesso: false,
                erro: 'Erro de conexão com o servidor'
            };
        }
    }

    // Salvar correção no localStorage
    static salvarCorrecao(redacaoId, correcao) {
        try {
            const redacoes = JSON.parse(localStorage.getItem('redacoes') || '[]');
            const index = redacoes.findIndex(r => r.id === redacaoId);
            
            if (index !== -1) {
                redacoes[index].status = 'corrigida';
                redacoes[index].nota = correcao.nota ? (correcao.nota / 100) : 0;
                redacoes[index].feedback = correcao.feedback || 'Correção realizada por IA';
                redacoes[index].correcaoDetalhada = {
                    competencias: correcao.competencias || [],
                    sugestoes: correcao.sugestoes || [],
                    notaTotal: correcao.nota || 0,
                    dataCorrecao: new Date().toISOString()
                };
                
                localStorage.setItem('redacoes', JSON.stringify(redacoes));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao salvar correção:', error);
            return false;
        }
    }
}