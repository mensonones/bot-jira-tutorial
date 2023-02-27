const instance = require('./services/api');

const loginJira = async () => {
  try {
    const result = await instance.post("/rest/auth/1/session", {
      username: process.env.JIRA_USERNAME,
      password: process.env.JIRA_PASSWORD,
    });
    if (result.status === 200) {
      console.log("Login realizado com sucesso");
      return true;
    }
  } catch (error) {
    console.log("Erro ao realizar o login:", error.message);
  }
  return false;
};

const getIssue = async (id) => {
    const result = await instance.get(`/rest/api/2/issue/${id}`);
    return result;
};

const jiraClient = async (id) => {
  try {
    const result = await instance.get("/rest/auth/1/session");
    if (result) {
      console.log("Sessão ativa");
      const issue = await getIssue(id);
      return issue;
    }
  } catch (error) {
    if (error.response.status === 401) {
      console.log("Não autorizado");
      const loginResult = await loginJira();
      if (loginResult) {
        return jiraClient(id);
      } else {
        throw error;
      }
    } else {
      console.log("Erro ao obter a sessão:", error);
      throw error;
    }
  }
};

module.exports = jiraClient;
