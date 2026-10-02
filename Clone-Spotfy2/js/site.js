// ==========================================
// PESQUISA DE MÚSICAS
// ==========================================

// Essa parte só funciona se existir
// a página principal do Spotfy.

const campoBusca =
    document.querySelector(
        "header #busca"
    );

const botaoBusca =
    document.querySelector(
        "header #buscar"
    );

const listaMusicas =
    document.getElementById("musicas");


let todasAsMusicas = [];

let resultadosPesquisa = [];


// ==========================================
// CARREGAR MÚSICAS DO JSON
// ==========================================

async function carregarMusicas() {

    try {

        const resposta =
            await fetch(
                  "../Dados/playlists.json"
            );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as músicas."
            );

        }


        todasAsMusicas =
            await resposta.json();


        console.log(
            "Músicas carregadas:",
            todasAsMusicas
        );


        mostrarMusicas(
            todasAsMusicas
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar músicas:",
            erro
        );

    }

}


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// ==========================================
// PESQUISAR MÚSICAS
// ==========================================

function pesquisarMusicas(texto) {

    const busca =
        normalizarTexto(
            texto.trim()
        );


    // Se estiver vazio,
    // mostra todas novamente.

    if (!busca) {

        resultadosPesquisa =
            todasAsMusicas;


        mostrarSugestoes([]);


        mostrarMusicas(
            todasAsMusicas
        );


        return;

    }


    // Procura em:
    // nome
    // artista
    // álbum

    resultadosPesquisa =
        todasAsMusicas.filter(musica => {

            const nome =
                normalizarTexto(
                    musica.nome || ""
                );


            const artista =
                normalizarTexto(
                    musica.artista || ""
                );


            const album =
                normalizarTexto(
                    musica.album || ""
                );


            return (
                nome.includes(busca) ||
                artista.includes(busca) ||
                album.includes(busca)
            );

        });


    // Mostra até 8 sugestões

    mostrarSugestoes(
        resultadosPesquisa.slice(0, 8)
    );


    // Mostra os resultados

    mostrarMusicas(
        resultadosPesquisa
    );

}


// ==========================================
// MOSTRAR MÚSICAS
// ==========================================

function mostrarMusicas(musicas) {

    if (!listaMusicas) return;


    listaMusicas.innerHTML = "";


    if (musicas.length === 0) {

        listaMusicas.innerHTML = `

            <p style="
                color:#aaa;
                padding:20px;
            ">

                Nenhuma música encontrada.

            </p>

        `;

        return;

    }


    musicas.forEach(musica => {

        const card =
            document.createElement("div");


        card.className =
            "card-musica";


        card.innerHTML = `

            <img
                src="${musica.capa || ""}"
                alt="Capa da música"
                class="capa-musica"
            >

            <div class="info-musica">

                <h4>
                    ${musica.nome || "Sem nome"}
                </h4>

                <p>
                    ${musica.artista || "Artista desconhecido"}
                </p>

            </div>

        `;


        // Quando clicar na música

        card.addEventListener(
            "click",
            () => {

                selecionarMusica(
                    musica
                );

            }
        );


        listaMusicas.appendChild(
            card
        );

    });

}


// ==========================================
// SUGESTÕES DA PESQUISA
// ==========================================
function mostrarSugestoes(musicas) {

    if (!campoBusca) return;

    let caixa =
        document.getElementById("resultadosPesquisa");

    // Cria a caixa de resultados
    if (!caixa) {

        caixa = document.createElement("div");

        caixa.id = "resultadosPesquisa";

        const pesquisa =
            document.querySelector("header .pesquisar");

        if (pesquisa) {

            // Faz a caixa ficar posicionada
            // em relação à barra de pesquisa
            pesquisa.style.position = "relative";

            pesquisa.appendChild(caixa);

        }
    }

    if (!caixa) return;

    // ==========================================
    // POSIÇÃO DA CAIXA
    // ==========================================

    caixa.style.position = "absolute";
    caixa.style.top = "calc(100% + 8px)";
    caixa.style.left = "0";
    caixa.style.width = "100%";
    caixa.style.zIndex = "9999";

    caixa.style.background = "#181818";
    caixa.style.borderRadius = "10px";
    caixa.style.padding = "8px";
    caixa.style.boxSizing = "border-box";

    caixa.style.maxHeight = "400px";
    caixa.style.overflowY = "auto";

    caixa.style.boxShadow =
        "0 8px 25px rgba(0, 0, 0, 0.5)";

    caixa.innerHTML = "";

    // ==========================================
    // NENHUM RESULTADO
    // ==========================================

    if (musicas.length === 0) {

        caixa.style.display = "none";

        return;
    }

    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    caixa.style.display = "block";

    musicas.forEach(musica => {

        const item =
            document.createElement("div");

        item.className =
            "sugestao-musica";

        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.gap = "12px";
        item.style.padding = "10px";
        item.style.borderRadius = "8px";
        item.style.cursor = "pointer";

        item.innerHTML = `

            <img
                src="${musica.capa || ""}"
                alt=""
                style="
                    width:50px;
                    height:50px;
                    object-fit:cover;
                    border-radius:6px;
                "
            >

            <div style="
                display:flex;
                flex-direction:column;
                gap:4px;
            ">

                <strong style="
                    color:white;
                    font-size:14px;
                ">
                    ${musica.nome || "Sem nome"}
                </strong>

                <span style="
                    color:#aaa;
                    font-size:12px;
                ">
                    ${musica.artista || "Artista desconhecido"}
                </span>

            </div>
        `;

        // ==========================================
        // CLICAR NA MÚSICA
        // ==========================================

        item.addEventListener(
            "click",
            () => {

                campoBusca.value =
                    musica.nome;

                selecionarMusica(
                    musica
                );

                caixa.style.display =
                    "none";
            }
        );

        // ==========================================
        // EFEITO AO PASSAR O MOUSE
        // ==========================================

        item.addEventListener(
            "mouseenter",
            () => {
                item.style.background =
                    "#282828";
            }
        );

        item.addEventListener(
            "mouseleave",
            () => {
                item.style.background =
                    "transparent";
            }
        );

        caixa.appendChild(item);

    });

}
// ==========================================
// SELECIONAR MÚSICA
// ==========================================

function selecionarMusica(musica) {

    console.log("Música selecionada:", musica);


    const capa =
        document.getElementById("capaMusica");

    const nome =
        document.getElementById("nomeMusica");

    const artista =
        document.getElementById("artista");

    const playlist =
        document.getElementById("playlists");

    const audio =
        document.getElementById("audio");


    // ==========================================
    // ATUALIZA AS INFORMAÇÕES DO PLAYER
    // ==========================================

    if (capa) {

        capa.src =
            musica.capa || "";

    }


    if (nome) {

        nome.textContent =
            musica.nome || "";

    }


    if (artista) {

        artista.textContent =
            musica.artista || "";

    }


    if (playlist) {

        playlist.textContent =
            musica.album || "";

    }


    // ==========================================
    // TOCAR A MÚSICA
    // ==========================================

    if (audio && musica.arquivo) {

        audio.src =
            musica.arquivo;

        audio.load();


        audio.play()
            .then(() => {

                console.log(
                    "Música começou a tocar!"
                );

            })
            .catch(erro => {

                console.error(
                    "Não foi possível iniciar o áudio:",
                    erro
                );

            });

    }
    else {

        console.log(
            "Essa música ainda não possui arquivo de áudio."
        );

        alert(
            "Essa música ainda não possui um arquivo de áudio."
        );

    }

}

// ==========================================
// DIGITAR NA PESQUISA
// ==========================================

if (campoBusca) {

    campoBusca.addEventListener(
        "input",
        () => {

            pesquisarMusicas(
                campoBusca.value
            );

        }
    );


    campoBusca.addEventListener(
        "focus",
        () => {

            if (
                campoBusca.value.trim() !== ""
            ) {

                pesquisarMusicas(
                    campoBusca.value
                );

            }

        }
    );

}


// ==========================================
// BOTÃO PESQUISAR
// ==========================================

if (botaoBusca) {

    botaoBusca.addEventListener(
        "click",
        () => {

            if (!campoBusca) return;


            pesquisarMusicas(
                campoBusca.value
            );

        }
    );

}


// ==========================================
// ESCONDER SUGESTÕES
// ==========================================

document.addEventListener(
    "click",
    (evento) => {

        const pesquisa =
            document.querySelector(
                "header .pesquisar"
            );


        const caixa =
            document.getElementById(
                "resultadosPesquisa"
            );


        if (
            !pesquisa ||
            !caixa
        ) return;


        if (
            !pesquisa.contains(
                evento.target
            )
        ) {

            caixa.style.display =
                "none";

        }

    }
);


// ==========================================
// INICIAR PESQUISA
// ==========================================

carregarMusicas();


// Login
const botaoEntrar = document.getElementById("entrar");

if (botaoEntrar) {
    botaoEntrar.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    if (email === "" || senha === "") {
        alert("Preencha o email e a senha!");
        return;
    }

    try {
        const usuario = await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        console.log("Usuário entrou:", usuario.user);
        alert("Login realizado!");
        window.location.href = "./inicio.html";

    } catch (erro) {
        console.log(erro);

        if (erro.code === "auth/invalid-credential") {
            alert("Email ou senha incorretos.");
        } else {
            alert("Erro ao fazer login.");
        }
    }
});
}

// Cadastro

botaoCadastrar = document.getElementById("cadastrar");

botaoCadastrar.addEventListener("click", async () => {
    const nome = document.getElementById("nameCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("passwordCadastro").value;

    if (nome === "" || email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const usuario =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        console.log(
            "Usuário criado:",
            usuario.user
        );

        alert("Conta criada com sucesso!");
        window.location.href = "./Artistas.html";

    } catch (erro) {
        console.log(erro);

        if (erro.code === "auth/email-already-in-use") {
            alert("Esse email já está cadastrado!");
        } 
        else if (erro.code === "auth/invalid-email") {
            alert("Digite um email válido!");
        }
        else if (erro.code === "auth/weak-password") {
            alert("A senha é muito fraca!");
        }
        else {
            alert("Erro ao criar a conta!");
        }
    }
});







// ==========================================
// SISTEMA DE PLAYLISTS
// ==========================================


// ------------------------------------------
// PEGAR ELEMENTOS
// ------------------------------------------

const btnCriarPlaylist =
    document.getElementById("btnCriarPlaylist");

const modalCriarPlaylist =
    document.getElementById("modalCriarPlaylist");

const fecharModal =
    document.getElementById("fecharModal");

const salvarPlaylist =
    document.getElementById("salvarPlaylist");

const nomePlaylist =
    document.getElementById("nomePlaylist");

const listaPlaylists =
    document.getElementById("listaPlaylists");

const modalPlaylist =
    document.getElementById("modalPlaylist");

const fecharPlaylist =
    document.getElementById("fecharPlaylist");

const conteudoPlaylist =
    document.getElementById("conteudoPlaylist");


// ------------------------------------------
// CARREGAR PLAYLISTS
// ------------------------------------------

let playlists =
    JSON.parse(localStorage.getItem("minhasPlaylists")) || [];


// ==========================================
// ABRIR JANELA "CRIAR"
// ==========================================

btnCriarPlaylist.addEventListener("click", () => {

    modalCriarPlaylist.classList.add("aberto");

    nomePlaylist.value = "";

    setTimeout(() => {
        nomePlaylist.focus();
    }, 100);

});


// ==========================================
// FECHAR JANELA
// ==========================================

fecharModal.addEventListener("click", () => {

    modalCriarPlaylist.classList.remove("aberto");

});


// ==========================================
// SALVAR NOVA PLAYLIST
// ==========================================

salvarPlaylist.addEventListener("click", () => {

    const nome =
        nomePlaylist.value.trim();


    // Não deixa criar sem nome

    if (nome === "") {

        alert("Digite um nome para a playlist.");

        nomePlaylist.focus();

        return;
    }


    // Criar objeto da playlist

    const novaPlaylist = {

        id: Date.now(),

        nome: nome,

        musicas: []

    };


    // Adicionar à lista

    playlists.push(novaPlaylist);


    // Salvar no navegador

    salvarPlaylists();


    // Fechar modal

    modalCriarPlaylist.classList.remove("aberto");


    // Atualizar tela

    mostrarPlaylists();


    // Limpar campo

    nomePlaylist.value = "";

});


// ==========================================
// ENTER PARA SALVAR
// ==========================================

nomePlaylist.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        salvarPlaylist.click();

    }

});


// ==========================================
// SALVAR NO LOCALSTORAGE
// ==========================================

function salvarPlaylists() {

    localStorage.setItem(
        "minhasPlaylists",
        JSON.stringify(playlists)
    );

}


// ==========================================
// MOSTRAR PLAYLISTS
// ==========================================

function mostrarPlaylists() {

    listaPlaylists.innerHTML = "";


    // Se não tiver nenhuma

    if (playlists.length === 0) {

        listaPlaylists.innerHTML = `
            <p style="color:#888;">
                Você ainda não criou nenhuma playlist.
            </p>
        `;

        return;
    }


    playlists.forEach((playlist) => {

        const card =
            document.createElement("div");

        card.className = "card-playlist";


        // Criar capa

        const capa =
            document.createElement("div");

        capa.className = "capa-playlist";


        // ----------------------------------
        // CAPA COM AS 4 PRIMEIRAS MÚSICAS
        // ----------------------------------

        if (playlist.musicas.length === 0) {

            capa.innerHTML = `
                <div class="capa-vazia">
                    ♪
                </div>
            `;

        } else {

            playlist.musicas
                .slice(0, 4)
                .forEach((musica) => {

                    const img =
                        document.createElement("img");

                    img.src =
                        musica.capa ||
                        "img/capa-padrao.jpg";

                    img.onerror = () => {

                        img.src =
                            "img/capa-padrao.jpg";

                    };

                    capa.appendChild(img);

                });


            // Completar espaços vazios

            while (capa.children.length < 4) {

                const vazio =
                    document.createElement("div");

                vazio.style.background = "#282828";

                capa.appendChild(vazio);

            }

        }


        // ----------------------------------
        // NOME
        // ----------------------------------

        const nome =
            document.createElement("div");

        nome.className =
            "nome-playlist";

        nome.textContent =
            playlist.nome;


        // ----------------------------------
        // COLOCAR NO CARD
        // ----------------------------------

        card.appendChild(capa);

        card.appendChild(nome);


        // ----------------------------------
        // ABRIR PLAYLIST
        // ----------------------------------

        card.addEventListener("click", () => {

            abrirPlaylist(playlist.id);

        });


        listaPlaylists.appendChild(card);

    });

}


// ==========================================
// ABRIR UMA PLAYLIST
// ==========================================

function abrirPlaylist(id) {

    const playlist =
        playlists.find(
            p => p.id === id
        );


    if (!playlist) return;


    let capaHTML = "";


    // ----------------------------------
    // CAPA
    // ----------------------------------

    if (playlist.musicas.length === 0) {

        capaHTML = `
            <div
                style="
                    grid-column:1/3;
                    grid-row:1/3;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:50px;
                    color:#777;
                "
            >
                ♪
            </div>
        `;

    } else {

        playlist.musicas
            .slice(0, 4)
            .forEach((musica) => {

                capaHTML += `
                    <img
                        src="${
                            musica.capa ||
                            "img/capa-padrao.jpg"
                        }"
                        onerror="
                            this.src='img/capa-padrao.jpg'
                        "
                    >
                `;

            });

    }


    // ----------------------------------
    // MÚSICAS
    // ----------------------------------

    let musicasHTML = "";


    if (playlist.musicas.length === 0) {

        musicasHTML = `
            <p style="color:#888;">
                Nenhuma música adicionada ainda.
            </p>
        `;

    } else {

        playlist.musicas.forEach((musica, index) => {

            musicasHTML += `

                <div
                    class="musica-playlist"
                    data-index="${index}"
                >

                    <img
                        src="${
                            musica.capa ||
                            "img/capa-padrao.jpg"
                        }"
                        onerror="
                            this.src='img/capa-padrao.jpg'
                        "
                    >

                    <span>
                        ${musica.nome}
                    </span>

                </div>

            `;

        });

    }


    // ----------------------------------
    // CONTEÚDO DA PLAYLIST
    // ----------------------------------

    conteudoPlaylist.innerHTML = `

        <div class="cabecalho-playlist">

            <div class="capa-grande-playlist">

                ${capaHTML}

            </div>


            <div class="info-playlist">

                <p>Playlist</p>

                <h2>
                    ${playlist.nome}
                </h2>

                <p>
                    ${playlist.musicas.length}
                    ${
                        playlist.musicas.length === 1
                        ? "música"
                        : "músicas"
                    }
                </p>

            </div>

        </div>


        <button
            class="btn-adicionar-musica"
            id="btnAdicionarMusica"
        >
            + Adicionar músicas
        </button>


        <div class="musicas-playlist">

            ${musicasHTML}

        </div>

    `;


    // ----------------------------------
    // ABRIR MODAL
    // ----------------------------------

    modalPlaylist.classList.add("aberto");


    // ----------------------------------
    // BOTÃO ADICIONAR
    // ----------------------------------

    document
        .getElementById("btnAdicionarMusica")
        .addEventListener("click", () => {

            abrirSeletorMusicas(playlist.id);

        });


    // ----------------------------------
    // CLIQUE NAS MÚSICAS
    // ----------------------------------

    document
        .querySelectorAll(".musica-playlist")
        .forEach((elemento) => {

            elemento.addEventListener("click", () => {

                const index =
                    Number(
                        elemento.dataset.index
                    );

                tocarMusicaDaPlaylist(
                    playlist,
                    index
                );

            });

        });

}


// ==========================================
// FECHAR PLAYLIST
// ==========================================

fecharPlaylist.addEventListener("click", () => {

    modalPlaylist.classList.remove("aberto");

});


// ==========================================
// ADICIONAR MÚSICAS
// ==========================================
//
// Esta função procura suas músicas existentes
// na variável "musicas".
// 
// Se no seu projeto a lista de músicas tiver
// outro nome, troque "musicas" pelo nome dela.
// ==========================================

function abrirSeletorMusicas(playlistId) {

    const playlist =
        playlists.find(
            p => p.id === playlistId
        );


    if (!playlist) return;


    // ----------------------------------
    // PEGAR MÚSICAS DO SEU PROJETO
    // ----------------------------------

    // IMPORTANTE:
    //
    // Se você já possui uma variável global
    // chamada "musicas", ela será utilizada.
    //
    // Caso não exista, mostramos uma mensagem.

    if (
        typeof musicas === "undefined" ||
        !Array.isArray(musicas)
    ) {

        alert(
            "A lista de músicas do projeto não foi encontrada."
        );

        return;
    }


    // ----------------------------------
    // CRIAR JANELA
    // ----------------------------------

    const modalMusicas =
        document.createElement("div");

    modalMusicas.className =
        "modal-overlay aberto";


    let listaHTML = "";


    musicas.forEach((musica, index) => {

        // Verificar se já está na playlist

        const jaAdicionada =
            playlist.musicas.some(
                m => m.id === musica.id
            );


        listaHTML += `

            <div
                class="musica-playlist"
                style="margin-bottom:8px;"
                data-musica-index="${index}"
            >

                <img
                    src="${
                        musica.capa ||
                        "img/capa-padrao.jpg"
                    }"
                >

                <span>
                    ${musica.nome}
                </span>

                <button
                    class="adicionar-musica-btn"
                    ${
                        jaAdicionada
                        ? "disabled"
                        : ""
                    }
                >
                    ${
                        jaAdicionada
                        ? "Adicionada"
                        : "Adicionar"
                    }
                </button>

            </div>

        `;

    });


    modalMusicas.innerHTML = `

        <div class="modal-playlist">

            <button
                class="fechar-modal fechar-seletor"
            >
                ×
            </button>

            <h2>
                Adicionar músicas
            </h2>

            <p>
                Escolha as músicas para sua playlist.
            </p>

            <div>
                ${listaHTML}
            </div>

        </div>

    `;


    document.body.appendChild(modalMusicas);


    // ----------------------------------
    // FECHAR
    // ----------------------------------

    modalMusicas
        .querySelector(".fechar-seletor")
        .addEventListener("click", () => {

            modalMusicas.remove();

        });


    // ----------------------------------
    // BOTÕES ADICIONAR
    // ----------------------------------

    modalMusicas
        .querySelectorAll(
            ".adicionar-musica-btn"
        )
        .forEach((botao) => {

            botao.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const linha =
                        botao.closest(
                            ".musica-playlist"
                        );


                    const index =
                        Number(
                            linha.dataset.musicaIndex
                        );


                    const musica =
                        musicas[index];


                    // Não adicionar duplicada

                    if (
                        playlist.musicas.some(
                            m => m.id === musica.id
                        )
                    ) {

                        return;

                    }


                    // Adicionar

                    playlist.musicas.push({
                        id: musica.id,
                        nome: musica.nome,
                        capa: musica.capa,
                        arquivo: musica.arquivo
                    });


                    // Salvar

                    salvarPlaylists();


                    // Atualizar botão

                    botao.textContent =
                        "Adicionada";

                    botao.disabled = true;


                    // Atualizar playlist aberta

                    abrirPlaylist(playlist.id);

                }
            );

        });

}


// ==========================================
// TOCAR MÚSICA
// ==========================================

function tocarMusicaDaPlaylist(
    playlist,
    index
) {

    const musica =
        playlist.musicas[index];


    if (!musica) return;


    console.log(
        "Tocando:",
        musica.nome
    );


    // ----------------------------------
    // SE SEU PROJETO JÁ TEM UMA FUNÇÃO
    // PARA TOCAR MÚSICAS, CHAME ELA AQUI.
    // ----------------------------------

    if (
        typeof tocarMusica === "function"
    ) {

        tocarMusica(musica);

    }

}


// ==========================================
// CARREGAR AO ABRIR A PÁGINA
// ==========================================

mostrarPlaylists();



// ==========================================
// RECOMENDAÇÕES BASEADAS NOS ARTISTAS
// ==========================================


const listaRecomendacoes =
    document.getElementById("listaRecomendacoes");


// ==========================================
// ARTISTAS ESCOLHIDOS
// ==========================================

function pegarArtistasEscolhidos() {

    const dados =
        localStorage.getItem("artistasSelecionados");

    if (!dados) {

        return [];

    }

    try {

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "Erro ao carregar artistas:",
            erro
        );

        return [];

    }

}


// ==========================================
// MOSTRAR RECOMENDAÇÕES
// ==========================================

function mostrarRecomendacoes() {

    const artistasEscolhidos =
        pegarArtistasEscolhidos();


    listaRecomendacoes.innerHTML = "";


    // ------------------------------------------
    // NENHUM ARTISTA
    // ------------------------------------------

    if (artistasEscolhidos.length === 0) {

        listaRecomendacoes.innerHTML = `
            <p style="color:#888;">
                Escolha artistas para receber recomendações.
            </p>
        `;

        return;

    }


    // ==========================================
    // FILTRAR MÚSICAS
    // ==========================================

    const recomendacoes = musicas.filter(
        musica => {

            if (!musica.artista) {

                return false;

            }


            return artistasEscolhidos.some(
                artista => {

                    const nomeArtista =
                        typeof artista === "string"
                            ? artista
                            : artista.name ||
                              artista.nome ||
                              "";

                    return
                        musica.artista
                            .toLowerCase()
                            .includes(
                                nomeArtista.toLowerCase()
                            );

                }
            );

        }
    );


    // ==========================================
    // NENHUMA MÚSICA ENCONTRADA
    // ==========================================

    if (recomendacoes.length === 0) {

        listaRecomendacoes.innerHTML = `
            <p style="color:#888;">
                Ainda não existem músicas desses artistas.
            </p>
        `;

        return;

    }


    // ==========================================
    // MOSTRAR MÚSICAS
    // ==========================================

    recomendacoes
        .slice(0, 20)
        .forEach(musica => {

            const card =
                document.createElement("div");

            card.className =
                "card-recomendacao";


            card.innerHTML = `

                <img
                    src="${
                        musica.capa ||
                        "img/capa-padrao.jpg"
                    }"
                    onerror="
                        this.src='img/capa-padrao.jpg'
                    "
                >

                <div class="nome-musica">
                    ${musica.nome}
                </div>

                <div class="nome-artista">
                    ${musica.artista}
                </div>

            `;


            // ==================================
            // CLICAR → TOCAR
            // ==================================

            card.addEventListener(
                "click",
                () => {

                    if (
                        typeof tocarMusica ===
                        "function"
                    ) {

                        tocarMusica(musica);

                    } else {

                        console.log(
                            "Tocar música:",
                            musica
                        );

                    }

                }
            );


            listaRecomendacoes.appendChild(card);

        });

}


// ==========================================
// ESPERAR O HTML CARREGAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        mostrarRecomendacoes();

    }
);