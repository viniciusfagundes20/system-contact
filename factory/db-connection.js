import { Sequelize } from 'sequelize';
import { host, userdb, passdb, database, portdb } from '@const/app.js';

const connection = new Sequelize(database, userdb, passdb, {
  host: host,
  port: portdb,
  dialect: 'mysql',
  timezone: '+00:00',
  logging: false,
});

export { connection as default };
