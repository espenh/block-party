import * as sio from "socket.io-client";
import { IRoom, IBlock, IUser } from '../common/contracts';
import * as commonContracts from './common/contracts';
import * as storeContracts from './store/contracts';
import * as actionCreators from './store/actionCreators';

export default class ClientCommunicator implements commonContracts.IClientCommunicator {

    private readonly thing = sio();
    private readonly socket = this.thing.connect();

    constructor(private store: storeContracts.IBlockPartyStore) {

        this.socket.on('room-joined', (data: { roomId: string }) => {
            this.store.dispatch(actionCreators.rooms.setCurrentRoom(data.roomId));
        });

        this.socket.on('room-block-state', (data: { roomId: string, blocks: IBlock[] }) => {
            this.store.dispatch(actionCreators.rooms.setBlocksForRoom(data.roomId, data.blocks));
        });

        this.socket.on('block-added', (data: { roomId: string, block: IBlock }) => {
            this.store.dispatch(actionCreators.rooms.addBlockToRoom(data.roomId, data.block));
        });

        this.socket.on('room-list', (data: { rooms: IRoom[] }) => {
            this.store.dispatch(actionCreators.rooms.setRoomList(data.rooms));
        });

        this.socket.on('room-added', (data: { room: IRoom }) => {
            this.store.dispatch(actionCreators.rooms.addRoom(data.room));
        });

        this.socket.on('user-list', (data: { users: IUser[] }) => {
            this.store.dispatch(actionCreators.users.setUsers(data.users));
        });

        this.socket.on('user-added', (data: { user: IUser }) => {
            this.store.dispatch(actionCreators.users.addUser(data.user));
        });

        this.socket.on('user-removed', (data: { user: IUser }) => {
            this.store.dispatch(actionCreators.users.removeUser(data.user));
        });

        this.socket.on('user-updated', (data: { user: IUser }) => {
            this.store.dispatch(actionCreators.users.setUserInfo(data.user.id, data.user.currentBlockColor, data.user.name));

            // TODO - Block color is stored on user list and under options.
            if (this.store.getState().options.userId === data.user.id) {
                this.store.dispatch(actionCreators.options.setOwnUserInfo(data.user.id, data.user.currentBlockColor));
            }
        });

        this.socket.on('user-options', (data: { userId: string, blockColor: string }) => {
            this.store.dispatch(actionCreators.options.setOwnUserInfo(data.userId, data.blockColor));
        });

        this.socket.on('user-room-list', (data: { roomByUserId: { [userId: string]: string } }) => {
            this.store.dispatch(actionCreators.rooms.setUserRoomList(data.roomByUserId));
        });
    }

    public addNewBlockToRoom(roomId: string, block: IBlock) {
        this.socket.emit("add-block", { roomId: roomId, block: block });
    }

    public joinRoom(roomId: string) {
        this.socket.emit("join-room", { roomId: roomId });
    }

    public createNewRoom() {
        this.socket.emit("create-room");
    }

    public setUserColor(color: string) {
        this.socket.emit("user-color", { color: color });
    }

    public setUserName(name: string) {
        this.socket.emit("user-name", { name: name });
    }
}
