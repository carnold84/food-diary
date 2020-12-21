import Api from "../Api.js";

class Home {
  el;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#home");
  }

  show = () => {
    this.el.classList.add("show");
  };

  hide = () => {
    this.el.classList.remove("show");
  };
}

export default Home;
