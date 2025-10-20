module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: process.env.PS_HOST,
        user: process.env.PS_USER,
        password: process.env.PS_PW,
        database: process.env.PS_DB,
        port: process.env.PS_PORT,
        charset: 'utf8'
      }
    }
  };
  