export interface IBlock {
    position: IVector3;
    color: string;
}

export interface IVector3 {
    x: number;
    y: number;
    z: number;
}

export interface IRoom {
    id: string;
    name: string;
    createdByUserId: string;
}

export interface IRoomWithBlocks extends IRoom {
    blocks: IBlock[];
}

export interface IUser {
    id: string;
    name: string;
    currentBlockColor: string;
}
