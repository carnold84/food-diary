import App from "./App.js";

const onLoad = () => {
  const app = new App();
  app.start();
};

window.addEventListener("load", onLoad);
