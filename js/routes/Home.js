import Api from "../Api.js";
import { EVENTS } from "../constants.js";
import { dispatch } from "../utils.js";

class Home {
  el;
  elList;
  elMessage;
  isLoading = false;

  constructor() {
    console.log("loadItems");
    this.el = document.querySelector("#home");
    this.elList = this.el.querySelector(".list");
    this.elMessage = this.el.querySelector(".message");
  }

  show = () => {
    this.el.classList.add("show");

    this.loadItems();
  };

  hide = () => {
    this.el.classList.remove("show");
    this.elList.classList.remove("show");
  };

  loadItems = async () => {
    console.log("loadItems");
    dispatch(EVENTS.SHOW_LOADING, true);

    const { data, error } = await Api.getItems();

    dispatch(EVENTS.SHOW_LOADING, false);

    if (error) {
      console.error(error);
    }

    if (data) {
      if (data.length > 0) {
        data.forEach((element) => {
          const item = document.createElement("li");
          item.innerHTML = element.name;
          this.elList.appendChild(item);
        });
        this.elList.classList.add("show");
        this.elMessage.classList.remove("show");
      } else {
        this.elList.classList.remove("show");
        this.elMessage.classList.add("show");
      }
    }

    console.log(data);
  };
}

export default Home;
