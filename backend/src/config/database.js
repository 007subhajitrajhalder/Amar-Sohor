import "dotenv/config";
import mysql from "mysql2/promise";

const databasePool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit:
    Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,

  decimalNumbers: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function testDatabaseConnection() {
  let connection;

  try {
    connection = await databasePool.getConnection();

    const [result] = await connection.query(`
      SELECT
        DATABASE() AS databaseName,
        VERSION() AS mysqlVersion,
        NOW() AS connectedAt
    `);

    console.log("MySQL connection successful");
    console.log(`Database: ${result[0].databaseName}`);
    console.log(`MySQL version: ${result[0].mysqlVersion}`);

    return true;
  } catch (error) {
    console.error("MySQL connection failed");
    console.error(`Error code: ${error.code}`);
    console.error(`Message: ${error.message}`);

    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export default databasePool;