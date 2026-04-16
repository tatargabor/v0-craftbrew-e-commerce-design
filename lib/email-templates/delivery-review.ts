import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton, secondaryButton } from './base'

interface DeliveryData {
  orderNumber: string
  productName: string
  productImage: string
  reviewUrl: string
}

export const deliveryReviewEmail = (data: DeliveryData) => emailWrapper(`
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
                  <span style="font-size: 28px;">☕</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Title -->
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Megérkezett a kávéd!
            </h2>
            <p style="margin: 0; font-size: 16px; color: ${BRAND.muted};" class="dark-mode-muted">
              Reméljük, hogy élvezed! Hogy ízlett?
            </p>
          </td>
        </tr>
        
        <!-- Product Card -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="padding: 24px; text-align: center;">
                  <img src="${data.productImage}" alt="${data.productName}" width="200" height="200" style="display: block; margin: 0 auto 20px auto; border-radius: 8px;" />
                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${BRAND.text};" class="dark-mode-text">
                    ${data.productName}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Star Rating -->
        <tr>
          <td style="padding-bottom: 32px; text-align: center;">
            <p style="margin: 0 0 16px 0; font-size: 15px; color: ${BRAND.text};" class="dark-mode-text">
              Értékeld a kávét egy kattintással:
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                ${[1, 2, 3, 4, 5].map(star => `
                <td style="padding: 0 4px;">
                  <a href="${data.reviewUrl}?rating=${star}" style="text-decoration: none;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 48px; height: 48px; background-color: ${BRAND.background}; border-radius: 8px; text-align: center; line-height: 48px; font-size: 24px; transition: transform 0.2s;">
                          ⭐
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                `).join('')}
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- CTA -->
        <tr>
          <td align="center" style="padding-bottom: 16px;">
            ${primaryButton('Részletes értékelés írása', data.reviewUrl)}
          </td>
        </tr>
        
        <!-- Secondary -->
        <tr>
          <td align="center">
            ${secondaryButton('Újrarendelés', `https://craftbrew.hu/rendeleseink/${data.orderNumber}/reorder`)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter()}
`, 'Hogy ízlett a kávéd? Oszd meg velünk!')
