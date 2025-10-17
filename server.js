const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const indexRouter = require('./routes');
var createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const chalk = require("chalk");
const figlet = require("figlet");
// const swaggerDocument = require('./swagger/swagger.json');
const helmet = require('helmet');
const path = require('path');
var cors = require('cors');
var dotenv = require('@dotenvx/dotenvx');
dotenv.config();

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Selamat datang di server Node.js!');
});

// app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

morgan.token('remote-addr', (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});
  
app.use(morgan(':date[iso] :remote-addr :method :url :status :response-time ms - :res[content-length]'));
app.use('/api', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });

console.log(
    color(
        figlet.textSync("BOILERPLET CRUD", {
            font: "Fire Font-k",
            horizontalLayout: "default",
            vertivalLayout: "default",
            whitespaceBreak: false,
        }),
        "white"
    )
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
