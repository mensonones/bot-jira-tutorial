const jiraClient = require(".././jiraClient");

const JIRA_REMINDER_MESSAGE = "Não esquecer de logar as horas no Jira!";

const makeResponseJira = async (id) => {
  try {
    const jiraIssue = await jiraClient(id);
    return `Issue: ${jiraIssue?.data?.key}\nLabel: ${jiraIssue?.data?.fields?.labels[0]}\nAssignee: ${jiraIssue?.data?.fields?.assignee?.name}\nDescription: ${jiraIssue?.data?.fields?.description}`;
  } catch (error) {
    if (error.response.status === 404) {
      return `Issue ${id} não encontrada!`;
    }
    if (error.response.status === 401) {
      return `Verifique suas credenciais!`;
    }
  }
};

const processMsgReceived = async (msg) => {
  let response;
  if (msg.body.startsWith("DEV-")) {
    response = await makeResponseJira(msg.body);
  } else if (msg.body.startsWith("!lembrete")) {
    response = JIRA_REMINDER_MESSAGE;
  } else {
    return null;
  }
  return response;
};

module.exports = processMsgReceived;
