import { API_URL, TOKEN_NAME } from "./config.js";

class Api {
  items;
  token = localStorage.getItem(TOKEN_NAME);
  user;

  get = async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      method: "GET",
    });

    return await response.json();
  };

  post = async (url, payload, withAuth = true) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (withAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      body: JSON.stringify(payload),
      headers,
      method: "POST",
    });

    return await response.json();
  };

  patch = async (url, payload) => {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_URL}${url}`, {
      body: JSON.stringify(payload),
      headers,
      method: "PATCH",
    });

    return await response.json();
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

  getUser = () => {
    return this.user;
  };

  setUser = (user) => {
    this.user = user;
  };

  signIn = async (payload) => {
    const { data, error } = await this.post(
      "/auth/authenticate",
      payload,
      false
    );

    if (data) {
      this.setToken(data.token);
      this.setUser(data.user);
    }

    return { error, success: !error };
  };

  signOut = async () => {
    await this.post("/auth/logout", false);
    this.removeToken();
    this.setUser(null);

    return { success: true };
  };

  getItems = async () => {
    // cached so return existing
    if (this.items) {
      return this.items.all;
    } else {
      const response = await this.get("/items/items");
      let data;

      if (response.data) {
        this.items = {
          all: [],
          byId: {},
        };

        response.data.forEach((element) => {
          this.items.all.push(element);
          this.items.byId[element.id] = element;
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
    const { data, error } = await this.post("/items/items", payload);

    if (data) {
      this.items.all.push(data);
      this.items.byId[data.id] = data;
    }

    return {
      success: !error,
      error,
    };
  };

  updateItem = async (id, payload) => {
    const { data, error } = await this.patch(`/items/items/${id}`, payload);

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
      data,
      error,
    };
  };
}

export default new Api();
