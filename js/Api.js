import { API_URL, TOKEN_NAME } from "./config.js";

class Api {
  items;
  token = localStorage.getItem(TOKEN_NAME);
  user;

  request = async ({ method, payload, url, useAuth = true }) => {
    let body;
    let headers = {};

    if (useAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (method === "PATCH" || method === "POST") {
      headers["Content-Type"] = "application/json";
    }

    if (payload) {
      body = JSON.stringify(payload);
    }

    const response = await fetch(`${API_URL}${url}`, {
      body,
      headers,
      method,
    });

    if (method !== "DELETE") {
      return await response.json();
    }
  };

  isSignedIn = () => {
    return this.token !== null;
  };

  getToken = () => {
    return this.token;
  };

  removeToken = () => {
    localStorage.removeItem(TOKEN_NAME);
    this.token = null;
  };

  setToken = (token) => {
    localStorage.setItem(TOKEN_NAME, token);
    this.token = token;
  };

  getUser = async () => {
    if (this.user) {
      return this.user;
    } else {
      const { data, error } = await this.request({
        method: "GET",
        url: "/users/me",
      });

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
    const { data, error } = await this.request({
      method: "POST",
      payload,
      url: "/auth/authenticate",
      useAuth: false,
    });

    if (data) {
      this.setToken(data.token);
      this.setUser(data.user);
    }

    return { error, success: !error };
  };

  signOut = async () => {
    await this.request({
      method: "POST",
      url: "/auth/logout",
      useAuth: false,
    });
    this.removeToken();
    this.setUser(null);

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
      const response = await this.request({
        method: "GET",
        url: `/items/items`,
      });
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
    const { data, error } = await this.request({
      method: "POST",
      payload,
      url: `/items/items`,
    });

    if (data) {
      this.addItem(data);
    }

    return {
      item: data,
      error,
    };
  };

  deleteItem = async (payload) => {
    await this.request({
      method: "DELETE",
      url: `/items/items/${payload}`,
    });

    return {
      success: true,
    };
  };

  updateItem = async (id, payload) => {
    const { data, error } = await this.request({
      method: "PATCH",
      payload,
      url: `/items/items/${id}`,
    });

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

export default new Api();
