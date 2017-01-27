import { Store } from "redux";
import { IUser, IRoom, IBlock } from "../../common/contracts";

export interface IBlockPartyStoreState {
    users: IUser[];
    rooms: IRoomState;
    ui: IUIState;
    options: IOwnUserOptions;
}

export interface IRoomState {
    rooms: IRoom[];
    currentRoomId: string;
    featureRoomIds: string[];
    blocksByRoom: { [roomId: string]: IBlock[] };
    roomByUserId: { [userId: string]: string };
}

export interface IOwnUserOptions {
    userId: string;
    blockColor: string;
}

export interface IUIState {
    isRoomDialogOpen: boolean;
    isBlockCurrentColorDialogOpen: boolean;
    isUserOptionDialogOpen: boolean;
}

export interface IBlockPartyStore extends Store<IBlockPartyStoreState> {
    dispatch: (action: IStoreAction) => IStoreAction;
}

export interface IBlockPartyComponentWithStoreAccess {
    store: IBlockPartyStore;
}

export namespace User {
    export interface ISetUserListAction {
        type: "SET_USER_LIST";
        users: IUser[];
    }

    export interface IAddUserAction {
        type: "ADD_USER";
        user: IUser;
    }

    export interface IRemoveUserAction {
        type: "REMOVE_USER";
        user: IUser;
    }

    export interface IRemoveUserAction {
        type: "REMOVE_USER";
        user: IUser;
    }

    export interface IUpdateUser {
        type: "UPDATE_USER";
        userId: string;
        color: string;
        name: string;
    }
}

export namespace UI {
    export interface IOpenRoomDialog {
        type: "UI_OPEN_ROOM_DIALOG";
    }

    export interface ICloseRoomDialog {
        type: "UI_CLOSE_ROOM_DIALOG";
    }

    export interface IOpenBlockCurrentColorDialog {
        type: "UI_OPEN_BLOCK_CURRENT_COLOR_DIALOG";
    }

    export interface ICloseBlockCurrentColorDialog {
        type: "UI_CLOSE_BLOCK_CURRENT_COLOR_DIALOG";
    }

    export interface IOpenUserOptionDialog {
        type: "UI_OPEN_USER_OPTION_DIALOG";
    }

    export interface ICloseUserOptionDialog {
        type: "UI_CLOSE_USER_OPTION_DIALOG";
    }
}

export namespace Options {
    export interface IChangeBlockColorAction {
        type: "OPTIONS_CHANGE_BLOCK_COLOR";
        color: string;
    }

    export interface ISetOwnUserOptionsAction {
        type: "OPTIONS_SET_OWN_USER_OPTIONS";
        blockColor: string;
        userId: string;
    }
}

export namespace Rooms {
    export interface IJoinRoomAction {
        type: "ROOMS_SET_CURRENT_ROOM";
        roomId: string;
    }

    export interface ISetBlocksForRoom {
        type: "ROOMS_SET_BLOCKS_FOR_ROOM";
        roomId: string;
        blocks: IBlock[];
    }

    // Incremental block updates.
    export interface IAddBlockToRoom {
        type: "ROOMS_ADD_BLOCK_TO_ROOM";
        roomId: string;
        block: IBlock;
    }

    export interface ISetRoomList {
        type: "ROOMS_SET_ROOM_LIST";
        rooms: IRoom[];
    }

    export interface IAddRoom {
        type: "ROOMS_ADD_ROOM";
        room: IRoom;
    }

    export interface ISetUserRoomList {
        type: "ROOMS_SET_USER_ROOM_LIST";
        roomByUserId: { [userId: string]: string };
    }
}

export type IUserAction = User.ISetUserListAction | User.IAddUserAction | User.IRemoveUserAction | User.IUpdateUser;
export type IOptionsAction = Options.IChangeBlockColorAction | Options.ISetOwnUserOptionsAction;
export type IUIAction = UI.ICloseRoomDialog | UI.IOpenRoomDialog | UI.IOpenBlockCurrentColorDialog | UI.ICloseBlockCurrentColorDialog | UI.IOpenUserOptionDialog | UI.ICloseUserOptionDialog;
export type IRoomAction = Rooms.IJoinRoomAction | Rooms.ISetBlocksForRoom | Rooms.IAddBlockToRoom | Rooms.ISetRoomList | Rooms.IAddRoom | Rooms.ISetUserRoomList;

export type IStoreAction = IUserAction | IOptionsAction | IUIAction | IRoomAction;
