import Api from "../Api.js";
import { EVENTS, ROUTES } from "../constants.js";
import { dispatch } from "../utils.js";

class SignIn {
  el;
  elSignInForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#sign-in");
  }

  show = () => {
    this.elSignInForm = this.el.querySelector("#sign-in-form");
    this.elSignInForm.addEventListener("submit", this.onSignIn);

    this.el.classList.add("show");
  };

  hide = () => {
    if (this.elSignInForm) {
      this.elSignInForm.removeEventListener("submit", this.onSignIn);
    }

    this.el.classList.remove("show");
  };

  onSignIn = async (evt) => {
    console.log(evt);
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const credentials = {
      email: this.elSignInForm.querySelector("[name=email]").value,
      password: this.elSignInForm.querySelector("[name=password]").value,
    };

    const { error, success } = await Api.signIn(credentials);

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
