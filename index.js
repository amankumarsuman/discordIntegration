// const Discord = require("discord.js");
const {
  Client,
  intents,
  Collection,
  DiscordAPIError,
  Guild,
} = require("discord.js");
const axios = require("axios");

// Discord bot setup
// const client = new Discord.Client();
// const client = new Discord.Client({
//   ws: {
//     intents: Discord.Constants.Intents.ALL,
//   },
// });

const client = new Client({ intents: [7796] });

// Notion API setup
const notionApiKey = "secret_DZIUEeTFr7blIF7WmwU40g91A0UsyOcDHivB2i5ruex";
const notionHeaders = {
  accept: "application/json",
  "content-type": "application/json",
  Authorization: "Bearer " + notionApiKey,
};

// Handle Discord messages
client.on("message", async (message) => {
  console.log(message);
  if (message.content.startsWith("!create_page")) {
    const pageName = message.content.split(" ")[1];
    const pageContent = message.content.split(" ").slice(2).join(" ");
    // Create a new page in Notion
    const notionData = {
      properties: {
        title: {
          title: [
            {
              text: {
                content: pageName,
              },
            },
          ],
        },
        content: {
          rich_text: [
            {
              text: {
                content: pageContent,
              },
            },
          ],
        },
      },
    };
    try {
      const notionResponse = await axios.post(
        "https://api.notion.com/v1/blocks/create",
        notionData,
        { headers: notionHeaders }
      );
      if (notionResponse.status === 200) {
        await message.channel.send("Page created successfully.");
      } else {
        await message.channel.send(
          "An error occurred while creating the page."
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("message", (message) => {
  console.log(message, "msg2");
  // check if the message starts with the command "!create_page"
  if (message.content.startsWith("!create_page")) {
    // extract the page name and content from the message
    const [pageName, ...pageContent] = message.content.split(" ").slice(1);
    // call the function to create a page in Notion with the extracted information
    createPageInNotion(pageName, pageContent.join(" "));
  }
});

async function createPageInNotion(pageName, pageContent) {
  try {
    // make a POST request to the Notion API to create a new page
    const res = await axios.post("https://api.notion.com/v1/blocks/create", {
      properties: {
        title: {
          title: [
            {
              text: {
                content: pageName,
              },
            },
          ],
        },
        rich_text: {
          rich_text: [
            {
              text: {
                content: pageContent,
              },
            },
          ],
        },
      },
    });

    // log the response from the API
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
}

// Start the Discord bot
client.login(
  "MTA3MjcxMzM1MjQ5MDUzMjk1Ng.GPBiXa.FyVhTAFZl_yCVmZVT6ulZf4NCYlr8XAvvH3owM"
);
