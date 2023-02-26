const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const cron = require("node-cron");
const processMsgReceived = require("./utils/jiraUtils");

const GROUP_ID = process.env.WPP_GROUP_ID;
const JIRA_LOGO_URL =
  "https://visuresolutions.com/wp-content/uploads/2022/07/Logo-Jira.png";
const JIRA_REMINDER_MESSAGE = "Não esquecer de logar as horas no Jira!";

const newBotClient = async () => {
  const client = new Client({ authStrategy: new LocalAuth() });
  return client;
};

const botJira = async (client) => {
  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
    cron.schedule(
      "0 17 * * *",
      async () => {
        // running a task every day 17 hrs
        const media = await MessageMedia.fromUrl(JIRA_LOGO_URL);
        let message = JIRA_REMINDER_MESSAGE;
        client.sendMessage(GROUP_ID, media, {
          caption: message,
        });
      },
      {
        scheduled: true,
        timezone: process.env.TIMEZONE || "America/Sao_Paulo",
      }
    );
    client.on("message", async (message) => {
      const processedMsg = await processMsgReceived(message);
      console.log("processedMsg MSG: ", processedMsg);
      if (processedMsg !== null) {
        const media = await MessageMedia.fromUrl(JIRA_LOGO_URL);
        const response = client.sendMessage(message.from, media, {
          caption: processedMsg,
        });

        return response;
      }
    });
  });
};

const startBot = async () => {
  try {
    const client = await newBotClient();
    botJira(client);
    console.log("Bot started!");
  } catch (error) {
    console.log("ERROR INIT BOT: ", error);
  }
};

startBot();
