import * as React from "react";
import * as _ from "lodash";

import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import { IBlockPartyStore } from "../store/contracts";
import { IRoom } from "../../common/contracts";

export default class UserList extends React.Component<{ store: IBlockPartyStore, onOwnUserClicked: () => void }, undefined> {

    public render() {
        const state = this.props.store.getState();
        const thisUser = _.find(state.users, user => user.id === state.options.userId);
        if (thisUser === undefined) {
            return <div></div>;
        }

        const otherUsers = _.without(state.users, thisUser);
        const roomsById = _.reduce(state.rooms.rooms, (o, r) => (o[r.id] = r, o), {} as { [roomId: string]: IRoom });
        const getRoomForUserId = (userId: string) => {
            const userRoom = state.rooms.roomByUserId[userId];
            if (userRoom === undefined) {
                return "Unknown";
            }

            if (!roomsById[state.rooms.roomByUserId[userId]]) {
                return "Unknown";
            }

            return roomsById[state.rooms.roomByUserId[userId]].name;
        };

        return <List>
            <Subheader>You</Subheader>
            {thisUser !== undefined ?
                (<ListItem
                    key={thisUser.id}
                    onTouchTap={this.props.onOwnUserClicked}
                    style={{ fontWeight: "bold" }}
                    primaryText={thisUser.name}
                    secondaryText={getRoomForUserId(thisUser.id)}
                    leftAvatar={<Avatar backgroundColor={thisUser.currentBlockColor} />} />)
                : (<div></div>)
            }
            <Divider />
            <Subheader>Users</Subheader>
            {_.sortBy(otherUsers, user => user.id === state.options.userId).map(user => {
                return <ListItem
                    key={user.id}
                    disabled={true}
                    primaryText={user.name}
                    secondaryText={getRoomForUserId(user.id)}
                    leftAvatar={<Avatar backgroundColor={user.currentBlockColor}></Avatar>} />;
            })}
        </List>;
    }
}
