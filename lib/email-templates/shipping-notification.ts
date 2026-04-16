import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton } from './base'

interface ShippingData {
  orderNumber: string
  courierName: string
  courierLogo: string
  trackingNumber: string
  trackingUrl: string
  estimatedDelivery: string
  items: { name: string; quantity: number }[]
}

export const shippingNotificationEmail = (data: ShippingData) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- Package Icon -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 64px; height: 64px; background-color: #FEF3C7; border-radius: 50%; text-align: center; line-height: 64px;">
                  <span style="font-size: 28px;">📦</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Title -->
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              A csomagod úton van!
            </h2>
            <p style="margin: 0; font-size: 16px; color: ${BRAND.muted};" class="dark-mode-muted">
              Rendelésszám: <span style="font-family: 'SF Mono', Monaco, monospace; color: ${BRAND.primary};">${data.orderNumber}</span>
            </p>
          </td>
        </tr>
        
        <!-- Courier Info -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 8px; padding: 24px;">
              <tr>
                <td style="text-align: center;">
                  <img src="${data.courierLogo}" alt="${data.courierName}" height="32" style="display: inline-block; margin-bottom: 16px;" />
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    Nyomkövetési szám
                  </p>
                  <p style="margin: 0; font-size: 18px; font-family: 'SF Mono', Monaco, monospace; font-weight: 600; color: ${BRAND.primary};">
                    ${data.trackingNumber}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Estimated Delivery -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid ${BRAND.secondary}; border-radius: 8px; padding: 20px; text-align: center;">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    Várható kézbesítés
                  </p>
                  <p style="margin: 0; font-size: 20px; font-weight: 600; color: ${BRAND.primary};">
                    ${data.estimatedDelivery}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Items Summary -->
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px;">
              Csomag tartalma
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${data.items.map(item => `
              <tr>
                <td style="padding: 8px 0; font-size: 15px; color: ${BRAND.text};" class="dark-mode-text">
                  ${item.name}
                </td>
                <td style="padding: 8px 0; font-size: 15px; color: ${BRAND.muted}; text-align: right;" class="dark-mode-muted">
                  × ${item.quantity}
                </td>
              </tr>
              `).join('')}
            </table>
          </td>
        </tr>
        
        <!-- CTA -->
        <tr>
          <td align="center">
            ${primaryButton('Csomag követése', data.trackingUrl)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter(false)}
`, 'A csomagod feladásra került!')
