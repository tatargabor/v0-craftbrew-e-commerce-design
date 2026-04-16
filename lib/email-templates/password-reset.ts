import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton } from './base'

interface PasswordResetData {
  resetUrl: string
  expiresIn: string
}

export const passwordResetEmail = (data: PasswordResetData) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- Lock Icon -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 64px; height: 64px; background-color: ${BRAND.background}; border-radius: 50%; text-align: center; line-height: 64px;">
                  <span style="font-size: 28px;">🔐</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Title -->
        <tr>
          <td style="text-align: center; padding-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Jelszó visszaállítása
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: ${BRAND.muted};" class="dark-mode-muted">
              Kaptunk egy kérést a jelszavad visszaállítására. Ha nem te voltál, nyugodtan figyelmen kívül hagyhatod ezt az emailt.
            </p>
          </td>
        </tr>
        
        <!-- CTA -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            ${primaryButton('Új jelszó beállítása', data.resetUrl)}
          </td>
        </tr>
        
        <!-- Expiry Notice -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 8px; padding: 16px;">
              <tr>
                <td style="text-align: center;">
                  <p style="margin: 0; font-size: 13px; color: #92400E;">
                    ⏰ Ez a link <strong>${data.expiresIn}</strong> érvényes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Fallback URL -->
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND.muted};" class="dark-mode-muted">
              Ha a gomb nem működik, másold be ezt a linket a böngésződbe:
            </p>
            <p style="margin: 0; font-size: 12px; color: ${BRAND.primary}; word-break: break-all;">
              <a href="${data.resetUrl}" style="color: ${BRAND.primary}; text-decoration: none;">
                ${data.resetUrl}
              </a>
            </p>
          </td>
        </tr>
        
        <!-- Security Notice -->
        <tr>
          <td style="border-top: 1px solid ${BRAND.border}; padding-top: 24px;" class="dark-mode-border">
            <p style="margin: 0; font-size: 13px; color: ${BRAND.muted}; line-height: 1.6;" class="dark-mode-muted">
              <strong>Biztonsági tipp:</strong> Soha ne oszd meg a jelszavadat senkivel. A CraftBrew munkatársai soha nem kérik el a jelszavadat emailben vagy telefonon.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter(false)}
`, 'Jelszó visszaállítása - CraftBrew')
