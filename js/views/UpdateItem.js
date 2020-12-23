import Api from "../Api.js";

class UpdateItem {
  el;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#update-item");
  }

  show = () => {
    this.el.classList.add("show");
  };

  hide = () => {
    this.el.classList.remove("show");
  };
}

export default UpdateItem;
