const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({
    path: "C:\\Users\\527069624\\Documents\\spotfy\\.env"
});

console.log("CLIENT ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("REDIRECT:", process.env.SPOTIFY_REDIRECT_URI);


const app = express();

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: "clone-spotfy-segredo-local",
        resave: false,
        saveUninitialized: false
    })
);

// Página inicial
app.get("/", (req, res) => {
    res.send("Servidor do Clone-Spotfy funcionando!");
});

// Login com Spotify
app.get("/login", (req, res) => {

    const scope = "playlist-read-private playlist-read-collaborative";

    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope: scope
    });

    const url =
        "https://accounts.spotify.com/authorize?" +
        params.toString();

console.log("REDIRECT:", process.env.SPOTIFY_REDIRECT_URI);

    res.redirect(url);
});

// Retorno do Spotify
app.get("/callback", async (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Código de autorização não recebido.");
    }

    try {

        const resposta = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",

                    "Authorization":
                        "Basic " +
                        Buffer.from(
                            process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                        ).toString("base64")
                },

                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri:
                        process.env.SPOTIFY_REDIRECT_URI
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.log(dados);

            return res.status(400).send(
                "Erro ao autorizar o Spotify."
            );
        }

        req.session.access_token = dados.access_token;
        req.session.refresh_token = dados.refresh_token;

        res.send(`
            <h1>Spotify conectado! 🎵</h1>
            <p>Agora sua conta do Spotify está conectada ao Clone-Spotfy.</p>
            <p>Você pode fechar esta página.</p>
        `);

    } catch (erro) {

        console.error(erro);

        res.status(500).send(
            "Erro ao conectar com o Spotify."
        );
    }
});

app.get("/minhas-playlists", async (req, res) => {

    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({
            erro: "Spotify não conectado."
        });
    }

    try {

        const resposta = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            return res.status(resposta.status).json(dados);
        }

        res.json(dados);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar playlists."
        });
    }
});

app.get("/playlist/:id", async (req, res) => {

    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({
            erro: "Spotify não conectado."
        });
    }

    try {

        const playlistId = req.params.id;

        const resposta = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/items`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        console.log("ITENS DA PLAYLIST:", JSON.stringify(dados.items, null, 2));

        if (!resposta.ok) {
            return res.status(resposta.status).json(dados);
        }

const musicas = dados.items
    .filter(item => item.item && item.item.type === "track")
    .map(item => ({
        nome: item.item.name,
        artista: item.item.artists
            .map(artista => artista.name)
            .join(", "),
        album: item.item.album?.name || "",
        capa: item.item.album?.images?.[0]?.url || ""
    }));

const arquivo = path.join(__dirname, "../Dados/playlists.json");

let musicasExistentes = [];

if (fs.existsSync(arquivo)) {
    try {
        const conteudo = fs.readFileSync(arquivo, "utf8");

        if (conteudo.trim()) {
            musicasExistentes = JSON.parse(conteudo);
        }
    } catch (erro) {
        console.log("Não foi possível ler o arquivo existente.");
    }
}

const todasAsMusicas = [
    ...musicasExistentes,
    ...musicas
];

fs.writeFileSync(
    arquivo,
    JSON.stringify(todasAsMusicas, null, 2),
    "utf8"
);

res.json({
    mensagem: "Playlist salva com sucesso!",
    quantidade: musicas.length,
    musicas: musicas
});

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar playlist."
        });
    }
});

app.listen(3000, () => {
    console.log(
        "Servidor funcionando em http://localhost:3000"
    );
});