require('module-alias/register');
import express    from 'express';
import httpServer from 'http';

const app = express();
const http = httpServer.createServer(app);




http.listen(3000, () => {

    // Connection.authenticate()
    // .then(() => {
    //     console.log('Servidor rodando!');
    // })
    // .catch((error) => {
    //   console.log(
    //     'Não conseguiu conectar ao banco de dados. \n Error: ' + error.message,
    //   );
    //   process.exit();
    // });

});