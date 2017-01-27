export interface IInternalUser {
    id: string;
    name: string;
    socket: SocketIO.Socket;
    color: string;
}

export interface IPlayerRepository {
    getAllPlayers: () => IInternalUser[];
    addPlayer: (player: IInternalUser) => IInternalUser;
    removePlayerById: (playerId: string) => IInternalUser;
    getPlayerById: (playerId: string) => IInternalUser;

    setPlayerColor: (playerId: string, color: string) => void;
    setPlayerName: (playerId: string, name: string) => void;
    getRandomName: () => string;
}
