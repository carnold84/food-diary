import Api from "../Api.js";

class Home {
  el;
  elList;
  elMessage;
  isLoading = false;

  constructor() {
    console.log("loadItems");
    this.el = document.querySelector("#home");
    this.elList = this.el.querySelector(".list");
    this.elMessage = this.el.querySelector(".message");
  }

  show = () => {
    this.el.classList.add("show");

    this.loadItems();
  };

  hide = () => {
    this.el.classList.remove("show");
    this.elList.classList.remove("show");
  };

  loadItems = async () => {
    console.log("loadItems");
    const { data, error } = await Api.getItems();

    if (data.length > 0) {
      data.forEach((element) => {
        const item = document.createElement("li");
        item.innerHTML = element.name;
        this.elList.appendChild(item);
      });
      this.elList.classList.add("show");
    } else {
      this.elMessage.classList.add("show");
    }

    console.log(data);
  };
}

export default Home;
