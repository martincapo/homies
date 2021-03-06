import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import NavBar from './components/NavBar.jsx';
import Loginscreen from './components/Loginscreen.jsx'
import Cookies from 'universal-cookie';
import axios from 'axios'
import history from './index.jsx';

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      userToken:[],
      hasToken: '',
      user_id: ''
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(payload){
    const cookies = new Cookies();
    var apiBaseUrl = "http://localhost:3001/authenticate";
    var that = this;
    axios.post(apiBaseUrl, payload)
    .then(function (response) {
      console.log("this is the response", response);
      if(response.status == 200){
        console.log("Login successfull");
        cookies.set('token', response.data.auth_token, { path: '/' });
        that.setState({user_id: response.data.auth_token})
        console.log(">>>>", that.state.user_id)
        history.push('/circles')
        }
      })
        .catch(function (error) {
        console.log(error);
        alert("Email and password do not match")
        });
        }

  componentWillMount(){

    const cookies = new Cookies();
    
    let token = cookies.get("token")
    this.state.hasToken = token

    // if(this.state.hasToken){
    //   history.push('/discovery')
    // }
    
    var loginPage =[];
    loginPage.push(<Loginscreen handleLogin={this.handleLogin} parentContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }



  AuthenicationChecker(authToken) {
    this.setState({userToken: authToken})
  }

  // this is passing down a function to the children component to grab the authenticaiton token


  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        user_id: this.state.user_id,
        handleLogin: this.handleLogin
      })
     );

     // this part sends the authentication token to all the other coponenets which are
     // children of app

     return <div>{childrenWithProps}</div>
    return (
      <div className="App">
        <div className="page-container">
          <div className="col-sm-12">
            {childrenWithProps}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
