import { API_URL, TOKEN_NAME } from "./config.js";

class Api {
  axios;
  MODE = "cookie";

  constructor() {
    console.log(API_URL);
    this.axios = axios.create({
      baseURL: API_URL,
    });
  }

  get token() {
    return this.axios.defaults.headers?.Authorization?.split(" ")[1] || null;
  }

  set token(val) {
    this.axios.defaults.headers = {
      ...(this.axios.defaults.headers || {}),
      Authorization: val ? `Bearer ${val}` : undefined,
    };
  }

  async signIn(credentials) {
    try {
      const response = await this.axios.post("/auth/authenticate", {
        ...credentials,
        mode: this.MODE,
      });

      console.log(response);

      this.token = response.data.data.access_token;

      setTimeout(() => {
        this.refresh();
      }, response.data.data.expires - 10000);

      return response.data;
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }

  async refresh() {
    console.log("refresh");
    const payload = { mode: this.MODE };

    const response = await this.axios.post("/auth/refresh", payload);

    this.token = response.data.data.access_token;

    setTimeout(() => {
      this.refresh();
    }, response.data.data.expires - 10000);

    return response.data;
  }

  async logout() {
    await this.axios.post("/auth/logout");
    this.token = null;
  }

  isSignedIn = () => {
    return this.token !== null;
  };

  getUser = async () => {
    try {
      const response = await this.axios.get("/users/me");

      return { data: response.data };
    } catch (error) {
      return { error };
    }
  };

  getItems = async () => {
    try {
      const response = await this.axios.get("/items/items");

      console.log("getItems", response);

      return response;
    } catch (error) {
      return { error };
    }
  };

  createItem = async (payload) => {
    try {
      const response = await this.axios.post("/items/items", payload);

      console.log("createItem", response);

      return response;
    } catch (error) {
      return { error };
    }
  };

  deleteItem = async (payload) => {
    const response = await this.axios.delete(`/items/items/${payload}`);

    console.log("deleteItem", response);

    return response;
  };

  updateItem = async (id, payload) => {
    const response = await this.axios.patch(`/items/items/${id}`, payload);

    console.log("updateItem", response);

    return response;
  };
}

export default new Api();
