import { IBlock } from "../../common/contracts";

export interface IClientCommunicator {
    addNewBlockToRoom: (roomId: string, block: IBlock) => void;
    joinRoom: (roomId: string) => void;
    createNewRoom: () => void;
    setUserColor: (color: string) => void;
    setUserName: (name: string) => void;
}
