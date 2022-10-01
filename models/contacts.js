import Sequelize  from 'sequelize';
import Connection from '../factory/db-connection.js';

const contact = Connection
.define('Contato', {
    NOME: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    IDADE: {
        type: Sequelize.INTEGER(3),
        allowNull: true
    }
});


export default contact;
