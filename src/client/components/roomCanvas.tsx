import * as React from "react";
import Paper from 'material-ui/Paper';

import RoomCanvasToolbar from "./roomCanvasToolbar";
import * as storeContracts from "../store/contracts";
import * as commonContracts from "../common/contracts";
import BlockRenderer from '../blockRenderer';

export class RoomCanvas extends React.Component<{
    store: storeContracts.IBlockPartyStore,
    communicator: commonContracts.IClientCommunicator
}, any> {

    private canvas: HTMLCanvasElement;

    private readonly canvasStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        margin: 'auto'
    };

    private blocks: BlockRenderer;

    private unsubscribeFunction: () => void;
    private componentDidMount() {
        this.blocks = new BlockRenderer(this.canvas, "#ff0000", (block) => {
            const state = this.props.store.getState();
            this.props.communicator.addNewBlockToRoom(state.rooms.currentRoomId, block);
        });

        // Set initial block scene properties.
        const state = this.props.store.getState();
        this.blocks.setBlockPaintColor(state.options.blockColor);

        // Listen for changes and update block scene.
        this.unsubscribeFunction = this.props.store.subscribe(() => {
            const currentState = this.props.store.getState();

            this.blocks.setBlockPaintColor(currentState.options.blockColor);
            const blocksForRoom = currentState.rooms.blocksByRoom[currentState.rooms.currentRoomId] || [];
            this.blocks.setBlocks(blocksForRoom);
        });
    }

    private componentWillUnmount() {
        this.unsubscribeFunction();
    }

    public render() {
        return <canvas ref={canvasElement => this.canvas = canvasElement} style={this.canvasStyle}></canvas>;
    }
}

export class RoomCanvasWithToolbar extends React.Component<{
    store: storeContracts.IBlockPartyStore,
    communicator: commonContracts.IClientCommunicator
}, any> {

    // TODO - Move paper to parent component.
    private readonly paperStyle = {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        display: 'inline-block',
        position: 'relative'
    };

    public render() {
        return <Paper style={this.paperStyle} zDepth={0}>
            <RoomCanvas store={this.props.store} communicator={this.props.communicator} />
            <RoomCanvasToolbar store={this.props.store} communicator={this.props.communicator} />
        </Paper>;
    }
}
