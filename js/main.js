import App from "./App.js";

const onLoad = () => {
  console.log("onLoad");
  const app = new App();
  app.start();
};

window.addEventListener("load", onLoad);
