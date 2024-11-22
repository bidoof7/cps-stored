import sql from "mssql";

interface DbConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    trustServerCertificate: boolean;
  };
}

const config: DbConfig = {
  user: process.env.DB_USER || "undefined",
  password: process.env.DB_PASSWORD || "undefined",
  server: process.env.DB_SERVER || "undefined",
  database: process.env.DB_DATABASE || "undefined",
  options: {
    trustServerCertificate: true,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | undefined;

export const getPool = (): Promise<sql.ConnectionPool> => {
  if (!poolPromise) {
    poolPromise = sql.connect(config).catch((err) => {
      console.error("Database connection failed", err);
      throw err;
    });
  }
  console.log("SQL Server connected")
  return poolPromise;
};

export default sql;
