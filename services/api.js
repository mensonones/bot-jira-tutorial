const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const cookieJar = new CookieJar();

axios.defaults.withCredentials = true;
axios.defaults.jar = cookieJar;

const instance = wrapper(
  axios.create({
    baseURL: process.env.JIRA_API_REST_URL,
  })
);

module.exports = instance;