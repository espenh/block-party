import * as React from "react";

const AppHeader: React.StatelessComponent<any> = (props: {}) => {
    return <div className={"header-container"} style={{ flexGrow: 0, flexShrink: 0 }}>
        <span>
            <span className={"header-block-text"}>block</span>
            <span className={"header-party-text"}>party</span>
        </span>
    </div>;
};

export default AppHeader;
