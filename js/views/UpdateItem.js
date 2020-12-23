import Api from "../Api.js";
import { EVENTS, VIEWS } from "../constants.js";
import { dispatch } from "../utils.js";

class UpdateItem {
  currentItem = null;
  el;
  elForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#update-item");
    this.elForm = this.el.querySelector("#update-item-form");
  }

  show = (params = {}) => {
    this.el.classList.add("show");

    this.currentItem = params.item;

    this.elForm.addEventListener("submit", this.onUpdateItem);
  };

  hide = () => {
    if (this.elForm) {
      this.elForm.removeEventListener("submit", this.onUpdateItem);
    }

    this.currentItem = null;

    this.el.classList.remove("show");
  };

  onUpdateItem = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const payload = {
      date: this.elForm.querySelector("[name=date]").value,
      name: this.elForm.querySelector("[name=name]").value,
    };

    let response;

    if (this.currentItem) {
      response = await Api.updateItem(this.currentItem.id, payload);
    } else {
      response = await Api.createItem(payload);
    }

    console.log(response);

    const { error, success } = response;

    dispatch(EVENTS.SHOW_LOADING, false);

    if (success === true) {
      dispatch(EVENTS.TOGGLE_VIEW, {
        show: false,
        view: VIEWS.UPDATE_ITEM,
      });
    } else {
      console.error(error);
    }
  };
}

export default UpdateItem;
