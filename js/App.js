import Store from "./Store.js";
import Home from "./routes/Home.js";
import SignIn from "./routes/SignIn.js";
import UpdateItem from "./views/UpdateItem.js";
import { EVENTS, ROUTES, VIEWS } from "./constants.js";
import Loading from "./components/Loading.js";
import { dispatch } from "./utils.js";

class App {
  loading = new Loading();
  home = new Home();
  signIn = new SignIn();
  updateItem = new UpdateItem();

  start = async () => {
    window.addEventListener(EVENTS.LOAD, this.onLoad);
    window.addEventListener(EVENTS.ROUTE_CHANGE, this.onRouteChange);
    window.addEventListener(EVENTS.SHOW_LOADING, this.onShowLoading);
    window.addEventListener(EVENTS.TOGGLE_VIEW, this.onViewChange);

    const { success } = await Store.getUser();
    let route = ROUTES.SIGN_IN;

    if (success) {
      route = ROUTES.HOME;
    }

    dispatch(EVENTS.ROUTE_CHANGE, { route });
  };

  onRouteChange = ({ detail: { params, route } }) => {
    this.setRoute({ params, route });
  };

  onViewChange = ({ detail: { params, show, view } }) => {
    this.setView({ params, show, view });
  };

  onShowLoading = ({ detail }) => {
    if (detail === true) {
      this.loading.show();
    } else {
      this.loading.hide();
    }
  };

  setRoute = ({ params, route }) => {
    if (route === ROUTES.SIGN_IN) {
      this.signIn.show(params);
    } else {
      this.signIn.hide();
    }

    if (route === ROUTES.HOME) {
      this.home.show(params);
    } else {
      this.home.hide();
    }
  };

  setView = ({ params, show, view }) => {
    if (view === VIEWS.UPDATE_ITEM) {
      if (show) {
        this.updateItem.show(params);
      } else {
        this.updateItem.hide();
      }
    }
  };
}

export default App;
