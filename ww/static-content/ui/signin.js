function validateLoginFields(username, password) {
    var passwordErr = "";
    var userErr = "";
    if (username.length === 0) {
        userErr = "Must enter username";
    }
    if (password.length === 0) {
        passwordErr = "Must enter password";
    }
    return {
        err: "",
        userErr: userErr,
        passErr: passwordErr
    };
}

function validateRegisterFields(username, password, name){
    var {err, userErr, passErr } = validateLoginFields(username, password);
    var nameErr = /^[a-z0-9\w]+$/i.test(name) ? "": "Name must be non-empty and alphanumeric";
    return {
        err: err,
        userErr: userErr,
        passErr: passErr,
        nameErr: nameErr
    }
}

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        var errors= {err: '', userErr: '', passErr: ''}
        this.state = {username: '', password: '',  errors: errors};
        this.loginSubmitHandler = this.loginSubmitHandler.bind(this);
        this.loginUserChange = this.loginUserChange.bind(this);
        this.loginPasswordChange = this.loginPasswordChange.bind(this);
    }

    loginSubmitHandler(e) {
        e.preventDefault(); //stops auto page refresh after form submit
        // Remember: names of variables within array MUST be same as names returned by whatever object I am assigning them to
        var errors = validateLoginFields(this.state.username, this.state.password);
        if (errors.err.length === 0 && errors.userErr.length === 0 && errors.passErr.length === 0) {
            // Back-end validation
            var req = login(this.state.username, this.state.password);

            $.when (req).fail((xhr) => {
                var result = JSON.parse(xhr.responseText);
                this.setState ({ errors: {
                    err: result.error? result.error : "",
                    userErr: result.userError? result.userError : "", 
                    passErr: result.passwordError? result.passwordError : "",
                    }
                });
            });

            $.when(req).done((data) => {
                this.props.onLogin();
            });
        } else { // Failed front-end validation
            this.setState({ errors: errors });
        }

    }

    loginUserChange(e) {
        this.setState({ username: e.target.value });
    }

    loginPasswordChange(e){
        this.setState({ password: e.target.value });
    }

    render(props){
        var userValidation = 'success';
        var passwordValidation = 'success';
        if (this.state.errors.userErr.length > 0) {
            userValidation = 'error';
        }
        if (this.state.errors.passErr.length > 0) {
            passwordValidation = 'error';
        }
        return (
            <div>
                <div className="home">
                    <h4>Login</h4>
                    <form onSubmit={this.loginSubmitHandler}>
                        <ReactBootstrap.FormGroup validationState={userValidation}>
                            <ReactBootstrap.FormControl 
                                type="text" 
                                placeholder="Enter username"
                                value={this.state.username}
                                onChange={this.loginUserChange}
                            />
                            <ReactBootstrap.HelpBlock><div className="error">{this.state.errors.userErr}</div></ReactBootstrap.HelpBlock>
                        </ReactBootstrap.FormGroup>

                        <ReactBootstrap.FormGroup validationState={passwordValidation}>
                            <ReactBootstrap.FormControl 
                                type="password" 
                                placeholder="Enter password"
                                value={this.state.password}
                                onChange={this.loginPasswordChange}
                            />
                            <ReactBootstrap.HelpBlock><div className="error">{this.state.errors.passErr}</div></ReactBootstrap.HelpBlock>
                        </ReactBootstrap.FormGroup>

                        <ReactBootstrap.Button type="submit">Login</ReactBootstrap.Button>
                    </form>
                    <br/>
                    <button className="secondary-button" onClick={this.props.onRegisterNew}> Register new user </button>
                </div>
            </div>
        );
    }
}


class RegisterComponent extends React.Component {
    constructor(props) {
        super(props);
        var errors= {err: '', userErr: '', passErr: '', nameErr: ''}
        this.state = {username: '', password: '',  name: '', errors: errors};
        this.registerSubmitHandler = this.registerSubmitHandler.bind(this);
        this.registerUserChange = this.registerUserChange.bind(this);
        this.registerPasswordChange = this.registerPasswordChange.bind(this);
        this.registerNameChange = this.registerNameChange.bind(this);
    }

    registerSubmitHandler(e){
        e.preventDefault(); //stops auto page refresh after form submit
        // Remember: names of variables within array MUST be same as names returned by whatever object I am assigning them to
        var errors = validateRegisterFields(this.state.username, this.state.password, this.state.name);
        if (errors.err.length === 0 
            && errors.userErr.length === 0 
            && errors.passErr.length === 0
            && errors.nameErr.length === 0) {
            // Back-end validation
            var req = register(this.state.username, this.state.password, this.state.name);

            $.when (req).fail((xhr) => {
                var result = JSON.parse(xhr.responseText);
                this.setState ({ errors: {
                    // userError and passwordError are the only ones possible from backend
                    err: "",
                    userErr: result.userError? result.userError : "", 
                    passErr: result.passwordError? result.passwordError : "",
                    nameErr: ""
                    }
                });
            });

            $.when(req).done((data) => {
                this.props.onRegister();
            });
        } else { // Failed front-end validation
            this.setState({ errors: errors });
        }

    }

    registerUserChange(e) {
        this.setState({ username: e.target.value });
    }

    registerPasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    registerNameChange(e) {
        this.setState({ name: e.target.value });
    }

    render(props){
        var userValidation = 'success';
        var passwordValidation = 'success';
        var nameValidation = 'success';
        if (this.state.errors.userErr.length > 0) {
            userValidation = 'error';
        }
        if (this.state.errors.passErr.length > 0) {
            passwordValidation = 'error';
        }
        if (this.state.errors.nameErr.length > 0) {
            nameValidation = 'error';
        }

        return (
            <div className="home">
                <h4> Register </h4>
                <form onSubmit={this.registerSubmitHandler}>
                    <ReactBootstrap.FormGroup validationState={userValidation}>
                        <ReactBootstrap.FormControl 
                            type="text" 
                            placeholder="Enter username"
                            value={this.state.username}
                            onChange={this.registerUserChange}
                        />
                        <ReactBootstrap.HelpBlock><div className="error">{this.state.errors.userErr}</div></ReactBootstrap.HelpBlock>
                    </ReactBootstrap.FormGroup>

                    <ReactBootstrap.FormGroup validationState={passwordValidation}>
                        <ReactBootstrap.FormControl 
                            type="password" 
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.registerPasswordChange}
                        />
                        <ReactBootstrap.HelpBlock><div className="error">{this.state.errors.passErr}</div></ReactBootstrap.HelpBlock>
                    </ReactBootstrap.FormGroup>

                    <ReactBootstrap.FormGroup validationState={nameValidation}>
                        <ReactBootstrap.FormControl 
                            type="text" 
                            placeholder="Enter full name"
                            value={this.state.name}
                            onChange={this.registerNameChange}
                        />
                        <ReactBootstrap.HelpBlock><div className="error">{this.state.errors.nameErr}</div></ReactBootstrap.HelpBlock>
                    </ReactBootstrap.FormGroup>

                    <ReactBootstrap.Button type="submit">Register</ReactBootstrap.Button>
                </form>
                <br/>
                <button className="secondary-button" onClick={this.props.onBack}>Back to login</button>
            </div>
        );
    }
}