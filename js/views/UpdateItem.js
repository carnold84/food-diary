import Api from "../Api.js";
import { EVENTS, VIEWS } from "../constants.js";
import { dispatch } from "../utils.js";

class UpdateItem {
  currentItem = null;
  el;
  elCancelBtn;
  elForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#update-item");
    this.elForm = this.el.querySelector("#update-item-form");
    this.elCancelBtn = this.el.querySelector("#cancel-btn");
  }

  show = (params = {}) => {
    this.el.classList.add("show");
    console.log(params);

    if (params.id) {
      this.currentItem = Api.getItem(params.id);
      this.elForm.querySelector("[name=name]").value = this.currentItem.name;
      this.elForm.querySelector("[name=date]").value = this.currentItem.date;
    }

    this.elCancelBtn.addEventListener("click", this.onCancel);
    this.elForm.addEventListener("submit", this.onUpdateItem);
  };

  hide = () => {
    if (this.elForm) {
      this.elForm.removeEventListener("submit", this.onUpdateItem);
    }

    this.currentItem = null;

    this.el.classList.remove("show");
  };

  onCancel = () => {
    dispatch(EVENTS.TOGGLE_VIEW, { view: VIEWS.UPDATE_ITEM, show: false });
  };

  onUpdateItem = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const payload = {
      date: this.elForm.querySelector("[name=date]").value,
      name: this.elForm.querySelector("[name=name]").value,
    };

    if (this.currentItem) {
      dispatch(EVENTS.UPDATE_ITEM, {
        id: this.currentItem.id,
        payload,
        onComplete: this.onItemUpdated,
      });
    } else {
      dispatch(EVENTS.ADD_ITEM, { payload, onComplete: this.onItemUpdated });
    }
  };

  onItemUpdated = ({ success }) => {
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
