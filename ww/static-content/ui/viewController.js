class ControlComponent extends React.Component {
    constructor(props) {
        super(props);
        // What to show:
        this.state = {view: "login"}
        this.registerNewHandler = this.registerNewHandler.bind(this);
        this.gotoLobbyHandler = this.gotoLobbyHandler.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.showGameHandler = this.showGameHandler.bind(this);
        this.gotoProfileHandler = this.gotoProfileHandler.bind(this);
    }

    registerNewHandler() {
        this.setState({ view: "register"});
    }

    gotoLobbyHandler() {
        // Assuming already verified credentials
        sendClientToPage("lobby");
        this.setState({ view: "lobby" });
    }

    gotoProfileHandler(){
        sendClientToPage("profile");
        this.setState({ view: "profile"});
    }

    logoutHandler() {
        // logout() function calls sendClientToPage("logout") since it is called from
        // more places than this function, and they all need to send the above request to WebSocketServer
        logout();
        this.setState({ view: "login"} );
    }

    showGameHandler(){
        enterGame();
        move();
        this.setState({ view: "game"} );
    }

    render() {
        const view = this.state.view;

        switch (view) {
            case "login":
                return (
                    <center>
                        <LoginComponent onLogin={this.gotoLobbyHandler} onRegisterNew={this.registerNewHandler}/>
                        <br/>
                        <HighScoresComponent />
                    </center>
                );
                break;

            case "register":
                return (
                    <center>
                        <RegisterComponent onRegister={this.gotoLobbyHandler} onBack={this.logoutHandler}/>
                    </center>
                );
                break;

            case "lobby":
                return (
                    <div>
                        <BannerComponent    onProfileClick={this.gotoProfileHandler} 
                                            onLogout={this.logoutHandler} 
                                            onLobbyClick={this.gotoLobbyHandler}
                                            currentlyClicked="lobby"
                        />
                        <LobbyComponent onLogout={this.logoutHandler} startGame={this.showGameHandler}/>
                    </div>
                );
                break;

            case "game":
                return (
                    <div>
                        <BannerComponent    onProfileClick={this.gotoProfileHandler} 
                                            onLogout={this.logoutHandler} 
                                            onLobbyClick={this.gotoLobbyHandler}
                                            currentlyClicked={null}
                        />
                        <GameComponent />
                        <br/>
                       
                    </div>
                );
                break;  

            case "profile":
                return (
                    <div> 
                        <BannerComponent    onProfileClick={this.gotoProfileHandler} 
                                            onLogout={this.logoutHandler} 
                                            onLobbyClick={this.gotoLobbyHandler}
                                            currentlyClicked="profile"
                        />
                        <ProfileComponent />
                    </div>
                );
                break;
        }
    }
}


class BannerComponent extends React.Component {
    constructor(props){
        super(props)
        this.checkClicked = this.checkClicked.bind(this);
    }

    checkClicked(page) {
        return (page === this.props.currentlyClicked) ? "clicked-nav-button" : "nav-button";
    }

    render(props) {
        return (
            <div id="banner">
                <button className={this.checkClicked("profile")} onClick={this.props.onProfileClick}>My profile</button>
                <button className={this.checkClicked("lobby")} onClick={this.props.onLobbyClick}>Game lobby</button>
                <button className="nav-button" onClick={this.props.onLogout}>Logout</button>
            </div>
        );
    }
}

class HighScoresComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = { highscores: []};
        this.getHighScores = this.getHighScores.bind(this);
    }

    getHighScores(){
        var req = getHighScores();
        $.when (req).done((data) => {
            this.setState( {highscores: data["high-scores"]});
        });
    }

    render(props) {
        return(
            <div>
                <button className="button" onClick={this.getHighScores}>Show the latest top 10 scores:</button>
                <div id="highScores">
                    <HighScoresTable data={this.state.highscores} />
                </div>
            </div>
        );
    }
}


class HighScoresTable extends React.Component {
    constructor(props){
        super(props);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(row){
        return (
            <tr key={row.id}>
                <td>{row.user}</td>
                <td>{row.score}</td>
            </tr>
        );
    }

    render(props){
        var data = this.props.data;
        return (
            <table id="high-scores">
                <thead><tr><th> <center>Username</center> </th><th> <center>Score</center> </th></tr></thead>
                <tbody>
                    {data.map(row=> {
                        return this.renderRow(row);
                    })}
                </tbody>
            </table>
        );
    }
}

ReactDOM.render( <ControlComponent />, document.getElementById("root"));