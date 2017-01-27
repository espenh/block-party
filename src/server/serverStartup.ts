import * as http from "http";
import * as ex from "express";
import * as path from "path";

import BlockPartyServer from "./blockPartyServer";

const port = process.env.PORT || '8080';

const logger = {
    log: (text: string) => {
        console.log(text);
    }
};

const blockPartyServerParams = {
    logger: logger
};

// Create block party server.
logger.log(`Creating block party server with args: ${JSON.stringify(blockPartyServerParams, null, 2)}`);
const blockPartyServer = new BlockPartyServer(blockPartyServerParams);
const blockPartyRequestHandler = blockPartyServer.getRequestHandlerForReqistration();
blockPartyRequestHandler.use(ex.static(path.resolve(__dirname)));
blockPartyRequestHandler.get('/favicon.ico', (request, response) => {
    response.sendStatus(204);
});

// Create http server.
const httpServer = http.createServer(blockPartyRequestHandler);
blockPartyServer.initializeUsingServer(httpServer);

httpServer.on('error', (err) => {
    logger.log(`Error: ${JSON.stringify(err, null, 2)}`);
});
httpServer.on('listening', () => {
    logger.log(`Server started on port: ${JSON.stringify(httpServer.address(), null, 2)}`);
});

httpServer.listen(port);
