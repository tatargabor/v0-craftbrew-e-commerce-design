// Email template base styles and components
// Table-based layout, max 600px, inline styles for email client compatibility

export const BRAND = {
  primary: '#6F4E37',      // Coffee brown
  secondary: '#D4A574',    // Amber/caramel
  background: '#FAF7F2',   // Warm cream
  text: '#3D3D3D',         // Dark gray
  muted: '#6B6B6B',        // Muted text
  border: '#E8E4DE',       // Light border
  white: '#FFFFFF',
  black: '#1A1A1A',
}

export const emailWrapper = (content: string, preheader?: string) => `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>CraftBrew</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1A1A1A !important; }
      .dark-mode-text { color: #F5F5F5 !important; }
      .dark-mode-muted { color: #A0A0A0 !important; }
      .dark-mode-border { border-color: #3D3D3D !important; }
    }
    @media only screen and (max-width: 620px) {
      .mobile-full { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
      .mobile-hide { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" class="dark-mode-bg">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background};" class="dark-mode-bg">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="mobile-full" style="max-width: 600px;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const emailHeader = () => `
<tr>
  <td style="padding-bottom: 32px; text-align: center;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 400; color: ${BRAND.primary}; letter-spacing: -0.5px;">
            CraftBrew
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 2px;" class="dark-mode-muted">
            Specialty Coffee Budapest
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
`

export const emailFooter = (showUnsubscribe = true) => `
<tr>
  <td style="padding-top: 40px; border-top: 1px solid ${BRAND.border};" class="dark-mode-border">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 12px;">
                <a href="https://instagram.com/craftbrew" style="text-decoration: none;">
                  <img src="https://placehold.co/24x24/6F4E37/FFFFFF?text=IG" alt="Instagram" width="24" height="24" style="display: block;" />
                </a>
              </td>
              <td style="padding: 0 12px;">
                <a href="https://facebook.com/craftbrew" style="text-decoration: none;">
                  <img src="https://placehold.co/24x24/6F4E37/FFFFFF?text=FB" alt="Facebook" width="24" height="24" style="display: block;" />
                </a>
              </td>
              <td style="padding: 0 12px;">
                <a href="https://youtube.com/craftbrew" style="text-decoration: none;">
                  <img src="https://placehold.co/24x24/6F4E37/FFFFFF?text=YT" alt="YouTube" width="24" height="24" style="display: block;" />
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom: 16px;">
          <p style="margin: 0; font-size: 13px; color: ${BRAND.muted}; line-height: 1.6;" class="dark-mode-muted">
            CraftBrew Kft.<br />
            1075 Budapest, Kazinczy u. 28.<br />
            <a href="mailto:hello@craftbrew.hu" style="color: ${BRAND.primary}; text-decoration: none;">hello@craftbrew.hu</a>
          </p>
        </td>
      </tr>
      ${showUnsubscribe ? `
      <tr>
        <td align="center" style="padding-bottom: 16px;">
          <a href="{{unsubscribe_url}}" style="font-size: 12px; color: ${BRAND.muted}; text-decoration: underline;" class="dark-mode-muted">
            Leiratkozás a hírlevelekről
          </a>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td align="center">
          <p style="margin: 0; font-size: 12px; color: ${BRAND.muted};" class="dark-mode-muted">
            © 2026 CraftBrew Kft. Minden jog fenntartva.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
`

export const primaryButton = (text: string, href: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tr>
    <td style="background-color: ${BRAND.primary}; border-radius: 6px;">
      <a href="${href}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: ${BRAND.white}; text-decoration: none; text-align: center;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`

export const secondaryButton = (text: string, href: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tr>
    <td style="border: 2px solid ${BRAND.primary}; border-radius: 6px;">
      <a href="${href}" style="display: inline-block; padding: 12px 28px; font-size: 15px; font-weight: 600; color: ${BRAND.primary}; text-decoration: none; text-align: center;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`

export const productCard = (product: { name: string; origin: string; price: string; image: string; href: string }) => `
<td style="width: 33.33%; padding: 8px; vertical-align: top;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <a href="${product.href}" style="text-decoration: none;">
          <img src="${product.image}" alt="${product.name}" width="160" height="160" style="display: block; width: 100%; max-width: 160px; height: auto; border-radius: 8px; margin: 0 auto;" />
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding-top: 12px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 11px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
          ${product.origin}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.text};" class="dark-mode-text">
          <a href="${product.href}" style="color: ${BRAND.text}; text-decoration: none;" class="dark-mode-text">${product.name}</a>
        </p>
        <p style="margin: 0; font-size: 14px; font-family: 'SF Mono', Monaco, monospace; color: ${BRAND.primary};">
          ${product.price}
        </p>
      </td>
    </tr>
  </table>
</td>
`
