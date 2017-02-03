import * as React from "react";
import * as tinycolor from "tinycolor2";

import RaisedButton from 'material-ui/RaisedButton';
import SquareIcon from 'material-ui/svg-icons/av/stop';
import Popover from 'material-ui/Popover';
import Snackbar from 'material-ui/Snackbar';

import { GithubPicker } from 'react-color';
import { grey600, fullWhite } from 'material-ui/styles/colors';

import { IBlockPartyStore } from "../store/contracts";
import { IClientCommunicator } from "../common/contracts";
import * as actionCreators from '../store/actionCreators';

export default class RoomCanvasToolbar extends React.Component<{
    store: IBlockPartyStore,
    communicator: IClientCommunicator
}, any> {

    private readonly style = {
        margin: "5px",
        float: "left",
        minWidth: "50px"
    };

    public state = {
        anchorEl: undefined,
        snackbarOpen: false
    };

    private unsubscribeFunction: () => void;

    handleTouchTap = (event: __MaterialUI.TouchTapEvent) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            anchorEl: event.currentTarget,
            snackbarOpen: false
        });

        this.props.store.dispatch(actionCreators.ui.openBlockCurrentColorDialog());
    }

    private handlePopoverRequestClose = () => {
        this.props.store.dispatch(actionCreators.ui.closeBlockCurrentColorDialog());
    }

    private handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false
        });
    }

    private handleColorChange = (x: ReactColor.ColorResult) => {
        this.props.communicator.setUserColor(x.hex);
        this.handlePopoverRequestClose();
    }

    private handleCameraPositionSave = () => {
        this.setState({
            snackbarOpen: true
        });
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
        const color = state.options.blockColor;
        
        // Find a background color that works with the brightness of the block color.
        const backgroundColor = tinycolor(color).getBrightness() > 230 ? grey600 : fullWhite;

        return <div style={{ position: "absolute", left: "10px", top: "10px" }} >
            <RaisedButton
                backgroundColor={backgroundColor}
                onTouchTap={this.handleTouchTap}
                icon={<SquareIcon color={color} style={{ width: "35px", height: "35px" }} />}
                style={this.style}
            />
            <Popover
                open={state.ui.isBlockCurrentColorDialogOpen}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                useLayerForClickAway={false}
                onRequestClose={this.handlePopoverRequestClose} style={{ padding: "5px" }}>
                <GithubPicker triangle="hide" onChangeComplete={this.handleColorChange} />
            </Popover>
            <Snackbar
                open={this.state.snackbarOpen}
                message="Camera position saved"
                autoHideDuration={2000}
                onRequestClose={this.handleSnackbarRequestClose}
            />
        </div>;
    }
}
