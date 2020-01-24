class GameComponent extends React.Component{
    constructor(props){
        super(props);
    }


    render(props) {
        return(
            <div id="game">
                <StageComponent className="not-banner"/>
                <table id="legend" className="not-banner"><tbody>
                    <tr>
                        <td><img className="icon" src="../icons/blank.gif" id="blankImage" size = "10"/></td>
                        <td>Empty Square</td>
                    </tr>
                    <tr>
                        <td><img className="icon" src="../icons/emblem-package-2-24.png" id="boxImage" size = "10"/></td>
                        <td>Box</td>
                    </tr>
                    <tr>
                        <td><img className="icon" src="../icons/face-cool-24.png" id="playerImage" size="10"/></td>
                        <td>Player</td>
                    </tr>
                    <tr>
                        <td><img className="icon" src="../icons/face-devil-grin-24.png" id="monsterImage" size="10"/></td>
                        <td>Monster</td>
                    </tr>
                    <tr>
                        <td><img className="icon" src="../icons/wall.jpeg" id="wallImage" size="10"/></td>
                        <td>Wall</td>
                    </tr>
                    <tr>
                        <td><img className="icon" src="../icons/Slimy-Blue-Monster.png" id="smarty" size="10"/></td>
                        <td>Transporting monster</td>
                    </tr>
                    </tbody>
                </table>
                <div id="HS" className= "score-board"> Hello </div>
                <div id="lossMsg"></div>
            </div>
        );
    }
}

class StageComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = { stage: "" };
    }

    render(props) {
        return (
            <center><div id="stage" className="not-banner">
                {this.state.stage}
            </div></center>
        );
    }

}