import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton } from './base'

interface OrderItem {
  name: string
  variant: string
  quantity: number
  price: string
  image: string
}

interface OrderData {
  orderNumber: string
  orderDate: string
  items: OrderItem[]
  subtotal: string
  shipping: string
  discount?: string
  total: string
  shippingAddress: {
    name: string
    street: string
    city: string
    postal: string
  }
  trackingUrl: string
}

export const orderConfirmationEmail = (data: OrderData) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- Success Icon -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 64px; height: 64px; background-color: #E8F5E9; border-radius: 50%; text-align: center; line-height: 64px;">
                  <span style="font-size: 28px;">✓</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Title -->
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Köszönjük a rendelésed!
            </h2>
            <p style="margin: 0; font-size: 16px; color: ${BRAND.muted};" class="dark-mode-muted">
              Megkaptuk a rendelésed és hamarosan csomagoljuk.
            </p>
          </td>
        </tr>
        
        <!-- Order Number -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 8px; padding: 20px; text-align: center;" class="dark-mode-border">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    Rendelésszám
                  </p>
                  <p style="margin: 0; font-size: 20px; font-family: 'SF Mono', Monaco, monospace; font-weight: 600; color: ${BRAND.primary};">
                    ${data.orderNumber}
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: ${BRAND.muted};" class="dark-mode-muted">
                    ${data.orderDate}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Items Table -->
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px;">
              Tételek
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${data.items.map(item => `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.border};" class="dark-mode-border">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 60px; vertical-align: top;">
                        <img src="${item.image}" alt="${item.name}" width="60" height="60" style="display: block; border-radius: 6px;" />
                      </td>
                      <td style="padding-left: 16px; vertical-align: top;">
                        <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${BRAND.text};" class="dark-mode-text">
                          ${item.name}
                        </p>
                        <p style="margin: 0; font-size: 13px; color: ${BRAND.muted};" class="dark-mode-muted">
                          ${item.variant} × ${item.quantity}
                        </p>
                      </td>
                      <td style="text-align: right; vertical-align: top;">
                        <p style="margin: 0; font-size: 15px; font-family: 'SF Mono', Monaco, monospace; color: ${BRAND.text};" class="dark-mode-text">
                          ${item.price}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              `).join('')}
            </table>
          </td>
        </tr>
        
        <!-- Totals -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};" class="dark-mode-muted">Részösszeg</td>
                <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.text}; text-align: right; font-family: 'SF Mono', Monaco, monospace;" class="dark-mode-text">${data.subtotal}</td>
              </tr>
              ${data.discount ? `
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #16A34A;">Kedvezmény</td>
                <td style="padding: 8px 0; font-size: 14px; color: #16A34A; text-align: right; font-family: 'SF Mono', Monaco, monospace;">-${data.discount}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};" class="dark-mode-muted">Szállítás</td>
                <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.text}; text-align: right; font-family: 'SF Mono', Monaco, monospace;" class="dark-mode-text">${data.shipping}</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 0 0; font-size: 16px; font-weight: 600; color: ${BRAND.text}; border-top: 2px solid ${BRAND.border};" class="dark-mode-text dark-mode-border">Összesen</td>
                <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: 700; color: ${BRAND.primary}; text-align: right; font-family: 'SF Mono', Monaco, monospace; border-top: 2px solid ${BRAND.border};" class="dark-mode-border">${data.total}</td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Shipping Address -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 8px; padding: 20px;">
              <tr>
                <td>
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    Szállítási cím
                  </p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BRAND.text};" class="dark-mode-text">
                    ${data.shippingAddress.name}<br />
                    ${data.shippingAddress.street}<br />
                    ${data.shippingAddress.postal} ${data.shippingAddress.city}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- CTA -->
        <tr>
          <td align="center">
            ${primaryButton('Rendelés követése', data.trackingUrl)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter(false)}
`, `Rendelésed #${data.orderNumber} visszaigazolása`)
