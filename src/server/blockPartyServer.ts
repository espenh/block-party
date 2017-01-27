import { Server } from "http";
import * as sio from "socket.io";
import * as ex from "express";
import * as _ from "lodash";
import * as tinycolor from "tinycolor2";

import { IBlock, IRoomWithBlocks } from "../common/contracts";

import { IPlayerRepository } from "./contracts";
import PlayerRepository from "./playerRepository";
import ServerCommunicator from "./serverCommunicator";

interface IBlockPartyServerArgs {
    logger: {
        log: (text: string) => void;
    };
}

export default class BlockPartyServer {

    private app: ex.Express;
    private hub: SocketIO.Server;
    private playerRepo: IPlayerRepository;
    private communicator: ServerCommunicator;

    private readonly lobbyRoomId: string;
    private readonly roomsById: {
        [roomId: string]: IRoomWithBlocks
    };
    private readonly usersCurrentRoom: {
        [userId: string]: string;
    };

    constructor(private args: IBlockPartyServerArgs) {
        this.app = ex();
        this.playerRepo = new PlayerRepository();

        this.app.use("/roomblocks", (request, response) => {
            response.send(this.roomsById);
        });

        this.lobbyRoomId = "_lobby";
        this.roomsById = {};
        this.usersCurrentRoom = {};
    }

    public getRequestHandlerForReqistration() {
        return this.app;
    }

    public initializeUsingServer(server: Server) {
        this.args.logger.log("Starting SocketIO");

        this.hub = sio(server);

        this.communicator = new ServerCommunicator(this.hub, this.playerRepo);

        this.roomsById[this.lobbyRoomId] = {
            id: this.lobbyRoomId,
            name: "Lobby",
            createdByUserId: "system",
            blocks: []
        };

        this.hub.on('connection', (socket) => {
            const player = this.playerRepo.addPlayer({
                id: socket.id,
                name: this.playerRepo.getRandomName(),
                socket: socket,
                color: tinycolor.random().toHexString()
            });

            // Welcome.
            this.communicator.welcomeNewplayer(player);

            // Send list of possible rooms.
            this.communicator.sendRoomListToPlayer(player, _.values(this.roomsById));

            // Send list of users.
            this.communicator.sendUserListToUser(player, this.playerRepo.getAllPlayers());

            // Join default room.
            this.communicator.handlePlayerRoomJoin(player, this.roomsById[this.lobbyRoomId]);
            this.usersCurrentRoom[player.id] = this.lobbyRoomId;
            this.communicator.sendUserRoomList(this.usersCurrentRoom); // TODO - Incremental!

            socket.on('join-room', (data: { roomId: string }) => {
                const roomToJoin = data.roomId;
                if (!roomToJoin || !this.roomsById[roomToJoin]) {
                    return;
                }

                this.communicator.handlePlayerRoomJoin(player, this.roomsById[roomToJoin]);
                this.usersCurrentRoom[player.id] = roomToJoin;
                this.communicator.sendUserRoomList(this.usersCurrentRoom); // TODO - Incremental!
            });

            socket.on('create-room', (data: {}) => {
                // TODO - Proper GUID.
                const roomToCreate = "created-room" + _.random(0, Number.MAX_SAFE_INTEGER);
                if (this.roomsById[roomToCreate]) {
                    return;
                };

                // Create the room.
                this.roomsById[roomToCreate] = {
                    id: roomToCreate,
                    createdByUserId: player.name,
                    name: "Room " + _.keys(this.roomsById).length,
                    blocks: []
                };

                this.communicator.handlePlayerRoomJoin(player, this.roomsById[roomToCreate]);
                this.usersCurrentRoom[player.id] = roomToCreate; // TODO - Move this stuff to one place.
                this.communicator.sendUserRoomList(this.usersCurrentRoom); // TODO - Incremental!

                // Notify everyone about the new room.
                this.communicator.notifyAboutNewRoom(this.roomsById[roomToCreate]);
            });

            socket.on('disconnect', () => {
                this.playerRepo.removePlayerById(player.id);
                this.communicator.removeUser(player);
                delete this.usersCurrentRoom[player.id];

            });

            socket.on('add-block', (data: { block: IBlock, roomId: string }) => {
                if (!data.block) {
                    return;
                }

                if (!this.roomsById[data.roomId]) {
                    return;
                }

                this.roomsById[data.roomId].blocks.push(data.block);
                this.communicator.handleBlockAddedToRoom(data.block, data.roomId);
            });

            socket.on('user-color', (data: { color: string }) => {
                this.playerRepo.setPlayerColor(player.id, data.color);
                this.communicator.updateUser(this.playerRepo.getPlayerById(player.id));
            });

            socket.on('user-name', (data: { name: string }) => {
                this.playerRepo.setPlayerName(player.id, data.name);
                this.communicator.updateUser(this.playerRepo.getPlayerById(player.id));
            });

            this.communicator.addUser(player);
        });
    }

    public dispose() {
        this.communicator.notifyShutdown();
    }
}
