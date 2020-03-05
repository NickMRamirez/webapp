const express = require('express')
const timeout = require('connect-timeout')
const uuid = require('uuid')
const app = express()
app.use(timeout('30s'))
app.use(function(req, res, next) {
    if (!req.timeout) {
        next();
    }
})
const port = 80

const version = "1.3"

var guid = uuid.v4();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/', (req, res) => res.send(`Served by: ${guid}`))

app.get('/version', (req, res) => res.send(`Version: ${version}`))

app.get('/delay/:seconds', async function(req, res) {
    var seconds = parseInt(req.params["seconds"], 10);
    console.log(`Delay ${seconds}`);
    await sleep(seconds*1000);

    console.log("Returning response");
    res.sendStatus(200);
})

app.get('/200', function(req, res) {
    console.log("GET /200 - Returning 200 OK.");
    res.sendStatus(200);
});

app.get('/403', function(req, res) {
    if (req.query['server']) {
        if (req.query['server'] == process.env.name) {
            console.log("GET /403 - Returning 403 Forbidden.");
            res.sendStatus(403);
            return;
        }

        res.sendStatus(200);
        return;
    }

    console.log("GET /403 - Returning 403 Forbidden.");
    res.sendStatus(403);
});

app.get('/404', function(req, res) {
    console.log("GET /404 - Returning 404 Not Found.");
    res.sendStatus(404);
});

app.get('/500', function(req, res) {
    if (req.query['server']) {
        if (req.query['server'] == process.env.name) {
            console.log("GET /500 - Returning 500 Server Error.");
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
        return;
    }

    console.log("GET /500 - Returning 500 Server Error.");
    res.sendStatus(500);
});

app.get('/503', function(req, res) {
    console.log("/503 - Returning 503 Service Unavailable.");
    res.sendStatus(503);
});

app.post('/200', function(req, res) {
    console.log("POST /200 - Returning 200 OK.");
    res.sendStatus(200);
});

app.post('/403', function(req, res) {
    console.log("POST /200 - Returning 403 Forbidden.");
    res.sendStatus(403);
});

app.post('/404', function(req, res) {
    console.log("POST /404 - Returning 404 Not Found.");
    res.sendStatus(404);
});

app.post('/500', function(req, res) {
    console.log("POST /500 - Returning 500 Server Error.");
    res.sendStatus(500);
});

app.post('/503', function(req, res) {
    console.log("POST /503 - Returning 503 Service Unavailable.");
    res.sendStatus(503);
});

const server = app.listen(port, () => console.log(`Server listening on port ${port}`));

process.on('SIGTERM', function() {
    server.close(function() {
        process.exit(0);
    })
})