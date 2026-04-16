import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton, productCard } from './base'

interface PromoData {
  title: string
  discountPercent: number
  code: string
  validUntil: string
  ctaUrl: string
  featuredProducts?: { name: string; origin: string; price: string; image: string; href: string }[]
}

export const promoAnnouncementEmail = (data: PromoData) => emailWrapper(`
  ${emailHeader()}
  
  <!-- Hero Banner -->
  <tr>
    <td style="background: linear-gradient(135deg, ${BRAND.primary} 0%, #8B6B4B 100%); border-radius: 12px 12px 0 0; padding: 48px 40px; text-align: center;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: ${BRAND.secondary}; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
              Limitált idejű ajánlat
            </p>
            <h1 style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 400; color: ${BRAND.white};">
              ${data.discountPercent}% kedvezmény
            </h1>
            <p style="margin: 0; font-size: 18px; color: rgba(255,255,255,0.9);">
              ${data.title}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 0 0 12px 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- Coupon Code -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px dashed ${BRAND.secondary}; border-radius: 8px; padding: 20px; text-align: center;">
              <tr>
                <td>
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: ${BRAND.muted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-mode-muted">
                    Kuponkód
                  </p>
                  <p style="margin: 0; font-size: 28px; font-family: 'SF Mono', Monaco, monospace; font-weight: 700; color: ${BRAND.primary}; letter-spacing: 4px;">
                    ${data.code}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Validity -->
        <tr>
          <td style="padding-bottom: 32px; text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #FEF3C7; border-radius: 4px; padding: 8px 16px;">
                  <span style="font-size: 13px; color: #92400E;">
                    ⏰ Érvényes: <strong>${data.validUntil}</strong>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        ${data.featuredProducts ? `
        <!-- Featured Products -->
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
              Kiemelt ajánlatok
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${data.featuredProducts.map(p => productCard(p)).join('')}
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}
        
        <!-- CTA -->
        <tr>
          <td align="center">
            ${primaryButton('Vásárlás most', data.ctaUrl)}
          </td>
        </tr>
        
        <!-- Terms -->
        <tr>
          <td style="padding-top: 24px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: ${BRAND.muted};" class="dark-mode-muted">
              A kedvezmény nem kombinálható más akciókkal. Minimum rendelési érték: 5 000 Ft.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter()}
`, `${data.discountPercent}% kedvezmény - ${data.title}`)
