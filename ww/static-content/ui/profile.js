class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "" , hiscore: "", avatarSrc: "" };
        this.getUserAvatar = this.getUserAvatar.bind(this);
        this.getName = this.getName.bind(this);
        this.getUserHiScore = this.getUserHiScore.bind(this);
    }

    getUserAvatar(){
        var req = getUserAvatar();
        $.when(req).done((data) => {
            var avatarID = data["avatarID"];
            this.setState({avatarSrc: getAvatarSrc(avatarID)});
        });
    }

    getUserHiScore(){
        var req = getUserHighScore();
        $.when(req).done((data) => {
            window.alert(data);
            var hiscore = data["high-score"];
            if (hiscore) {
                this.setState({hiscore: data["high-score"]});
            }
            else {
                this.setState({hiscore: "You haven't played any games yet"});
            }
        });
        $.when(req).fail((xhr) => {
            this.setState({hiscore: "Could not retrieve high score"});
        });
    }

    getName(){
        var req = getNameOfUser();
        $.when(req).done((data) => {
            this.setState( { name: data["name"] });
        });
    }

    componentWillMount(){
        this.getName();
        this.getUserHiScore();
        this.getUserAvatar();
    }

    render(props){
        return(
            <div id="profile" className="not-banner">
                <h2>{currentUsername} <img src={this.state.avatarSrc} className="icon" /> </h2>
                <br/> <br/>
                Name: {this.state.name} <br/>
                High score: {this.state.hiscore} <br/>
            </div>
        );
    }
}

function getAvatarSrc(avatarID){
    switch(avatarID) {
        case "coolImg":
            return "icons/face-cool-24.png";
            break;
        case "arnold":
            return "icons/arnold.png";
            break;
        case "forklift":
            return "forklift.png";
            break;
    }
}