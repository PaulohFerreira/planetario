let express = require('express');
let serveStatic = require('serve-static');
let enforce = require('express-sslify');

let app = express();

//Faz o redirecionamento para HTTPS
app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(serveStatic('./site/'));
app.listen(process.env.PORT);