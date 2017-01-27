import * as _ from "lodash";
import { IUser, IRoom, IBlock, IRoomWithBlocks } from "../common/contracts";
import { IInternalUser, IPlayerRepository } from "./contracts";

export default class ServerCommunicator {
    constructor(private hub: SocketIO.Server, private playerRepo: IPlayerRepository) {
    }

    public welcomeNewplayer(newPlayer: IInternalUser) {
        newPlayer.socket.emit("welcome", {});
        newPlayer.socket.emit("user-options", {
            blockColor: newPlayer.color,
            userId: newPlayer.id
        });
    }

    public notifyShutdown() {
        this.hub.emit("shutdown");
    }

    public notifyAboutNewRoom(newRoom: IRoomWithBlocks) {
        this.hub.emit("room-added", {
            room: <IRoom>{
                id: newRoom.id,
                name: newRoom.name,
                createdByUserId: newRoom.createdByUserId
            }
        });
    }

    public sendRoomListToPlayer(player: IInternalUser, rooms: IRoomWithBlocks[]) {
        // We don't want to pass the blocks when we're just sending the list of rooms.
        player.socket.emit("room-list", {
            rooms: _.map(rooms, (room): IRoom => {
                return {
                    id: room.id,
                    name: room.name,
                    createdByUserId: room.createdByUserId
                };
            })
        });
    }

    public handleBlockAddedToRoom(block: IBlock, roomId: string) {
        this.hub.in(roomId).emit("block-added", {
            block: block,
            roomId: roomId
        });
    }

    public handlePlayerRoomJoin(player: IInternalUser, room: IRoomWithBlocks) {
        player.socket.leaveAll();
        player.socket.join(room.id);
        player.socket.emit("room-joined", { roomId: room.id });
        player.socket.emit("room-block-state", { roomId: room.id, blocks: room.blocks });
    }

    public sendUserListToUser(user: IInternalUser, users: IInternalUser[]) {
        user.socket.emit("user-list", {
            users: _.map(users, userWithSocket => this.mapInternalUserToUser(userWithSocket))
        });
    }

    public addUser(user: IInternalUser) {
        this.hub.emit("user-added", { user: this.mapInternalUserToUser(user) });
    }

    public removeUser(user: IInternalUser) {
        this.hub.emit("user-removed", { user: this.mapInternalUserToUser(user) });
    }

    public updateUser(user: IInternalUser) {
        this.hub.emit("user-updated", { user: this.mapInternalUserToUser(user) });
    }

    public sendUserRoomList(roomByUserId: { [userId: string]: string }) {
        this.hub.emit("user-room-list", {
            roomByUserId: roomByUserId
        });
    }

    private mapInternalUserToUser(internalUser: IInternalUser): IUser {
        return {
            id: internalUser.id,
            name: internalUser.name,
            currentBlockColor: internalUser.color
        };
    }
}
