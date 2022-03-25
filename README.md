# YouTube Dislikes Restorer
 Restore the like/dislike count to your YouTube videos! 



## About

Simple web based application to automatically update the titles of selected videos on your channel to reflect the current likes and dislikes.



## Setup

To use this app, you will need to make your own Google Cloud Project (not as daunting as it sounds) for security (so you can be sure I don't have access to your account) and for the annoying ratelimit I'll talk about later - believe me it will come up again

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com/) 

   ![image-20220325180123022](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-1.png)

2. Go to the APIs & Services Library

   ![image-20220325180339022](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-2.png)

3. Enable the YouTube Data API

   ![image-20220325180443003](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-3.png)

4. Create credentials

   ![image-20220325182900988](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-4.png)

5. ![image-20220325182933112](C:\Users\user\AppData\Roaming\Typora\typora-user-images\image-20220325182933112.png)

   ![image-20220325183026708](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-4-2.png)

![image-20220325183223782](C:\Users\user\Documents\GitHub\ytDislikesRestorer\docs\setup-4-3.png)

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
