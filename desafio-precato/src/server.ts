import { app } from "./app";

const port = 3000;

const server = app.listen(port, () => console.log(`App na porta ${port}`));

// Com o encerramento do processo o app é finalizado

process.on("SIGINT", () => {
    server.close();

    console.log(`App finalizado`);
});
