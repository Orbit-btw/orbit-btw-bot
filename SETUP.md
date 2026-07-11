# Orbit-btw-bot Setup Guide

Follow these concise steps to set up, register, and run your GitHub App.

## 1. Setup Local Webhook Proxy (Smee)
GitHub needs a public URL to send events to your local machine.
1. Go to [https://smee.io/](https://smee.io/) and click **"Start a new channel"**.
2. Copy the **Webhook Proxy URL** (e.g., `https://smee.io/AbCdEfG...`).
3. In your `orbit-bot` folder, ensure your `.env` file contains:
   ```env
   WEBHOOK_PROXY_URL=https://smee.io/your_channel_id
   ```

## 2. Auto-Register the App (Recommended)
Probot can automatically create the App in GitHub and download its keys.
1. Open your terminal in the `orbit-bot` folder and run `npm run dev`.
2. Open [http://localhost:3000](http://localhost:3000) in your web browser.
3. Click **"Register GitHub App"**.
4. Select the **Orbit-btw** organization.
5. GitHub will redirect you back, and automatically populate your `.env` file with your `APP_ID`, `PRIVATE_KEY`, and `WEBHOOK_SECRET`.

*(If this works, skip to Step 4!)*

---

## 3. Manual Registration (Only if Auto-Register Fails)
If the button fails, you must create the App on GitHub manually.
1. Go to **GitHub -> Orbit-btw (Org) -> Settings -> Developer Settings -> GitHub Apps -> New GitHub App**.
2. **App Name**: `orbit-btw-bot` (must be unique).
3. **Homepage URL**: `https://github.com/Orbit-btw`
4. **Webhook URL**: Paste your Smee proxy URL here.
5. **Webhook Secret**: Create a random password (e.g., `my_secret_123`).
6. **Permissions**: 
   - Set **Issues** to `Read & write`.
   - Set **Pull requests** to `Read & write`.
7. **Subscribe to events**: 
   - Check the boxes for `Issues`, `Issue comment`, and `Pull request`.
8. Click **Create GitHub App**.
9. On the next page, click **Generate a private key**. A `.pem` file will download to your computer.
10. Update your `.env` file manually:
    ```env
    WEBHOOK_PROXY_URL=https://smee.io/your_channel_id
    APP_ID=123456 (Find this on the GitHub App page)
    WEBHOOK_SECRET=my_secret_123
    PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYourKeyHere\n-----END RSA PRIVATE KEY-----"
    ```

## 4. Run and Test Locally
1. Restart your server: Press `Ctrl + C` in the terminal, then run `npm run dev` again.
2. Go to any issue in your GitHub repositories.
3. Comment `/claim` or `/assign` on the issue.
4. Your bot will automatically assign the issue to you!

## 5. Deployment (Production)
Once you are ready to run the bot 24/7 without keeping your computer on:
1. Push this repository to GitHub.
2. Connect the repository to a hosting provider like [Render](https://render.com/).
3. Set the start command to `npm start`.
4. Add the following **Environment Variables** to your hosting provider (copy values from your local `.env` file):
   - `APP_ID`
   - `WEBHOOK_SECRET`
   - `PRIVATE_KEY` (Include the entire `-----BEGIN...` block)
   *(Note: You do NOT need the `WEBHOOK_PROXY_URL` variable in production)*
5. **Crucial Final Step:** Once deployed, go back to your **GitHub App Settings**. Change the **Webhook URL** from your `smee.io` link to your new live URL appended with `/api/github/webhooks`. 
   - Example: `https://your-app-name.onrender.com/api/github/webhooks`
