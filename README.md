# notion-telegram-bot-azure-function

This project enables us to add new elements to a Notion database using a telegram bot. 

The bot messages are processed by an Azure Function. 

We need to create a new telegram bot, deploy the Azure Function and configure a webhook so the messages received by the bot are processed by the Azure Function. 

To test the Azure function locally: 
```bash
func start
```

And we can send a test: 
```bash
curl --location 'http://localhost:7071/api/onMessage' \
--header 'Content-Type: application/json' \
--data '{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": MY_TELEGRAM_ID,
      "is_bot": false,
      "first_name": "John",
      "username": "john_doe"
    },
    "chat": {
      "id": 123456,
      "first_name": "John",
      "username": "john_doe",
      "type": "private"
    },
    "date": 1609459200,
    "text": "Hello, bot!"
  }
}'

```

To deploy the Azure function: 

```bash
az login
func azure functionapp publish azure-functions-resource-name
```

And then to test the endpoint: 
```bash
curl --location 'https://<your-function-app>.azurewebsites.net/api/onmessage?code=function_key_value' \
--header 'Content-Type: application/json' \
--data '{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": MY_TELEGRAM_ID,
      "is_bot": false,
      "first_name": "John",
      "username": "john_doe"
    },
    "chat": {
      "id": 123456,
      "first_name": "John",
      "username": "john_doe",
      "type": "private"
    },
    "date": 1609459200,
    "text": "Hello, bot!"
  }
}'

```

At last, to set the telegram webhook: 
```bash
curl -F "url=https://<your-function-app>.azurewebsites.net/api/<your-function-name>?code=<your-function-key>" https://api.telegram.org/bot<YourBOTToken>/setWebhook

```
The bot token is the bot token provided by BotFather


