import { Sequelize } from 'sequelize';

const connection = new Sequelize('db_davinti', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  timezone: '+00:00',
  logging: true,
});

export { connection as default };
