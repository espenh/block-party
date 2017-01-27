import * as _ from "lodash";
import { IInternalUser, IPlayerRepository } from "./contracts";

export default class PlayerRepository implements IPlayerRepository {
    private playersById: { [id: string]: IInternalUser };

    constructor() {
        this.playersById = {};
    }

    public getAllPlayers() {
        return _.values(this.playersById);
    }

    public addPlayer(player: IInternalUser) {
        if (this.playersById.hasOwnProperty(player.id)) {
            throw new Error(`Player with id: ${player.id} already exists.`);
        }

        this.playersById[player.id] = player;
        return player;
    }

    public getPlayerById(playerId: string) {
        return this.playersById[playerId];
    }

    public removePlayerById(playerId: string) {
        const playerToRemove = this.playersById[playerId];
        if (playerToRemove) {
            delete this.playersById[playerId];
        }

        return playerToRemove;
    }

    public setPlayerColor(playerId: string, color: string) {
        const player = this.playersById[playerId];
        if (player) {
            player.color = color;
        }
    }

    public setPlayerName(playerId: string, name: string) {
        const player = this.playersById[playerId];
        if (player && name) {
            player.name = name;
        }
    }

    private adjectives = [
        "bitter", "delicious", "fresh", "greasy", "juicy", "hot", "icy", "loose", "melted", "nutritious", "prickly", "rainy", "rotten", "salty", "sticky", "strong", "sweet", "tart", "tasteless", "uneven", "weak", "wet", "wooden", "yummy",
        "agreeable", "brave", "calm", "delightful", "eager", "faithful", "gentle", "happy", "jolly", "kind", "lively", "nice", "obedient", "proud", "relieved", "silly", "thankful", "victorious", "witty", "zealous",
        "alive", "better", "careful", "clever", "dead", "easy", "famous", "gifted", "helpful", "important", "inexpensive", "mushy", "odd", "powerful", "rich", "shy", "tender", "uninterested", "wrong"
    ];

    private nouns = ["apple", "arm", "banana", "bike", "bird", "book", "chin", "clam", "class", "clover", "club", "corn", "crayon", "crow", "crown", "crowd", "crib", "desk", "dime", "dirt", "dress", "fang ", "field", "flag", "flower", "fog", "game", "heat", "hill", "home", "horn", "hose", "joke", "juice", "kite", "lake", "maid", "mask", "mice", "milk", "mint", "meal", "meat", "moon", "mother", "morning", "name", "nest", "nose", "pear", "pen", "pencil", "plant", "rain", "river", "road", "rock", "room", "rose", "seed", "shape", "shoe", "shop", "show", "sink", "snail", "snake", "snow", "soda", "sofa", "star", "step", "stew", "stove", "straw", "string", "summer", "swing", "table", "tank", "team", "tent", "test", "toes", "tree", "vest", "water", "wing", "winter", "woman", "women"];

    public getRandomName() {
        return this.adjectives[_.random(0, this.adjectives.length - 1)] + " " + this.nouns[_.random(0, this.nouns.length - 1)];
    }
}
