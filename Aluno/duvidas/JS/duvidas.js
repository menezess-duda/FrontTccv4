// ==================== CONFIGURAÇÃO ====================
const API_URL = 'http://localhost:8080/duvidas';
const DISCIPLINAS_API_URL = 'http://localhost:8080/disciplinas';

// ID do aluno logado (busca do localStorage ou padrão 1)
let alunoLogadoId = localStorage.getItem('alunoId') ? parseInt(localStorage.getItem('alunoId')) : 1;

// Cache de dados
let disciplinasList = [];
let todasDuvidas = [];

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando página de dúvidas...');
    
    // Configurar o ID do aluno no input
    const alunoInput = document.getElementById('alunoId');
    if (alunoInput) {
        alunoInput.value = alunoLogadoId;
        alunoInput.addEventListener('change', (e) => {
            alunoLogadoId = parseInt(e.target.value);
            localStorage.setItem('alunoId', alunoLogadoId);
            carregarMinhasDuvidas();
        });
    }
    
    // Configurar toggle da sidebar
    configurarSidebar();
    
    // Configurar modal
    configurarModal();
    
    // Configurar formulário
    configurarFormulario();
    
    // Carregar dados do banco
    carregarDisciplinas(); // Busca disciplinas do banco
    carregarTodasDuvidas(); // Busca todas as dúvidas
});

// ==================== BUSCAS DA API ====================

// GET /disciplinas - Buscar todas as disciplinas do banco
async function carregarDisciplinas() {
    console.log('Buscando disciplinas do banco...');
    
    try {
        const response = await fetch(DISCIPLINAS_API_URL);
        
        if (response.ok) {
            disciplinasList = await response.json();
            console.log('Disciplinas carregadas:', disciplinasList);
            
            // Preencher o select com as disciplinas
            preencherSelectDisciplinas();
        } else {
            console.warn('Erro ao buscar disciplinas, status:', response.status);
            preencherSelectDisciplinasFallback();
        }
    } catch (error) {
        console.error('Erro ao conectar com API de disciplinas:', error);
        preencherSelectDisciplinasFallback();
    }
}

// Preencher select com as disciplinas do banco
function preencherSelectDisciplinas() {
    const selectConteudo = document.getElementById('conteudoId');
    if (!selectConteudo) return;
    
    selectConteudo.innerHTML = '<option value="" disabled selected></option>';
    
    if (disciplinasList.length === 0) {
        selectConteudo.innerHTML = '<option value="" disabled>Nenhuma disciplina disponível</option>';
        return;
    }
    
    // Adicionar as disciplinas diretamente no select
    disciplinasList.forEach(disciplina => {
        const option = document.createElement('option');
        option.value = disciplina.id; // idDisciplina
        option.textContent = disciplina.nome;
        selectConteudo.appendChild(option);
    });
    
    console.log('Select de disciplinas preenchido com', disciplinasList.length, 'disciplinas');
}

// Fallback caso não consiga buscar disciplinas
function preencherSelectDisciplinasFallback() {
    const selectConteudo = document.getElementById('conteudoId');
    if (!selectConteudo) return;
    
    // Disciplinas padrão baseadas no banco de dados
    const disciplinasPadrao = [
        { id: 1, nome: 'Matemática' },
        { id: 2, nome: 'Português' },
        { id: 3, nome: 'Literatura' },
        { id: 4, nome: 'Redação' },
        { id: 5, nome: 'História' },
        { id: 6, nome: 'Geografia' },
        { id: 7, nome: 'Filosofia' },
        { id: 8, nome: 'Sociologia' },
        { id: 9, nome: 'Biologia' },
        { id: 10, nome: 'Química' },
        { id: 11, nome: 'Física' },
        { id: 12, nome: 'Inglês' },
        { id: 13, nome: 'Espanhol' },
        { id: 14, nome: 'Artes' },
        { id: 15, nome: 'Educação Física' }
    ];
    
    selectConteudo.innerHTML = '<option value="" disabled selected></option>';
    
    disciplinasPadrao.forEach(disciplina => {
        const option = document.createElement('option');
        option.value = disciplina.id;
        option.textContent = disciplina.nome;
        selectConteudo.appendChild(option);
    });
    
    console.log('Select preenchido com disciplinas padrão');
}

// Buscar todas as dúvidas (GET /duvidas)
async function carregarTodasDuvidas() {
    const containerMinhas = document.getElementById('minhasDuvidas');
    const containerUltimas = document.getElementById('ultimasDuvidas');
    
    if (containerMinhas) {
        containerMinhas.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Carregando suas dúvidas...</div>';
    }
    if (containerUltimas) {
        containerUltimas.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Carregando últimas dúvidas...</div>';
    }
    
    try {
        const response = await fetch(API_URL);
        
        if (response.ok) {
            todasDuvidas = await response.json();
            console.log('Dúvidas carregadas do banco:', todasDuvidas.length);
            
            // Exibir minhas dúvidas
            carregarMinhasDuvidas();
            
            // Exibir últimas dúvidas
            carregarUltimasDuvidas();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dúvidas:', error);
        if (containerMinhas) {
            containerMinhas.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao conectar com o servidor</p>
                    <small>Verifique se o backend está rodando em ${API_URL}</small>
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 10px;">
                        <i class="fas fa-sync-alt"></i> Tentar novamente
                    </button>
                </div>
            `;
        }
    }
}

// Buscar uma dúvida específica (GET /duvidas/{id})
async function buscarDuvidaPorId(idDuvida) {
    try {
        const response = await fetch(`${API_URL}/${idDuvida}`);
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar dúvida:', error);
        return null;
    }
}

// Cadastrar nova dúvida (POST /duvidas)
async function cadastrarDuvida(duvida) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(duvida)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro ${response.status}: ${error}`);
    }
    
    return await response.json();
}

// ==================== EXIBIR DÚVIDAS ====================

function carregarMinhasDuvidas() {
    const container = document.getElementById('minhasDuvidas');
    if (!container) return;
    
    const minhasDuvidas = todasDuvidas.filter(duvida => 
        duvida.utilizador && duvida.utilizador.idUtilizador === alunoLogadoId
    );
    
    if (minhasDuvidas.length === 0) {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma dúvida encontrada</p>
                <small>Envie sua primeira dúvida!</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = minhasDuvidas.map(duvida => `
        <div class="doubt-item ${duvida.statusDuvida === 'Respondida' ? 'answered' : 'pending'}" 
             onclick="abrirDetalhesDuvida(${duvida.idDuvida})">
            <div class="doubt-info">
                <i class="fas fa-question-circle doubt-icon"></i>
                <div>
                    <span class="doubt-title-text">${escapeHtml(duvida.titulo)}</span>
                    <small style="display: block; color: var(--text-muted); font-size: 0.7rem; margin-top: 4px;">
                        <i class="fas fa-book"></i> ${duvida.conteudo ? escapeHtml(duvida.conteudo.titulo) : 'Sem matéria'}
                    </small>
                </div>
            </div>
            <div class="doubt-actions">
                <span class="doubt-status">${duvida.statusDuvida || 'Aberta'}</span>
                <button class="btn-view-answer" onclick="event.stopPropagation();abrirDetalhesDuvida(${duvida.idDuvida})">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </div>
        </div>
    `).join('');
}

function carregarUltimasDuvidas() {
    const container = document.getElementById('ultimasDuvidas');
    if (!container) return;
    
    if (todasDuvidas.length === 0) {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma dúvida cadastrada</p>
            </div>
        `;
        return;
    }
    
    // Mostrar as 10 mais recentes
    const duvidasRecentes = [...todasDuvidas]
        .sort((a, b) => new Date(b.momento) - new Date(a.momento))
        .slice(0, 10);
    
    container.innerHTML = duvidasRecentes.map(duvida => `
        <div class="popular-item" onclick="abrirDetalhesDuvida(${duvida.idDuvida})">
            <i class="fas fa-comment popular-icon"></i>
            <div style="flex: 1;">
                <span class="popular-text">${escapeHtml(duvida.titulo)}</span>
                <small style="display: block; color: var(--text-muted); font-size: 0.7rem; margin-top: 4px;">
                    <i class="fas fa-user"></i> ${duvida.utilizador ? escapeHtml(duvida.utilizador.nome || `Aluno ${duvida.utilizador.idUtilizador}`) : 'Aluno'} 
                    • ${formatarData(duvida.momento)}
                </small>
            </div>
        </div>
    `).join('');
}

// ==================== DETALHES DA DÚVIDA ====================

async function abrirDetalhesDuvida(idDuvida) {
    const duvida = await buscarDuvidaPorId(idDuvida);
    
    if (!duvida) {
        mostrarErro('Não foi possível carregar os detalhes da dúvida');
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;
    
    // Buscar nome da disciplina se tiver conteúdo
    let nomeDisciplina = 'Não informada';
    if (duvida.conteudo && duvida.conteudo.idConteudo) {
        const disciplinaEncontrada = disciplinasList.find(d => d.id === duvida.conteudo.disciplina?.id);
        if (disciplinaEncontrada) {
            nomeDisciplina = disciplinaEncontrada.nome;
        }
    }
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 25px;">
            <h4 style="color: var(--primary-color); margin-bottom: 10px;">
                <i class="fas fa-question-circle"></i> Dúvida
            </h4>
            <div style="background: #252525; padding: 18px; border-radius: 12px;">
                <strong style="font-size: 1.1rem; color: var(--text-light);">${escapeHtml(duvida.titulo)}</strong>
                <p style="margin-top: 12px; line-height: 1.6;">${escapeHtml(duvida.descricao || 'Sem descrição')}</p>
                <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.8rem; color: var(--text-muted);">
                    <span><i class="fas fa-book"></i> ${nomeDisciplina}</span>
                    <span><i class="fas fa-user"></i> ${duvida.utilizador ? escapeHtml(duvida.utilizador.nome || `ID ${duvida.utilizador.idUtilizador}`) : 'Não informado'}</span>
                    <span><i class="fas fa-calendar"></i> ${formatarData(duvida.momento)}</span>
                    <span><i class="fas fa-tag"></i> ${duvida.statusDuvida || 'Aberta'}</span>
                </div>
            </div>
        </div>
        
        <div>
            <h4 style="color: var(--status-answered); margin-bottom: 10px;">
                <i class="fas fa-comment-dots"></i> Resposta
            </h4>
            <div style="background: #252525; padding: 18px; border-radius: 12px; ${!duvida.resposta ? 'opacity: 0.8;' : ''}">
                ${duvida.resposta ? `
                    <p style="line-height: 1.6;">${escapeHtml(duvida.resposta.conteudoResposta)}</p>
                    <div class="resposta-meta" style="margin-top: 15px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-muted);">
                        <i class="fas fa-user-check"></i> Respondido por: ${duvida.resposta.utilizador?.nome || 'Professor'} 
                        em ${formatarData(duvida.resposta.momento)}
                    </div>
                ` : `
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-clock" style="font-size: 2.5rem; color: var(--status-pending);"></i>
                        <p style="margin-top: 15px;">Aguardando resposta do professor...</p>
                        <small>Em breve você receberá um retorno!</small>
                    </div>
                `}
            </div>
        </div>
    `;
    
    const modal = document.getElementById('modalResposta');
    if (modal) {
        modal.style.display = 'block';
    }
}

// ==================== ENVIAR DÚVIDA ====================

async function enviarDuvida(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo')?.value.trim();
    const disciplinaId = parseInt(document.getElementById('conteudoId')?.value);
    const descricao = document.getElementById('descricao')?.value.trim();
    const alunoId = parseInt(document.getElementById('alunoId')?.value);
    
    // Validações
    if (!titulo) {
        mostrarErro('Por favor, informe o título da dúvida');
        return;
    }
    
    if (!disciplinaId || isNaN(disciplinaId)) {
        mostrarErro('Por favor, selecione uma disciplina');
        return;
    }
    
    if (!descricao) {
        mostrarErro('Por favor, descreva sua dúvida');
        return;
    }
    
    if (!alunoId || alunoId < 1) {
        mostrarErro('Por favor, informe um ID de aluno válido');
        return;
    }
    
    // Atualizar aluno logado
    alunoLogadoId = alunoId;
    localStorage.setItem('alunoId', alunoLogadoId);
    
    // Criar objeto da dúvida conforme a entity
    // Observação: Como não temos o endpoint de conteúdos, 
    // vamos criar um objeto conteúdo simplificado
    const duvida = {
        titulo: titulo,
        descricao: descricao,
        momento: new Date().toISOString(),
        statusDuvida: 'Aberta',
        utilizador: {
            idUtilizador: alunoId
        },
        conteudo: {
            idConteudo: disciplinaId, // Usando o ID da disciplina como referência
            titulo: disciplinasList.find(d => d.id === disciplinaId)?.nome || 'Disciplina',
            disciplina: {
                idDisciplina: disciplinaId
            }
        }
    };
    
    // Mostrar loading
    const submitBtn = document.querySelector('#formDuvida button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        const resultado = await cadastrarDuvida(duvida);
        console.log('Dúvida cadastrada com sucesso:', resultado);
        
        mostrarSucesso();
        limparFormulario();
        
        // Recarregar listas
        await carregarTodasDuvidas();
        
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        mostrarErro(error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ==================== CONFIGURAÇÕES DE UI ====================

function configurarSidebar() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function configurarModal() {
    const modal = document.getElementById('modalResposta');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function configurarFormulario() {
    const form = document.getElementById('formDuvida');
    if (form) {
        form.addEventListener('submit', enviarDuvida);
    }
}

// ==================== UTILITÁRIOS ====================

function mostrarSucesso() {
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');
    
    if (alertError) alertError.style.display = 'none';
    if (alertSuccess) {
        alertSuccess.style.display = 'block';
        setTimeout(() => {
            alertSuccess.style.display = 'none';
        }, 5000);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarErro(mensagem) {
    const alertError = document.getElementById('alertError');
    const alertSuccess = document.getElementById('alertSuccess');
    const errorMessage = document.getElementById('errorMessage');
    
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertError) {
        if (errorMessage) errorMessage.textContent = mensagem;
        alertError.style.display = 'block';
        setTimeout(() => {
            alertError.style.display = 'none';
        }, 5000);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
    const titulo = document.getElementById('titulo');
    const conteudoId = document.getElementById('conteudoId');
    const descricao = document.getElementById('descricao');
    
    if (titulo) titulo.value = '';
    if (conteudoId) conteudoId.value = '';
    if (descricao) descricao.value = '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatarData(dataISO) {
    if (!dataISO) return 'Data não informada';
    try {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dataISO;
    }
}

// Exportar funções globais para o HTML
window.abrirDetalhesDuvida = abrirDetalhesDuvida;
window.carregarTodasDuvidas = carregarTodasDuvidas;