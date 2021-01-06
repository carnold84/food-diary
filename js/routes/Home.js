import Store from "../Store.js";
import Item from "../components/Item.js";
import { EVENTS, ROUTES, VIEWS } from "../constants.js";
import { dispatch } from "../utils.js";

class Home {
  el;
  elAddItemBtn;
  elList;
  elMessage;
  elSignOutBtn;
  items = {
    all: [],
    byId: {},
  };
  isLoading = false;

  constructor() {
    this.el = document.querySelector("#home");
    this.elList = this.el.querySelector(".list");
    this.elMessage = this.el.querySelector(".message");

    window.addEventListener(EVENTS.ADD_ITEM, this.onAddItem);
    window.addEventListener(EVENTS.DELETE_ITEM, this.onDeleteItem);
    window.addEventListener(EVENTS.UPDATE_ITEM, this.onUpdateItem);
  }

  show = () => {
    this.el.classList.add("show");

    this.elAddItemBtn = document.querySelector("#add-item-btn");
    this.elAddItemBtn.addEventListener("click", this.onShowUpdateItemView);

    this.elSignOutBtn = document.querySelector("#sign-out-btn");
    this.elSignOutBtn.addEventListener("click", this.onSignOut);

    this.loadItems();
  };

  hide = () => {
    this.elAddItemBtn?.removeEventListener("click", this.onAddItem);
    this.elSignOutBtn?.removeEventListener("click", this.onSignOut);

    this.el.classList.remove("show");
    this.elList.classList.remove("show");
    this.elMessage.classList.remove("show");
  };

  onShowUpdateItemView = (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.TOGGLE_VIEW, {
      show: true,
      view: VIEWS.UPDATE_ITEM,
    });
  };

  onSignOut = async (evt) => {
    evt.preventDefault();

    dispatch(EVENTS.SHOW_LOADING, true);

    const { success } = await Store.signOut();

    dispatch(EVENTS.SHOW_LOADING, false);

    if (success === true) {
      dispatch(EVENTS.ROUTE_CHANGE, {
        route: ROUTES.SIGN_IN,
      });
    }
  };

  onAddItem = async ({ detail: { payload, onComplete } }) => {
    let { error, item } = await Store.createItem(payload);

    if (onComplete) {
      onComplete({ success: !error });
    }

    if (item) {
      this.renderItem(item);
    }
  };

  onUpdateItem = async ({ detail: { id, payload, onComplete } }) => {
    let { error, item } = await Store.updateItem(id, payload);

    if (onComplete) {
      onComplete({ success: !error });
    }

    if (item) {
      this.updateItem(item);
    }
  };

  onDeleteItem = async ({ detail: { id } }) => {
    dispatch(EVENTS.SHOW_LOADING, true);

    const { success } = await Store.deleteItem(id);

    if (success) {
      const item = this.items.byId[id];

      this.elList.removeChild(item.el);

      this.items.all.filter((item) => {
        return item.id !== id;
      });

      delete this.items.byId[id];

      if (this.items.all.length === 0) {
        this.showList(false);
      }
    }

    dispatch(EVENTS.SHOW_LOADING, false);
  };

  showList = (show) => {
    if (show) {
      this.elList.classList.add("show");
      this.elMessage.classList.remove("show");
    } else {
      this.elList.classList.remove("show");
      this.elMessage.classList.add("show");
    }
  };

  loadItems = async () => {
    dispatch(EVENTS.SHOW_LOADING, true);

    const { data, error } = await Store.getItems();

    dispatch(EVENTS.SHOW_LOADING, false);

    if (error) {
      console.error(error);
    }

    this.renderItems(data);
  };

  renderItems = (data) => {
    if (data?.length > 0) {
      this.showList(true);
      data.forEach((item) => {
        this.renderItem(item);
      });
    } else {
      this.showList(false);
    }
  };

  renderItem = ({ date, id, name }) => {
    this.showList(true);

    const item = new Item({
      date,
      id,
      name,
    });

    this.items.all.push(item);
    this.items.byId[item.id] = item;

    this.elList.appendChild(item.el);

    return item;
  };

  updateItem = ({ date, id, name }) => {
    const item = this.items.byId[id];

    item.update({ date, name });
  };
}

export default Home;
