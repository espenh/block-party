import * as _ from "lodash";
import * as React from "react";

import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import { IBlockPartyStore } from "../store/contracts";
import { RoomCanvasWithToolbar } from "./roomCanvas";
import { IClientCommunicator } from "../common/contracts";

import * as actionCreators from '../store/actionCreators';

import AppHeader from './appHeader';
import UserList from './userList';
import RoomList from './roomList';
import UserOptions from './userOptions';

export class BlockPartyClientApp extends React.Component<{
    store: IBlockPartyStore,
    communicator: IClientCommunicator
}, undefined> {

    private unsubscribeFunction: () => void;

    private handleRoomDialogCloseRequest() {
        this.props.store.dispatch(actionCreators.ui.closeRoomDialog());
    }

    private handleRoomDialogOpenRequest() {
        this.props.store.dispatch(actionCreators.ui.openRoomDialog());
    }

    private handleRoomSelected(roomId: string) {
        this.props.store.dispatch(actionCreators.ui.closeRoomDialog());
        this.props.communicator.joinRoom(roomId);
    }

    private handleCreateNewRoomRequest() {
        this.props.store.dispatch(actionCreators.ui.closeRoomDialog());
        this.props.communicator.createNewRoom();
    }

    private handleUserOptionsDialogOpenRequest() {
        this.props.store.dispatch(actionCreators.ui.openUserOptionDialog());
    }

    private handleUserOptionsDialogCloseRequest() {
        this.props.store.dispatch(actionCreators.ui.closeUserOptionDialog());
    }

    private handleNewNameRequest(options: { name: string }) {
        this.props.store.dispatch(actionCreators.ui.closeUserOptionDialog());
        this.props.communicator.setUserName(options.name);
    }

    private componentDidMount() {
        this.unsubscribeFunction = this.props.store.subscribe(() => {
            this.forceUpdate();
        });
    }
    private componentWillUnmount() {
        this.unsubscribeFunction();
    }

    public render() {
        const state = this.props.store.getState();
        const thisUser = _.find(state.users, user => user.id === state.options.userId);

        return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <AppHeader />
            <Paper zDepth={1} rounded={false} style={{ margin: "5px 20px 25px 20px", flexGrow: 1, flexShrink: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                <Toolbar  >
                    <div></div>
                    <ToolbarGroup lastChild={true}>
                        <RaisedButton label={"Rooms"} primary={true} onClick={this.handleRoomDialogOpenRequest.bind(this)}></RaisedButton>
                    </ToolbarGroup>
                </Toolbar>

                <div style={{ display: "flex", height: "100%", width: "100%" }}>
                    <RoomCanvasWithToolbar store={this.props.store} communicator={this.props.communicator} />
                    <div style={{ height: "100%", flexGrow: 0, flexShrink: 1, minWidth: "260px", overflow: "auto" }}>
                        <UserList store={this.props.store} onOwnUserClicked={this.handleUserOptionsDialogOpenRequest.bind(this)} />
                    </div>
                </div>

                <Dialog
                    title="Rooms"
                    actions={[]}
                    modal={false}
                    open={state.ui.isRoomDialogOpen}
                    onRequestClose={this.handleRoomDialogCloseRequest.bind(this)}
                    autoScrollBodyContent={true}>
                    <RoomList store={this.props.store} onRoomSelected={this.handleRoomSelected.bind(this)} onNewRoomCreateRequest={this.handleCreateNewRoomRequest.bind(this)}></RoomList>
                </Dialog>

                <Dialog
                    title="User"
                    actions={[]}
                    modal={false}
                    open={state.ui.isUserOptionDialogOpen}
                    onRequestClose={this.handleUserOptionsDialogCloseRequest.bind(this)}
                    autoScrollBodyContent={true}>
                    <UserOptions currentOptions={{ name: thisUser ? thisUser.name : "" }} newUserOptionHandler={this.handleNewNameRequest.bind(this)} />
                </Dialog>
            </Paper>
        </div>;
    }
}
