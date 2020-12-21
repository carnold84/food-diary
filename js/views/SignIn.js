import Api from "../Api.js";
import { EVENTS, ROUTES } from "../constants.js";
import { dispatch } from "../utils.js";

class SignIn {
  el;
  signInForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#sign-in");
  }

  show = () => {
    this.signInForm = this.el.querySelector("#sign-in-form");
    this.signInForm.addEventListener("submit", this.onSignIn);

    this.el.classList.add("show");
  };

  hide = () => {
    if (this.signInForm) {
      this.signInForm.removeEventListener("submit", this.onSignIn);
    }

    this.el.classList.remove("show");
  };

  onSignIn = async (evt) => {
    console.log(evt);
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const credentials = {
      email: this.signInForm.querySelector("[name=email]").value,
      password: this.signInForm.querySelector("[name=password]").value,
    };

    const { data, error } = await Api.signIn(credentials);

    this.el.classList.remove("show");
    dispatch(EVENTS.SHOW_LOADING, false);

    if (error) {
      this.el.classList.add("show");
      const elError = this.signInForm.querySelector("#error-message");
      elError.innerHTML = error.message;
    } else {
      localStorage.setItem("food-diary", data.token);
      dispatch(EVENTS.ROUTE_CHANGE, {
        data: {
          token: data.token,
        },
        route: ROUTES.HOME,
      });
    }
  };
}

export default SignIn;
