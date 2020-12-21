class Loading {
  el;

  constructor() {
    this.el = document.querySelector("#loading");
  }

  show = () => {
    this.el.classList.add("show");
  };

  hide = () => {
    this.el.classList.remove("show");
  };
}

export default Loading;
