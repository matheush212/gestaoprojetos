const express = require('express');
const routes = require('./routes');
const usings = require('./usings');

const singletonDB = require('singleton-db');
singletonDB.Instance.createInstance(__dirname+"/db/database/sgpDB.db");

const app = express();
usings.Usings(express, __dirname, app);
const port = process.env.PORT || 5000;

routes.GetRoutes(__dirname, app);
routes.PostRoutes(__dirname, app);
routes.PutRoutes(__dirname, app);
routes.DeleteRoutes(__dirname, app);

app.listen(port, () => console.log(`Listening on port ${port}`));