import Api from "./Api.js";
import Home from "./routes/Home.js";
import SignIn from "./routes/SignIn.js";
import UpdateItem from "./views/UpdateItem.js";
import { EVENTS, ROUTES, VIEWS } from "./constants.js";
import Loading from "./components/Loading.js";
import { dispatch } from "./utils.js";

class App {
  elAddItemBtn;
  loading = new Loading();
  home = new Home();
  signIn = new SignIn();
  updateItem = new UpdateItem();

  start = () => {
    console.log("start");
    window.addEventListener(EVENTS.LOAD, this.onLoad);
    window.addEventListener(EVENTS.ROUTE_CHANGE, this.onRouteChange);
    window.addEventListener(EVENTS.SHOW_LOADING, this.onShowLoading);
    window.addEventListener(EVENTS.VIEW_CHANGE, this.onViewChange);

    this.elAddItemBtn = document.querySelector("#add-item-btn");
    this.elAddItemBtn.addEventListener("click", this.onAddItem);

    this.elSignOutBtn = document.querySelector("#sign-out-btn");
    this.elSignOutBtn.addEventListener("click", this.onSignOut);

    dispatch(EVENTS.ROUTE_CHANGE, {
      route: Api.isSignedIn() ? ROUTES.HOME : ROUTES.SIGN_IN,
    });
  };

  onAddItem = (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.VIEW_CHANGE, {
      view: VIEWS.UPDATE_ITEM,
    });
  };

  onSignOut = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const { success } = await Api.signOut();

    console.log(success);

    dispatch(EVENTS.SHOW_LOADING, false);

    if (success === true) {
      dispatch(EVENTS.ROUTE_CHANGE, {
        route: ROUTES.SIGN_IN,
      });
    }
  };

  onRouteChange = ({ detail: { params, route } }) => {
    console.log("onRouteChange:", params, route);
    this.setRoute({ params, route });
  };

  onViewChange = ({ detail: { params, view } }) => {
    console.log("onViewChange:", params, view);
    this.setView({ params, view });
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

  setView = ({ params, view }) => {
    if (view === VIEWS.UPDATE_ITEM) {
      this.updateItem.show(params);
    }
  };
}

export default App;
