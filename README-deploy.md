# Deploy to Cloudflare Pages

1. Replace the placeholder `account_id` in `wrangler.json` with your Cloudflare Account ID.
   - You can find your Account ID in the Cloudflare dashboard: Account Home → Overview → Account ID.

2. Authenticate with Wrangler (PowerShell):

```powershell
wrangler login
```

3. Publish the site to Pages from the project root:

```powershell
wrangler pages publish . --project-name dial-in-productivity-timer
```

Notes
- If you prefer, provide your `account_id` and I can insert it into `wrangler.json` for you.
- `wrangler pages publish` will upload the current directory as a Pages deployment.