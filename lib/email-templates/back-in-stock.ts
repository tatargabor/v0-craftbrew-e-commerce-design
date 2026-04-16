import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton } from './base'

interface BackInStockData {
  productName: string
  productOrigin: string
  productPrice: string
  productImage: string
  productUrl: string
  optOutUrl: string
}

export const backInStockEmail = (data: BackInStockData) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- Alert Icon -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 64px; height: 64px; background-color: #DCFCE7; border-radius: 50%; text-align: center; line-height: 64px;">
                  <span style="font-size: 28px;">🎉</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Title -->
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Újra készleten!
            </h2>
            <p style="margin: 0; font-size: 16px; color: ${BRAND.muted};" class="dark-mode-muted">
              A kedvenced visszatért — ne maradj le róla!
            </p>
          </td>
        </tr>
        
        <!-- Product Card -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${BRAND.border}; border-radius: 12px; overflow: hidden;" class="dark-mode-border">
              <tr>
                <td>
                  <a href="${data.productUrl}" style="text-decoration: none;">
                    <img src="${data.productImage}" alt="${data.productName}" width="560" height="300" style="display: block; width: 100%; height: auto; object-fit: cover;" />
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    ${data.productOrigin}
                  </p>
                  <p style="margin: 0 0 12px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
                    <a href="${data.productUrl}" style="color: ${BRAND.text}; text-decoration: none;" class="dark-mode-text">
                      ${data.productName}
                    </a>
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 18px; font-family: 'SF Mono', Monaco, monospace; color: ${BRAND.primary};">
                    ${data.productPrice}
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background-color: #DCFCE7; border-radius: 4px; padding: 6px 12px;">
                        <span style="font-size: 12px; font-weight: 600; color: #16A34A; text-transform: uppercase; letter-spacing: 0.5px;">
                          ✓ Készleten
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- CTA -->
        <tr>
          <td align="center">
            ${primaryButton('Megnézem', data.productUrl)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  
  <!-- Opt-out -->
  <tr>
    <td style="padding-top: 24px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: ${BRAND.muted};" class="dark-mode-muted">
        <a href="${data.optOutUrl}" style="color: ${BRAND.muted}; text-decoration: underline;" class="dark-mode-muted">
          Nem kérek több értesítést erről a termékről
        </a>
      </p>
    </td>
  </tr>
  
  ${emailFooter()}
`, `${data.productName} újra készleten!`)
