// src/models/Redacao.js

class Redacao {
    constructor(titulo, texto, tema) {
        this.titulo = titulo;
        this.texto = texto;
        this.tema = tema;
        this.dataEnvio = new Date();
        this.competencias = {
            competencia1: { nome: "Domínio da norma culta", nota: 0, feedback: "" },
            competencia2: { nome: "Compreensão do tema", nota: 0, feedback: "" },
            competencia3: { nome: "Organização dos argumentos", nota: 0, feedback: "" },
            competencia4: { nome: "Mecanismos linguísticos", nota: 0, feedback: "" },
            competencia5: { nome: "Proposta de intervenção", nota: 0, feedback: "" }
        };
        this.notaTotal = 0;
        this.sugestoes = [];
        this.pontosFortes = [];
        this.pontosFracos = [];
    }

    calcularNotaTotal() {
        let soma = 0;
        for (let comp in this.competencias) {
            soma += this.competencias[comp].nota;
        }
        this.notaTotal = soma;
        return this.notaTotal;
    }

    toJSON() {
        return {
            titulo: this.titulo,
            tema: this.tema,
            dataEnvio: this.dataEnvio,
            competencias: this.competencias,
            notaTotal: this.notaTotal,
            sugestoes: this.sugestoes,
            pontosFortes: this.pontosFortes,
            pontosFracos: this.pontosFracos
        };
    }
}

module.exports = Redacao;