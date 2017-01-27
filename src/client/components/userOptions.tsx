import * as React from "react";
import TextField from 'material-ui/TextField';

export default class UserOptions extends React.Component<{
    currentOptions: { name: string }, newUserOptionHandler: (options: { name: string }) => void
}, undefined> {

    private field: TextField;

    private handleTextFieldKeyDown = (event: React.KeyboardEvent<{}>) => {
        switch (event.key) {
            case 'Enter':
                this.props.newUserOptionHandler({ name: this.field.getValue() });
                break;
            default:
                break;
        }
    }

    public render() {
        return <div>
            <TextField ref={field => this.field = field} floatingLabelText="Name" defaultValue={this.props.currentOptions.name} hintText="Your name here" onChange={this.handleTextFieldKeyDown} onKeyDown={this.handleTextFieldKeyDown} />
        </div>;

        // TODO - Add button to save. Currently just the enter key.
    }
}
