import Store from "../Store.js";
import { EVENTS, ROUTES } from "../constants.js";
import { dispatch } from "../utils.js";

class SignIn {
  el;
  elForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#sign-in");
  }

  show = () => {
    this.elForm = this.el.querySelector("#sign-in-form");
    this.elForm.addEventListener("submit", this.onSignIn);

    this.el.classList.add("show");
  };

  hide = () => {
    if (this.elForm) {
      this.elForm.removeEventListener("submit", this.onSignIn);
    }

    this.el.classList.remove("show");
  };

  onSignIn = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const credentials = {
      email: this.elForm.querySelector("[name=email]").value,
      password: this.elForm.querySelector("[name=password]").value,
    };

    const { error, success } = await Store.signIn(credentials);

    this.el.classList.remove("show");
    dispatch(EVENTS.SHOW_LOADING, false);

    if (success === true) {
      dispatch(EVENTS.ROUTE_CHANGE, {
        route: ROUTES.HOME,
      });
    } else {
      this.el.classList.add("show");
      const elError = this.signInForm.querySelector("#error-message");
      elError.innerHTML = error.message;
    }
  };
}

export default SignIn;
