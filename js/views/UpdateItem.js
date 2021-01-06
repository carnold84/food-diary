import Store from "../Store.js";
import { EVENTS, VIEWS } from "../constants.js";
import { dispatch } from "../utils.js";

class UpdateItem {
  currentItem = null;
  datePicker;
  el;
  elCancelBtn;
  elDate;
  elForm;
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#update-item");
    this.elCancelBtn = this.el.querySelector("#cancel-btn");
    this.elDate = this.el.querySelector(".date-picker");
    this.datePicker = flatpickr(this.elDate, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      wrap: true,
    });
  }

  show = (params = {}) => {
    this.el.classList.add("show");

    if (params.id) {
      this.currentItem = Store.getItem(params.id);
      console.log(this.currentItem);
      this.el.querySelector("[name=name]").value = this.currentItem.name;
      this.datePicker.setDate(parseInt(this.currentItem.date));
    } else {
      this.datePicker.setDate(Date.now());
    }

    this.elCancelBtn.addEventListener("click", this.onCancel);
    this.el.addEventListener("submit", this.onUpdateItem);
  };

  hide = () => {
    if (this.el) {
      this.el.removeEventListener("submit", this.onUpdateItem);
    }

    this.currentItem = null;
    this.el.querySelector("[name=name]").value = "";
    this.datePicker.setDate(Date.now());

    this.el.classList.remove("show");
  };

  onCancel = (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.TOGGLE_VIEW, { view: VIEWS.UPDATE_ITEM, show: false });
  };

  onUpdateItem = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const payload = {
      date: new Date(this.datePicker.selectedDates[0]).valueOf(),
      name: this.el.querySelector("[name=name]").value,
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
