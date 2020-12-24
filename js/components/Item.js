import { EVENTS, VIEWS } from "../constants.js";
import { dispatch } from "../utils.js";

class Item {
  date;
  el;
  elDeleteBtn;
  elEditBtn;
  elTemplate;
  elTitle;
  id;
  name;

  constructor({ date, id, name }) {
    this.date = date;
    this.id = id;
    this.name = name;

    this.elTemplate = document.querySelector("#template-item");
    const elFragment = this.elTemplate.content.cloneNode(true);
    this.el = elFragment.querySelector(".item");
    this.elDeleteBtn = this.el.querySelector(".item-delete-btn");
    this.elEditBtn = this.el.querySelector(".item-edit-btn");
    this.elTitle = this.el.querySelector(".item-title");

    this.elTitle.innerHTML = this.name;
    this.elDeleteBtn.addEventListener("click", this.onDelete);
    this.elEditBtn.addEventListener("click", this.onEdit);
  }

  onDelete = () => {
    dispatch(EVENTS.DELETE_ITEM, { id: this.id });
  };

  onEdit = () => {
    dispatch(EVENTS.TOGGLE_VIEW, {
      params: { id: this.id },
      show: true,
      view: VIEWS.UPDATE_ITEM,
    });
  };

  update = ({ date, name }) => {
    this.date = date;
    this.name = name;

    this.elTitle.innerHTML = name;
  };
}

export default Item;
