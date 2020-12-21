export const dispatch = (event, payload) => {
  window.dispatchEvent(new CustomEvent(event, { detail: payload }));
};
