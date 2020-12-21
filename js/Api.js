const API_URL = "";

class Api {
  signIn = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/authenticate`, {
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    return await response.json();
  };
}

export default new Api();
