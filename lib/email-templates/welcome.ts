import { BRAND, emailWrapper, emailHeader, emailFooter, primaryButton, productCard } from './base'

// Hungarian version
export const welcomeEmailHU = (data: { name: string }) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Üdv a CraftBrew-nál, ${data.name}!
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${BRAND.muted};" class="dark-mode-muted">
              Örülünk, hogy csatlakoztál hozzánk! A CraftBrew-nál hiszünk abban, hogy minden csésze kávé mögött egy történet van — a termelőktől kezdve egészen az elkészítésig.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 8px; padding: 24px;" class="dark-mode-border">
              <tr>
                <td>
                  <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px;">
                    Amit kapsz tőlünk
                  </p>
                  <ul style="margin: 0; padding: 0 0 0 20px; font-size: 15px; line-height: 1.8; color: ${BRAND.text};" class="dark-mode-text">
                    <li>Kézzel válogatott specialty kávék a világ minden tájáról</li>
                    <li>Frissen pörkölt, minőséggaranciával</li>
                    <li>Részletes ízjegyek és elkészítési tippek</li>
                    <li>Exkluzív előfizetői kedvezmények</li>
                  </ul>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
              Kezdd itt
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${productCard({ name: 'Ethiopia Yirgacheffe', origin: 'Etiópia', price: '3 490 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Ethiopia', href: 'https://craftbrew.hu/kavek/ethiopia-yirgacheffe' })}
                ${productCard({ name: 'Colombia Supremo', origin: 'Kolumbia', price: '2 990 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Colombia', href: 'https://craftbrew.hu/kavek/colombia-supremo' })}
                ${productCard({ name: 'Guatemala Antigua', origin: 'Guatemala', price: '3 290 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Guatemala', href: 'https://craftbrew.hu/kavek/guatemala-antigua' })}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 8px;">
            ${primaryButton('Fedezd fel a kávéinkat', 'https://craftbrew.hu/kavek')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter()}
`, 'Üdvözlünk a CraftBrew-nál! Fedezd fel a specialty kávék világát.')

// English version
export const welcomeEmailEN = (data: { name: string }) => emailWrapper(`
  ${emailHeader()}
  <tr>
    <td style="background-color: ${BRAND.white}; border-radius: 12px; padding: 40px;" class="mobile-padding dark-mode-bg">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center; padding-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: ${BRAND.text};" class="dark-mode-text">
              Welcome to CraftBrew, ${data.name}!
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${BRAND.muted};" class="dark-mode-muted">
              We're thrilled to have you join us! At CraftBrew, we believe every cup of coffee tells a story — from the farmers who grow it to the moment you brew it.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.background}; border-radius: 8px; padding: 24px;" class="dark-mode-border">
              <tr>
                <td>
                  <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px;">
                    What you'll get from us
                  </p>
                  <ul style="margin: 0; padding: 0 0 0 20px; font-size: 15px; line-height: 1.8; color: ${BRAND.text};" class="dark-mode-text">
                    <li>Hand-selected specialty coffees from around the world</li>
                    <li>Freshly roasted with quality guarantee</li>
                    <li>Detailed tasting notes and brewing tips</li>
                    <li>Exclusive subscriber discounts</li>
                  </ul>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: ${BRAND.primary}; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
              Start here
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${productCard({ name: 'Ethiopia Yirgacheffe', origin: 'Ethiopia', price: '3,490 HUF', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Ethiopia', href: 'https://craftbrew.hu/en/coffees/ethiopia-yirgacheffe' })}
                ${productCard({ name: 'Colombia Supremo', origin: 'Colombia', price: '2,990 HUF', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Colombia', href: 'https://craftbrew.hu/en/coffees/colombia-supremo' })}
                ${productCard({ name: 'Guatemala Antigua', origin: 'Guatemala', price: '3,290 HUF', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=Guatemala', href: 'https://craftbrew.hu/en/coffees/guatemala-antigua' })}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 8px;">
            ${primaryButton('Explore our coffees', 'https://craftbrew.hu/en/coffees')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${emailFooter()}
`, 'Welcome to CraftBrew! Discover the world of specialty coffee.')
