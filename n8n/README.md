# Meta Leads Integration via n8n

Terrific Travel CRM integrates with **n8n** (self-hosted workflow automation) to automatically capture inbound leads from Meta (Facebook & Instagram Ads) in real-time and distribute them evenly across active agents using **Round-Robin Assignment**.

---

## 1. How It Works

```
Meta Ad Lead Form (Facebook/Instagram)
          │
          ▼ (Real-time webhook)
     n8n Container (Port 5678)
          │
          ▼ (Internal Docker HTTP POST with x-webhook-secret)
TMS Backend (/api/leads/webhook)
          │
          ▼
1. Extract Lead details (Name, Phone, Email, Campaign, Form, Ad)
2. Query active users with Agent / Travel Agent / Manager roles
3. Distribute lead fairly (Round-Robin via Redis counter)
4. Create Lead in CRM with status "NEW"
5. Record initial LeadStatusLog documenting the Meta campaign and assigned agent
```

---

## 2. Launching n8n

n8n is fully configured in `docker-compose.yml` with persistent storage (`n8n_data`).

### Start the container:
```bash
docker compose up -d n8n
```

### Access the Web UI:
- **Local/Direct**: `http://<your-server-ip>:5678`
- **Domain (if reverse proxied)**: `https://n8n.terrifictravel.co.uk`

On first launch, create your owner account (email & password).

---

## 3. Importing the Workflow Template

1. Open the n8n web dashboard.
2. Click **Workflows** $\rightarrow$ **Add Workflow**.
3. In the top right menu (`...`), click **Import from File**.
4. Select `n8n/workflows/meta_leads_to_crm.json`.
5. Click **Save** and toggle the workflow to **Active**.

---

## 4. Connecting Meta (Facebook & Instagram)

### Option A: Using the Facebook Lead Ads Trigger Node
1. In n8n, click on the **Facebook Lead Ads** trigger.
2. Connect your Meta App credentials (App ID, App Secret, Page Access Token).
3. Select your Facebook Page and Lead Form.

### Option B: Pointing Meta Webhooks Directly to n8n Webhook
1. In Meta Business Suite / Facebook App Dashboard:
   - Go to **Webhooks** $\rightarrow$ **Leadgen**.
   - Set the Callback URL to:
     `https://n8n.terrifictravel.co.uk/webhook/meta-leads`
   - Enter your Verify Token.
2. Subscribe to `leadgen` events for your Facebook Page.

---

## 5. Security & Verification

All calls to the TMS backend CRM endpoint (`POST /api/leads/webhook`) require the secret header:
```http
x-webhook-secret: tms_lead_webhook_secret_key_2026
```
This key can be customized at any time in `.env` / `docker-compose.yml` under `LEAD_WEBHOOK_SECRET`.
