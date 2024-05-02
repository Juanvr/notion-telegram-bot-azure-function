
const { app } = require("@azure/functions");
const { Client } = require('@notionhq/client');
require('dotenv').config();

async function onMessage(request, context) {
    // Initialize response object
    let res = {};

    context.log(`New message received from "${request.url}"`);

    // Ensure that the request is a POST request
    if (request.method !== "POST") {
        return {
            status: 400,
            body: "This function only accepts POST requests."
        };
    }

    try {
        // Parse the JSON body from the request
        const body = await request.json();  // Assuming the incoming request is JSON
        context.log('Parsed Request Body:', body);

        // Extract message details
        const message = body.message;
        const chatId = message.chat.id;
        const text = message.text;
        const userId = message.from.id.toString();

        // Initialize Notion client
        const notion = new Client({
            auth: process.env.NOTION_TOKEN
        });

        // Environment variables
        const authorizedUserId = process.env.MY_TELEGRAM_ID;
        const databaseId = process.env.NOTION_DATABASE_ID;

        // Check if the user is authorized
        if (userId === authorizedUserId) {
            // Create a page in Notion
            await notion.pages.create({
                parent: { database_id: databaseId },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: text
                                }
                            }
                        ]
                    }
                }
            });

            // Respond to Telegram
            res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: "sendMessage",
                    chat_id: chatId,
                    text: "Successfully added to Notion!"
                })
            };
        } else {
            // Unauthorized user access
            res = {
                status: 200,
                body: JSON.stringify({
                    method: "sendMessage",
                    chat_id: chatId,
                    text: "You are not authorized to use this bot."
                })
            };
        }
    } catch (error) {
        context.log.error('Error processing request:', error);
        // Handle errors or invalid request structure
        res = {
            status: 400,
            body: "Failed to process request. Ensure valid structure."
        };
    }

    return res;
};


app.http('onMessage', {
    route: "onMessage",
    methods: ['POST'],
    authLevel: 'function',
    handler: onMessage
});

module.exports = { onMessage };


