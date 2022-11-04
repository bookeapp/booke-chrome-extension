const { h, render, Component } = preact; 

const Constants = {
  AUTH_DOMAIN: "https://auth0.stage.booke.ai",
  AUTH_CLIENT_ID: "ewePFque5rVhue9Xz5pQ81ryi35rY6ss",
  AUTH_AUDIENCE: "auth.stage.booke.ai",
  VIEWS: {
    MAIN: "main",
    DASHBOARD: "dashboard"
  }
};

const Utils = {
  log(...args) {
    console.log("%c%s", "color: #ff0", "[BOOKE]", ...args);
  } 
}

class Auth {
  constructor(domain, clientId, audience) {
    this.domain = domain;
    this.clientId = clientId;
    this.audience = audience;
  }
  
  async getClient() {
    if (!this.client) {
      this.client = await auth0.createAuth0Client({
        domain: this.domain,
        clientId: this.clientId,
        cacheLocation: "localstorage",
        authorizationParams: {
          audience: this.audience,
          redirect_uri: window.location.origin
        }
      });
    }
    
    return this.client;
  }
  
  async getAuthToken(callbackState) {
    try {
      const client = await this.getClient();

      const token = await client.getTokenSilently();
      
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload || !Array.isArray(payload.aud) || !payload.aud.includes(this.audience)) return null;      
      
      return token;
    } catch (error) {
      return null;
    }    
  }
}

const initialState = {
  view: Constants.VIEWS.MAIN
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;     
  switch (type) {
    default: 
      return state;
  }
};

class App extends Component {
  state = {};
  
  dispatch(action) {
    this.setState(reducer(this.state, action));
  }
  
  render() {
    return h("div", { id: "booke-extension" }, "Lorem");
  }
}

render(h(App), document.body);

// this.auth = new Auth(AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_AUDIENCE);    
    
// this.auth.getAuthToken().then((token) => {
//   Utils.log(token);
// });

// this.view.rootElement.addEventListener("click", (e) => {
//   this.auth.client.isAuthenticated().then((isAuthenticated) => {
//     console.log(isAuthenticated);
//     if (isAuthenticated) {
//       client.logout();
//     } else {
//       client.loginWithRedirect();            
//     }
//   });
  
//   // if (location.search.includes("state=") && 
//   //     (location.search.includes("code=") || 
//   //     location.search.includes("error="))) {
//   //   auth0Client.handleRedirectCallback().then(() => {          
//   //     console.log(">>> Replace seach params", location.search);
//   //     // window.history.replaceState({}, document.title, "/");
//   //   });
//   // }   
// });
