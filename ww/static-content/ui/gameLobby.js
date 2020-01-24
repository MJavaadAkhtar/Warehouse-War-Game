class LobbyComponent extends React.Component {
    constructor(props) {
        super(props);
        var avatars = [ { id: "coolImg", filename: "icons/face-cool-24.png", name: "Sunglasses Dude"}, 
                        { id: "forkliftImg", filename: "icons/forklift.png", name: "Monsterlift X1000"}];
        this.state = { msg: "", canSend: false, avatars: avatars};
        this.send = this.send.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.arnoldUnlocked = false;
    }

    updateMessage(e) {
        if (e.target.value.length > 0){ 
            this.setState({ msg: e.target.value, canSend: true });
        } else {
            this.setState({ msg: e.target.value} );
        }
    }

    send(e) {
        e.preventDefault();
        if (this.state.msg.toUpperCase() === "ARNOLD ROCKS") {
            var avatars = this.state.avatars;

            // Insert arnold image to avatars list if it's not already there
            var arnoldEntry = {id: "arnoldImg", filename: "icons/arnold.png", name: "Arnold R."};
            var entry;
            var contains = false;

            for (entry in avatars){
                if (entry === arnoldEntry) {
                    contains = true;
                }
            }
            if (!contains) {
                avatars.push(arnoldEntry)
            }
        }
        sendMessage(currentUsername, this.state.msg);
        this.setState({msg: ""});
    }

    render(props){
        return (
            <div id="lobby" className="not-banner"> 
                <center> <h2> Welcome to the Game Lobby </h2> </center>

                <div id="chatArea">
                    <h4>Chat!</h4>
                    <div id="chat">
                        <div id="messages"></div>
                        <form onSubmit={this.send}> 
                            <ReactBootstrap.FormControl 
                                id="message"
                                type="text" 
                                value={this.state.msg}
                                onChange={this.updateMessage}
                            />
                            <center>
                                <ReactBootstrap.Button id="secondary-button" disabled={!this.state.canSend} >Send</ReactBootstrap.Button>
                            </center>
                        </form>
                    </div>
                </div>
                <StartGameComponent startGame={this.props.startGame} avatars={this.state.avatars}/>
            </div>
        );
    }
}

class StartGameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.selectAvatar = this.selectAvatar.bind(this);
        this.checkClicked = this.checkClicked.bind(this);
        this.state = { avatarID: "", isAvatarSelected: false};
    }

    selectAvatar(id) {
        this.setState({ avatarID : id, isAvatarSelected: true});
    }

    checkClicked(id) {
        return this.state.avatarID === id ? "avatar-button-clicked" : "avatar-button";
    }

    render(props) {
        var playValidationState = this.state.isAvatarSelected ? "success" : "error";
        return (
            <div>
                <div id="avatars">
                    <h4>Pick your avatar:</h4>
                    <div id="pick-avatar">
                        <AvatarTable checkClicked={this.checkClicked} selectAvatar={this.selectAvatar} avatars={this.props.avatars}/>
                    </div>
                </div>
                <center>
                    <form onSubmit={this.props.startGame} >
                        <ReactBootstrap.FormGroup validationState={playValidationState}>
                            <ReactBootstrap.Button
                                type="submit"
                                className="button"
                                disabled={!this.state.isAvatarSelected}>
                                Play!
                            </ReactBootstrap.Button>
                            <ReactBootstrap.HelpBlock className="startGameButton" >Must select an avatar to play</ReactBootstrap.HelpBlock>
                        </ReactBootstrap.FormGroup>
                    </form>
                </center>
            </div>
        );
    }
}

class AvatarTable extends React.Component {
    constructor(props){
        super(props);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(row){
        return (
            <tr key={row.id} className={this.props.checkClicked(row.id)} onClick={() => {this.props.selectAvatar(row.id)}}>
                <td><img className="avatar" src={row.filename}/></td>
                <td>{row.name}</td>
            </tr>
        );
    }

    render(props){
        return (
            <table>
                <tbody>
                    {this.props.avatars.map(row=> {
                        return this.renderRow(row);
                    })}
                </tbody>
            </table>
        );
    }
}