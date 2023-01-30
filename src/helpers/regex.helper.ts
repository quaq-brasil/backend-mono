const password =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

const url_slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const regexHelper = {
  password,
  url_slug,
};
