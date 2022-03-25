# YouTube Dislikes Restorer
 Restore the like/dislike count to your YouTube videos! 



## About

Simple web based application to automatically update the titles of selected videos on your channel to reflect the current likes and dislikes.



## Setup

To use this app, you will need to make your own Google Cloud Project (not as daunting as it sounds) for security (so you can be sure I don't have access to your account) and for the annoying ratelimit I'll talk about later - believe me it will come up again

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com/) 

   ![setup-1](https://user-images.githubusercontent.com/68653653/160212067-161c905e-5777-4e9f-a2d4-96790ebfc467.png)

2. Go to the APIs & Services Library

   ![setup-2](https://user-images.githubusercontent.com/68653653/160212081-5294b5c6-3c35-47df-a1f3-2e9806435769.png)

3. Enable the YouTube Data API

   ![setup-3](https://user-images.githubusercontent.com/68653653/160212094-850b1da1-0110-4032-b068-25e3cb4db6a6.png)

4. Create credentials

   ![setup-4](https://user-images.githubusercontent.com/68653653/160212099-1c77c016-19ed-4c38-bfab-2763a3ec1c52.png)

5. ![setup-5-1](https://user-images.githubusercontent.com/68653653/160212103-b08993d7-ca3f-44d9-bc00-e79b7cbcd304.png)

   ![setup-5-2](https://user-images.githubusercontent.com/68653653/160212105-9b894caf-aef2-4e5f-b24b-356f2c2dbba4.png)

   ![setup-5-3](https://user-images.githubusercontent.com/68653653/160212111-93ec8ee8-ccda-4ce3-907a-4a83042f5645.png)

6. Create a `.env` file using the following template:

   ```
   CLIENT_ID=[client id]
   CLIENT_SECRET=[client secret]
   
   PORT=3000
   ```

   - You can find the client details on the credentials page by downloading the OAuth2 client
   - Changing the port will require you to change the Redirect URI declared in Step 5
   - Do not share this file with anyone

7. If you don't already have it, download and install [NodeJS](https://nodejs.dev)

8. Run `npm install && node index.js` in the command prompt of your choice

9. Visit [localhost:3000](http://localhost:3000) in your browser once the application has started and log into your Google Account associated with YouTube

10. In the Videos tab, you will have to click the Refresh Videos button upon starting the server to view any videos

    - Videos will not update automatically so you will have to click the button or restart the server every time you upload a video



## Ratelimit

- Google Cloud Projects have a ratelimit of 10,000 tokens per day
- Token costs for actions on this application:
  - Refreshing videos - 100 tokens + 1 token per video (1 token per video includes just visiting the Videos page, not just refreshing it)
  - Updating video titles - 50 tokens per video

* You can monitor your quota [here](https://console.cloud.google.com/iam-admin/quotas)
* It is recommended you conserve how many times you use this application every day.
* Warning: If you have more than 200 videos, you will not be able to update them all within the quota
