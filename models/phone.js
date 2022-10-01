import Sequelize  from 'sequelize';
import Connection from '../factory/db-connection.js';
import contactModel from './contacts.js';

const phoneModel = Connection
.define('Telefone', {
    IDCONTATO: {
        type: Sequelize.INTEGER(14),
        allowNull: false
    },
    NUMERO: {
        type: Sequelize.STRING(16),
        allowNull: false
    }
});

phoneModel.belongsTo(contactModel, {
    constraints: 'FK_CONTATO',
    foreignKey: 'IDCONTATO',
    references: 'id',
})

export default phoneModel;
