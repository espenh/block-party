import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import { createStore, combineReducers } from "redux";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { IBlockPartyStoreState } from "./store/contracts";
import { BlockPartyClientApp } from "./components/blockPartyClientApp";

import ClientCommunicator from "./clientCommunicator";
import * as reducers from './store/reducers';

// Needed for onTouchTap
injectTapEventPlugin();

const blockPartyAppReducer = combineReducers<IBlockPartyStoreState>({
    rooms: reducers.roomStateReducer,
    users: reducers.usersReducer,
    ui: reducers.uiReducer,
    options: reducers.optionsReducer
});

const store = createStore<IBlockPartyStoreState>(blockPartyAppReducer);
const serverCommunicator = new ClientCommunicator(store);

window.addEventListener("load", () => {
    const renderTarget = document.querySelector("#app") as HTMLDivElement;
    ReactDOM.render(
        <MuiThemeProvider>
            <BlockPartyClientApp store={store} communicator={serverCommunicator} />
        </MuiThemeProvider>, renderTarget);
});
