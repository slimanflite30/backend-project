const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);

  process.exit(1);
});
const app = require('./app');

require('dotenv').config();
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
console.log(process.env.DATABASE);
// console.log(DB);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB Conection Success');
  })
  .catch(err => {
    console.log(err);
  });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
