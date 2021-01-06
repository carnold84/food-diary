import Api from "./Api.js";

class Store {
  items;
  token;
  user;

  isSignedIn = () => {
    return Api.token !== null;
  };

  getUser = async () => {
    if (this.user) {
      return this.user;
    } else {
      const { data, error } = await Api.getUser();

      if (data) {
        this.setUser(data);
      }

      return {
        success: !error,
        error,
      };
    }
  };

  setUser = (user) => {
    this.user = user;
  };

  signIn = async (payload) => {
    const { error } = await Api.signIn(payload);

    return { error, success: !error };
  };

  signOut = async () => {
    await Api.signOut();

    return { success: true };
  };

  addItem = (data) => {
    this.items.all.push(data);
    this.items.byId[data.id] = data;
  };

  getItem = (id) => {
    return this.items.byId[id];
  };

  getItems = async () => {
    // cached so return existing
    if (this.items) {
      return this.items.all;
    } else {
      const response = await Api.getItems();
      let data;

      if (response.data) {
        this.items = {
          all: [],
          byId: {},
        };

        response.data.forEach((element) => {
          this.addItem(element);
        });

        data = this.items.all;
      }

      return {
        data,
        error: response.error,
      };
    }
  };

  createItem = async (payload) => {
    const { data, error } = await Api.createItem(payload);

    if (data) {
      this.addItem(data);
    }

    return {
      item: data,
      error,
    };
  };

  deleteItem = async (payload) => {
    await Api.deleteItem(payload);

    return {
      success: true,
    };
  };

  updateItem = async (id, payload) => {
    const { data, error } = await Api.updateItem(id, payload);

    if (data) {
      this.items.all = this.items.all.map((element) => {
        if (element.id === data.id) {
          return data;
        } else {
          return element;
        }
      });
      this.items.byId[data.id] = data;
    }

    return {
      item: data,
      error,
    };
  };
}

export default new Store();
