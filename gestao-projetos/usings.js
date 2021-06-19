const bodyParser = require('body-parser');
const nocache = require('nocache');
const cors = require("cors");
const log = require("./log-control");


async function Usings(express, dirname, app) {
    try {
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }));
        app.use(nocache());
        app.disable('view cache');
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cors());

        app.use('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, access_token');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next();
        });

        app.use(express.static(dirname + '/public'));
    }
    catch (err) {
        log.LogError("usings", "Usings", err.message);
    }
}
exports.Usings = Usings;