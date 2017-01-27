import * as _ from "lodash";
import { IRoomAction, IRoomState, IOwnUserOptions, IUIState, IUIAction, IOptionsAction, IUserAction } from "./contracts";
import { ICurrentRoom } from "../common/contracts";
import { IUser, IRoom } from "../../common/contracts";

const exampleRoom: IRoom = {
    id: "someid",
    createdByUserId: "bob",
    name: "legos"
};

export const roomStateReducer = (roomState: IRoomState = { rooms: [exampleRoom], featureRoomIds: [], blocksByRoom: {}, currentRoomId: exampleRoom.id, roomByUserId: {} }, action: IRoomAction): IRoomState => {
    switch (action.type) {
        case "ROOMS_SET_CURRENT_ROOM":
            return { ...roomState, currentRoomId: action.roomId };
        case "ROOMS_SET_BLOCKS_FOR_ROOM":
            const blocksAfterSettingNew = { ...roomState.blocksByRoom, [action.roomId]: action.blocks };
            return { ...roomState, blocksByRoom: blocksAfterSettingNew };
        case "ROOMS_ADD_BLOCK_TO_ROOM":
            const existingBlocksForRoom = roomState.blocksByRoom[action.roomId] || [];
            const blocksByRoomAfterAddingNewBlock = { ...roomState.blocksByRoom, [action.roomId]: existingBlocksForRoom.concat([action.block]) };
            return { ...roomState, blocksByRoom: blocksByRoomAfterAddingNewBlock };
        case "ROOMS_SET_ROOM_LIST":
            return { ...roomState, rooms: action.rooms };
        case "ROOMS_ADD_ROOM":
            return { ...roomState, rooms: roomState.rooms.concat([action.room]) };
        case "ROOMS_SET_USER_ROOM_LIST":
            return { ...roomState, roomByUserId: action.roomByUserId };
        default:
            return roomState;
    }
};

export const currentSceneReducer = (sceneState: ICurrentRoom = { roomId: "NA" }, action: IUIAction): ICurrentRoom => {
    switch (action.type) {

        default:
            return sceneState;
    }
};

export const usersReducer = (usersState: IUser[] = [], action: IUserAction): IUser[] => {
    switch (action.type) {
        case "SET_USER_LIST":
            return action.users;
        case "ADD_USER":
            if (_.find(usersState, existingUser => existingUser.id === action.user.id)) {
                // User already there.
                return usersState;
            }

            return usersState.concat(action.user);
        case "REMOVE_USER":
            const user = _.find(usersState, existingUser => existingUser.id === action.user.id);
            if (!user) {
                return usersState;
            }
            return _.without(usersState, user);
        case "UPDATE_USER":
            const userToUpdate = _.find(usersState, existingUser => existingUser.id === action.userId);
            if (!userToUpdate) {
                return usersState;
            }

            const userWithNewPropValues = Object.assign({}, userToUpdate, { currentBlockColor: action.color, name: action.name });
            return _.without(usersState, userToUpdate).concat([userWithNewPropValues]);
        default:
            return usersState;
    }
};

export const optionsReducer = (optionsState: IOwnUserOptions = {
    blockColor: "#3f6f9f",
    userId: "NA"
}, action: IOptionsAction): IOwnUserOptions => {
    switch (action.type) {
        case "OPTIONS_CHANGE_BLOCK_COLOR":
            if (optionsState !== null && action.color === optionsState.blockColor) {
                return optionsState;
            }
            return { ...optionsState, blockColor: action.color };
        case "OPTIONS_SET_OWN_USER_OPTIONS":
            return { ...optionsState, blockColor: action.blockColor, userId: action.userId };
        default:
            return optionsState;
    }
};

export const uiReducer = (uiState: IUIState = {
    isRoomDialogOpen: false,
    isBlockCurrentColorDialogOpen: false,
    isUserOptionDialogOpen: false
}, action: IUIAction): IUIState => {
    switch (action.type) {
        case "UI_OPEN_ROOM_DIALOG":
            return { ...uiState, isRoomDialogOpen: true };
        case "UI_CLOSE_ROOM_DIALOG":
            return { ...uiState, isRoomDialogOpen: false };
        case "UI_OPEN_BLOCK_CURRENT_COLOR_DIALOG":
            return { ...uiState, isBlockCurrentColorDialogOpen: true };
        case "UI_CLOSE_BLOCK_CURRENT_COLOR_DIALOG":
            return { ...uiState, isBlockCurrentColorDialogOpen: false };
        case "UI_OPEN_USER_OPTION_DIALOG":
            return { ...uiState, isUserOptionDialogOpen: true };
        case "UI_CLOSE_USER_OPTION_DIALOG":
            return { ...uiState, isUserOptionDialogOpen: false };
        default:
            return uiState;
    }
};
