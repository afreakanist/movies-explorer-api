const {
  DATABASE = 'mongodb://localhost:27017/moviesdb', JWT_SECRET = 'dev-secret-key', NODE_ENV, PORT = 3001,
} = process.env;

module.exports = {
  DATABASE, JWT_SECRET, NODE_ENV, PORT,
};
