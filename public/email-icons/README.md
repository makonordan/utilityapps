# Email-signature social icons — required assets

The Email Signature Generator at `/tools/email-signature-generator` renders social-media icons by referencing PNG files hosted at this exact path:

```
https://utilityapps.site/email-icons/<platform>.png
```

The URL is hard-coded (see `SOCIAL_ICON_BASE` in [`lib/generateSignatureHtml.ts`](../../lib/generateSignatureHtml.ts)). Every social icon in a generated signature is an `<img>` pointing here — because email clients (Gmail in particular) block base64-embedded images, the icons must be served over HTTPS from a public URL.

**Until the files below are uploaded, generated signatures will render broken image placeholders where the icons should be.** The tool itself works — form, preview, copy, install guides — but recipients of an email using the signature will see a jagged 24 × 24 broken-image graphic instead of the real icon.

## Files needed

Drop the following 8 PNGs directly into this folder (`public/email-icons/`), lowercase filenames, exactly matching the `SocialPlatform` string:

| Filename        | Platform       |
| --------------- | -------------- |
| `linkedin.png`  | LinkedIn       |
| `twitter.png`   | Twitter / X    |
| `instagram.png` | Instagram      |
| `facebook.png`  | Facebook       |
| `youtube.png`   | YouTube        |
| `github.png`    | GitHub         |
| `whatsapp.png`  | WhatsApp       |
| `calendly.png`  | Calendly       |

The `website` platform value is intentionally omitted — signatures render the plain website URL as a text link, not an icon, so no PNG is needed for it. (If you decide later that you want a globe icon for the `website` platform, add `website.png` here and it'll pick up automatically.)

## Specifications

- **Dimensions:** **48 × 48 px** source files. Signatures request them at `width="24" height="24"` on the `<img>` tag, so 48 × 48 is the right choice for retina/hi-DPI displays where the client renders at 2x. Uploading 24 × 24 files still works but looks soft on Retina Macs and Pixel/Samsung Ultra devices.
- **Format:** PNG with alpha transparency.
- **Colour:** Full brand colour (LinkedIn blue, YouTube red, etc.). Don't tint them to match the user's accent — brand icons must stay recognisable. If you want a monochrome set, host it under a second base path and expose it via a template option later.
- **Background:** Transparent, not white. Some email clients apply a dark background at render time; a white background would show as a visible square around the icon.
- **File size:** Keep each under 5 KB. These load once per email, so tiny files matter for deliverability and reply-chain bloat.

## Where to source them

**Recommended:** [Simple Icons](https://simpleicons.org) (CC0, so no attribution required). Their SVG masters export cleanly to 48 × 48 PNG. Every icon on this list is in their catalogue. Bring their brand colour (from Simple Icons’ metadata) into the fill and export.

**Alternatives:** the official brand-asset pages of each service also publish downloadable icons — LinkedIn Brand Resources, Meta Brand Center, YouTube Brand Resources, etc. These are always the safest option for a commercial launch.

## Verification checklist after upload

1. `curl -I https://utilityapps.site/email-icons/linkedin.png` returns 200 with `content-type: image/png`.
2. Open the tool page in a browser, add a LinkedIn link in the Social Links section, and confirm the icon renders in the live preview.
3. Send yourself a test email using the generated signature to confirm the icon isn't blocked by Gmail's image-loading rules — if it is, check that the file is actually publicly readable at the URL above (not behind auth).
