
// ANIMAIS DO JOGO

const animais = [
    "🦁", "🐯", "🐵", "🐸",
    "🐼", "🐨", "🐮", "🐷",
    "🐶", "🐱", "🐰", "🦊"
];

// ELEMENTOS HTML

const tabuleiro = document.getElementById("tabuleiro");

const tentativasHTML = document.getElementById("tentativas");
const paresHTML = document.getElementById("pares");
const tempoHTML = document.getElementById("tempo");

const jogador1HTML = document.getElementById("jogador1");
const jogador2HTML = document.getElementById("jogador2");

const pontos1HTML = document.getElementById("pontos1");
const pontos2HTML = document.getElementById("pontos2");

const vezHTML = document.getElementById("vez");

const dificuldadeHTML = document.getElementById("dificuldade");

const resultadoHTML = document.getElementById("resultado");


// VARIÁVEIS DO JOGO

let cartas = [];

let primeiraCarta = null;
let segundaCarta = null;

let bloqueado = false;

let tentativas = 0;
let paresEncontrados = 0;

let pontos1 = 0;
let pontos2 = 0;

let jogadorAtual = 1;

let totalPares = 8;

let segundos = 0;
let intervalo = null;
let tempoEspera = null;

let jogoIniciado = false;
let jogoFinalizado = false;


// EMBARALHAR CARTAS

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}


// PEGAR NOME DOS JOGADORES

function pegarNome(jogador) {

    if (jogador === 1) {

        return document.getElementById("nome1").value.trim() || "Jogador 1";

    }

    return document.getElementById("nome2").value.trim() || "Jogador 2";

}


// INICIAR JOGO

function iniciarJogo() {

    clearInterval(intervalo);
    clearTimeout(tempoEspera);

    intervalo = null;
    tempoEspera = null;

    primeiraCarta = null;
    segundaCarta = null;

    bloqueado = false;

    tentativas = 0;
    paresEncontrados = 0;

    pontos1 = 0;
    pontos2 = 0;

    jogadorAtual = 1;

    segundos = 0;

    jogoIniciado = false;
    jogoFinalizado = false;

    resultadoHTML.classList.add("escondido");

    // DEFINIR DIFICULDADE

    const dificuldade = dificuldadeHTML.value;

    if (dificuldade === "facil") {

        totalPares = 4;

    } else if (dificuldade === "medio") {

        totalPares = 8;

    } else {

        totalPares = 12;

    }

    // CRIAR PARES DE ANIMAIS

    cartas = embaralhar([
        ...animais.slice(0, totalPares),
        ...animais.slice(0, totalPares)
    ]);

    tabuleiro.innerHTML = "";

    cartas.forEach(function(animal) {

        const carta = document.createElement("button");

        carta.classList.add("carta");
        carta.textContent = "?";

        carta.addEventListener("click", function() {

            virarCarta(carta, animal);

        });

        tabuleiro.appendChild(carta);

    });

    atualizarInformacoes();

    atualizarJogador();

}


// CRONÔMETRO

function iniciarCronometro() {

    if (jogoIniciado) {
        return;
    }

    jogoIniciado = true;

    intervalo = setInterval(function() {

        segundos++;

        atualizarTempo();

    }, 1000);

}


// ATUALIZAR TEMPO

function atualizarTempo() {

    const minutos = Math.floor(segundos / 60);

    const segundosRestantes = segundos % 60;

    tempoHTML.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");

}


// VIRAR CARTA

function virarCarta(carta, animal) {

    if (
        bloqueado ||
        jogoFinalizado ||
        carta.classList.contains("aberta") ||
        carta.classList.contains("encontrada")
    ) {

        return;

    }

    iniciarCronometro();

    carta.textContent = animal;

    carta.classList.add("aberta");

    if (primeiraCarta === null) {

        primeiraCarta = {
            elemento: carta,
            animal: animal
        };

    } else {

        segundaCarta = {
            elemento: carta,
            animal: animal
        };

        tentativas++;

        verificarPar();

    }

    atualizarInformacoes();

}


// VERIFICAR PARES

function verificarPar() {

    bloqueado = true;

    if (primeiraCarta.animal === segundaCarta.animal) {

        // ACERTOU O PAR

        primeiraCarta.elemento.classList.add("encontrada");

        segundaCarta.elemento.classList.add("encontrada");

        paresEncontrados++;

        if (jogadorAtual === 1) {

            pontos1++;

        } else {

            pontos2++;

        }

        limparSelecao();

        atualizarInformacoes();

        if (paresEncontrados === totalPares) {

            finalizarJogo();

        } else {

            bloqueado = false;

        }

    } else {

        // ERROU O PAR

        tempoEspera = setTimeout(function() {

            primeiraCarta.elemento.textContent = "?";

            segundaCarta.elemento.textContent = "?";

            primeiraCarta.elemento.classList.remove("aberta");

            segundaCarta.elemento.classList.remove("aberta");

            limparSelecao();

            // PASSAR A VEZ

            trocarJogador();

        }, 1000);

    }

}


// LIMPAR CARTAS SELECIONADAS

function limparSelecao() {

    primeiraCarta = null;

    segundaCarta = null;

    bloqueado = false;

}


// TROCAR JOGADOR

function trocarJogador() {

    jogadorAtual = jogadorAtual === 1 ? 2 : 1;

    atualizarJogador();

}


// ATUALIZAR JOGADOR DA VEZ

function atualizarJogador() {

    jogador1HTML.classList.remove("ativo");

    jogador2HTML.classList.remove("ativo");

    if (jogadorAtual === 1) {

        jogador1HTML.classList.add("ativo");

        vezHTML.textContent = "Vez de " + pegarNome(1);

    } else {

        jogador2HTML.classList.add("ativo");

        vezHTML.textContent = "Vez de " + pegarNome(2);

    }

}


// ATUALIZAR INFORMAÇÕES

function atualizarInformacoes() {

    tentativasHTML.textContent = tentativas;

    paresHTML.textContent =
        paresEncontrados + "/" + totalPares;

    pontos1HTML.textContent = pontos1 + " pontos";

    pontos2HTML.textContent = pontos2 + " pontos";

    atualizarTempo();

}


// FINALIZAR JOGO

function finalizarJogo() {

    jogoFinalizado = true;

    clearInterval(intervalo);

    intervalo = null;

    const nome1 = pegarNome(1);

    const nome2 = pegarNome(2);

    let mensagem = "";

    if (pontos1 > pontos2) {

        mensagem = "🏆 " + nome1 + " venceu!";

    } else if (pontos2 > pontos1) {

        mensagem = "🏆 " + nome2 + " venceu!";

    } else {

        mensagem = "🤝 Empate! Os dois jogadores foram muito bem!";

    }

    document.getElementById("mensagemVitoria").textContent = mensagem;

    document.getElementById("detalhesResultado").innerHTML =

        nome1 + ": <strong>" + pontos1 + " pontos</strong><br>" +

        nome2 + ": <strong>" + pontos2 + " pontos</strong><br><br>" +

        "⏱️ Tempo: " + tempoHTML.textContent + "<br>" +

        "🎯 Tentativas: " + tentativas;

    resultadoHTML.classList.remove("escondido");

    vezHTML.textContent = "Fim de jogo!";

    atualizarInformacoes();

}


// REINICIAR JOGO

function reiniciarJogo() {

    iniciarJogo();

}


// EVENTOS DOS BOTÕES

document.getElementById("btnReiniciar").addEventListener(
    "click",
    reiniciarJogo
);

document.getElementById("btnJogarNovamente").addEventListener(
    "click",
    reiniciarJogo
);

dificuldadeHTML.addEventListener("change", iniciarJogo);


// INICIAR AUTOMATICAMENTE

iniciarJogo();

