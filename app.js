import express    from 'express';
import httpServer from 'http';
import { resolve } from 'path';
import bodyParser from 'body-parser';

import dbConnection from './factory/db-connection.js';
import databaseRouter from './routes/database.js';
import contactRoute from './routes/contacts.js';

const app = express();
const http = httpServer.createServer(app);

app.set('view engine', 'ejs');
app.set('views', resolve('views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(resolve('public')));

// ### Importar rotas ### //
app.use('/database', databaseRouter);
app.use('/contact', contactRoute);

http.listen(3000, () => {

    dbConnection.authenticate()
    .then(() => {
        console.log('Servidor rodando!');
    })
    .catch((error) => {
      console.log(
        'Não conseguiu conectar ao banco de dados. \n Error: ' + error.message,
      );
      process.exit();
    });

});
