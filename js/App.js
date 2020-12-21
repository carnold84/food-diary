import Home from "./views/Home.js";
import SignIn from "./views/SignIn.js";
import { EVENTS, ROUTES } from "./constants.js";
import Loading from "./components/Loading.js";

class App {
  home;
  loading;
  signIn;
  state = {
    token: localStorage.getItem("food-diary"),
    user: null,
  };

  constructor() {
    window.addEventListener(EVENTS.LOAD, this.onLoad);
    window.addEventListener(EVENTS.ROUTE_CHANGE, this.onRouteChange);
    window.addEventListener(EVENTS.SHOW_LOADING, this.onShowLoading);
  }

  onLoad = () => {
    this.loading = new Loading();
    this.home = new Home();
    this.signIn = new SignIn();

    if (this.state.token) {
      this.setView(ROUTES.HOME);
    } else {
      this.setView(ROUTES.SIGN_IN);
    }
  };

  onRouteChange = ({ detail }) => {
    console.log(detail);
    this.setView(detail.route, detail.data);
  };

  onShowLoading = ({ detail }) => {
    if (detail === true) {
      this.loading.show();
    } else {
      this.loading.hide();
    }
  };

  setState = (nextState) => {
    state = {
      ...this.state,
      ...nextState,
    };
  };

  setView = (view) => {
    if (view !== ROUTES.SIGN_IN) {
      this.signIn.hide();
    }

    if (view === ROUTES.SIGN_IN) {
      this.signIn.show();
    }

    if (view === ROUTES.HOME) {
      this.home.show();
    }
  };
}

new App();
