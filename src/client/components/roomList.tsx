import * as React from "react";
import * as _ from "lodash";

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';

import BlockRenderer from '../blockRenderer';
import { IBlockPartyStore } from "../store/contracts";
import { IRoom, IRoomWithBlocks } from "../../common/contracts";

export default class RoomList extends React.Component<{
    store: IBlockPartyStore,
    onRoomSelected: (roomId: string) => void,
    onNewRoomCreateRequest: () => void
}, undefined> {


    private previewsToUpdate: RoomPreview[] = [];
    private timeoutToken: number | undefined;
    private canvasToDrawOn: HTMLCanvasElement;

    private componentDidMount() {
        this.canvasToDrawOn = document.createElement("canvas");
        this.canvasToDrawOn.style.width = "200px";
        this.canvasToDrawOn.style.height = "150px";
        this.canvasToDrawOn.style.opacity = "0";
        this.canvasToDrawOn.style.position = "absolute";
        this.canvasToDrawOn.style.top = "0";
        this.canvasToDrawOn.style.left = "0";
        document.firstElementChild.appendChild(this.canvasToDrawOn);

        const blocker = new BlockRenderer(this.canvasToDrawOn);

        const updateBlocks = () => {
            // TODO - This is a bit of a hack.
            // While the room list is open, we fetch an object that has the blocks for every room.
            // An idea might be to join some special room-channel when opening this component - and that channel gets every block-update, regardless of room.
            fetch("/roomblocks").then(response => {
                response.json().then((roomData: {
                    [roomId: string]: IRoomWithBlocks
                }) => {
                    if (this.timeoutToken === undefined) {
                        return;
                    }

                    _.each(this.previewsToUpdate, preview => {
                        const blocks = roomData[preview.props.room.id];
                        if (blocks) {
                            blocker.setBlocks(blocks.blocks);
                            const image = blocker.renderToImage();
                            preview.setPreviewImage(image);
                        }
                    });
                });
            }).then(() => {
                this.timeoutToken = window.setTimeout(updateBlocks, 3000);
            }).catch(() => {
                this.timeoutToken = window.setTimeout(updateBlocks, 3000);
            });
        };

        updateBlocks();
    }

    private componentWillUnmount() {
        if (this.timeoutToken !== undefined) {
            window.clearTimeout(this.timeoutToken);
            this.timeoutToken = undefined;
        }

        this.canvasToDrawOn.remove();
    }

    private addPreview(preview: RoomPreview) {
        if (preview === null) {
            // TODO - Figure out why this is. React is (by design) calling the ref function with null in detachRef. I'm probably wiring up the components in a wonky way.
            return;
        }

        this.previewsToUpdate.push(preview);
    }

    public render() {
        const state = this.props.store.getState();
        const roomState = state.rooms;
        this.previewsToUpdate = [];

        return <div>
            <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none" }}>
                {roomState.rooms.map(room => {
                    return <RoomPreview key={room.id} ref={roomPreview => this.addPreview(roomPreview)} room={room} onRoomSelected={this.props.onRoomSelected}></RoomPreview>;
                })}
            </ul>
            <FloatingActionButton style={{ position: "fixed", bottom: 0, right: 0, margin: "30px" }} mini={true} onClick={this.props.onNewRoomCreateRequest}>
                <ContentAdd />
            </FloatingActionButton>
        </div>;
    }
}

interface IRoomPreviewParams {
    room: IRoom;
    onRoomSelected?: (roomId: string) => void;
}

class RoomPreview extends React.Component<IRoomPreviewParams, { imageData: string }> {

    constructor(props: IRoomPreviewParams) {
        super(props);

        this.state = {
            imageData: ""
        };
    }

    private handleClick() {
        if (this.props.onRoomSelected) {
            this.props.onRoomSelected(this.props.room.id);
        }
    }

    public setPreviewImage(imageData: string) {
        if (this.state.imageData === imageData) {
            return;
        }

        this.setState({ imageData: imageData });
    }

    public render() {
        return <li style={{ minWidth: "200px", height: "250px", margin: "5px", display: "inline-block" }} className={"highlight-on-hover"} >
            <a href={"#"} onClick={this.handleClick.bind(this)} style={{ textDecoration: "none" }}>
                <Card>
                    <CardMedia>
                        <img src={this.state.imageData} style={{ height: "150px", width: "200px" }} />
                    </CardMedia>
                    <CardTitle title={this.props.room.name} subtitle={this.props.room.createdByUserId} />
                </Card>
            </a>
        </li>;
    }
}
