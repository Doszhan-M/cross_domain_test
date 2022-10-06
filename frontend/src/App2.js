import React from "react";


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      csrf: "",
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
      sessionId: '',
    };
  }

  componentDidMount = () => {
    this.getSession();
  }

  getCSRF = () => {
    fetch("/api/test/csrf/", {
      credentials: "same-origin",
    })
    .then((res) => {
      let csrfToken = res.headers.get("X-CSRFToken");
      this.setState({csrf: csrfToken});
      console.log(csrfToken);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getSession = () => {
    fetch("/api/test/session/", {
      // credentials: "same-origin",
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isAuthenticated) {
        this.setState({isAuthenticated: true});
        this.getCSRF();
      } else {
        this.setState({isAuthenticated: false});
        this.getCSRF();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  whoami = () => {
    fetch("/api/test/whoami/", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("You are logged in as: " + data.username);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  login = (event) => {
    event.preventDefault();
    fetch("/api/test/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({username: this.state.username, password: this.state.password}),
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: true, username: "", password: "", error: ""});
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: "Wrong username or password."});
    });
  }

  testPost = () => {
    
    fetch("/api/test/test_post/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  logout = () => {
    fetch("/api/test/logout", {
      credentials: "same-origin",
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
      this.getCSRF();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  
  sessionId = () => {
    fetch("/api/web/accounts/session_id/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        sessionId: [data.session_id],
        csrf: data.csrftoken
      })
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
              <div>
                {this.state.error &&
                  <small className="text-danger">
                    {this.state.error}
                  </small>
                }
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <br></br>
          {/* <a href="https://id.uchet.kz/.idp/oauth2/auth?client_id=pk2-test&redirect_uri=https://pk-local.backend/api/web/accounts/sso_token/&response_type=code&state=https://pk-local.backend">Login via SSO</a> */}
          <a href="https://id.uchet.kz/.idp/oauth2/auth?client_id=pk2-test&redirect_uri=https://pk-local.backend/api/web/accounts/sso_token/&response_type=code&state=https://localhost">Login via SSO</a>
          {/* <a href="https://id.uchet.kz/.idp/oauth2/auth?client_id=pk2-test&redirect_uri=https://test-pk.uchet.kz/api/web/accounts/sso_token/&response_type=code&state=https://pk-local.backend">Login via SSO</a> */}
        </div>
      );
    }
    return (
      <div className="container mt-3">
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button>
        <button className="btn btn-danger" onClick={this.logout}>Log out</button>
        <br></br>
        <br></br>
        <a href="https://id.uchet.kz/.idp/oauth2/sessions/logout" className="btn btn-primary">Logout via SSO</a>
        <br></br>
        <br></br>
        <button className="btn btn-primary mr-2" onClick={this.testPost}>Test Post</button>
        <br></br>
        <br></br>
        <button className="btn btn-primary mr-2" onClick={this.sessionId}>Session Id</button>
        <br></br>
        <br></br>
        <div>
          <p>session id: <span>{this.state.sessionId}</span></p>
          <p>csrf: <span></span>{this.state.csrf}</p>
        </div>
      </div>
    )
  }
}

export default App;
