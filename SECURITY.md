# Security Policy

## Reporting

If you find a security issue in this static certificate designer, open a private report to the maintainers (do not post tokens or personal data in public issues).

## What this repo must not contain

- API keys, auth tokens, `.env` files
- Real trainee/instructor personal data in defaults or sample assets
- Private phone numbers, national IDs, or customer exports

## Runtime safeguards

- Auth tokens received via `postMessage` / config are kept in memory only and stripped before `localStorage` save
- Standalone (GitHub Pages / local) mode shows sample QR images; valid authenticity QR codes are issued on [pandenik.ir](https://pandenik.ir)
- Legacy personal names in saved browser state are replaced with generic placeholders on load

## Hosting tips

- Prefer HTTPS
- Do not commit production secrets into this repository
- If embedding on Pandenik, pass tokens only at runtime from the parent frame
