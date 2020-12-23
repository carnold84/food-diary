import { API_URL, TOKEN_NAME } from "./config.js";

class Api {
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

  post = async (url, data, withAuth = true) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (withAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      body: JSON.stringify(data),
      headers,
      method: "POST",
    });

    return await response.json();
  };

  isSignedIn = () => {
    return this.token !== null;
  };

  getToken = () => {
    return this.token;
  };

  removeToken = (token) => {
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

  signIn = async (credentials) => {
    const { data, error } = await this.post(
      "/auth/authenticate",
      credentials,
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
    return await this.get("/items/items");
  };
}

export default new Api();
