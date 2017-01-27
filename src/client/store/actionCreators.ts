import * as storeContracts from "./contracts";
import { IUser, IRoom, IBlock } from "../../common/contracts";

export const rooms = {
    setCurrentRoom: (roomId: string): storeContracts.Rooms.IJoinRoomAction => {
        return {
            type: "ROOMS_SET_CURRENT_ROOM",
            roomId: roomId
        };
    },
    setBlocksForRoom: (roomId: string, blocks: IBlock[]): storeContracts.Rooms.ISetBlocksForRoom => {
        return {
            type: "ROOMS_SET_BLOCKS_FOR_ROOM",
            roomId: roomId,
            blocks: blocks
        };
    },
    addBlockToRoom: (roomId: string, block: IBlock): storeContracts.Rooms.IAddBlockToRoom => {
        return {
            type: "ROOMS_ADD_BLOCK_TO_ROOM",
            roomId: roomId,
            block: block
        };
    },
    setRoomList: (roomsToSet: IRoom[]): storeContracts.Rooms.ISetRoomList => {
        return {
            type: "ROOMS_SET_ROOM_LIST",
            rooms: roomsToSet
        };
    },
    addRoom: (room: IRoom): storeContracts.Rooms.IAddRoom => {
        return {
            type: "ROOMS_ADD_ROOM",
            room: room
        };
    },
    setUserRoomList: (roomByUserId: { [userId: string]: string }): storeContracts.Rooms.ISetUserRoomList => {
        return {
            type: "ROOMS_SET_USER_ROOM_LIST",
            roomByUserId: roomByUserId
        };
    }
};

export const options = {
    setBlockDrawingColor: (color: string): storeContracts.Options.IChangeBlockColorAction => {
        return {
            type: "OPTIONS_CHANGE_BLOCK_COLOR",
            color: color
        };
    },
    setOwnUserInfo: (userId: string, blockColor: string): storeContracts.Options.ISetOwnUserOptionsAction => {
        return {
            type: "OPTIONS_SET_OWN_USER_OPTIONS",
            blockColor: blockColor,
            userId: userId
        };
    }
};

export const ui = {
    // TODO - These feel like they could just be some component state (gasp!).
    openRoomDialog: (): storeContracts.UI.IOpenRoomDialog => {
        return {
            type: "UI_OPEN_ROOM_DIALOG"
        };
    },
    closeRoomDialog: (): storeContracts.UI.ICloseRoomDialog => {
        return {
            type: "UI_CLOSE_ROOM_DIALOG"
        };
    },
    openBlockCurrentColorDialog: (): storeContracts.UI.IOpenBlockCurrentColorDialog => {
        return {
            type: "UI_OPEN_BLOCK_CURRENT_COLOR_DIALOG"
        };
    },
    closeBlockCurrentColorDialog: (): storeContracts.UI.ICloseBlockCurrentColorDialog => {
        return {
            type: "UI_CLOSE_BLOCK_CURRENT_COLOR_DIALOG"
        };
    },
    openUserOptionDialog: (): storeContracts.UI.IOpenUserOptionDialog => {
        return {
            type: "UI_OPEN_USER_OPTION_DIALOG"
        };
    },
    closeUserOptionDialog: (): storeContracts.UI.ICloseUserOptionDialog => {
        return {
            type: "UI_CLOSE_USER_OPTION_DIALOG"
        };
    }
};

export const users = {
    addUser: (user: IUser): storeContracts.User.IAddUserAction => {
        return {
            type: "ADD_USER",
            user: user
        };
    },
    setUsers: (usersToSet: IUser[]): storeContracts.User.ISetUserListAction => {
        return {
            type: "SET_USER_LIST",
            users: usersToSet
        };
    },
    removeUser: (user: IUser): storeContracts.User.IRemoveUserAction => {
        return {
            type: "REMOVE_USER",
            user: user
        };
    },
    setUserInfo: (userId: string, color: string, name: string): storeContracts.User.IUpdateUser => {
        return {
            type: "UPDATE_USER",
            userId: userId,
            color: color,
            name: name
        };
    }
};
