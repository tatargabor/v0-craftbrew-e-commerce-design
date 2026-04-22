import { Metadata } from "next"
import { LegalPageLayout } from "@/components/legal-page-layout"

export const metadata: Metadata = {
  title: "Cookie Szabályzat | CraftBrew",
  description: "CraftBrew Kft. cookie (süti) szabályzata",
}

const sections = [
  { id: "mik", title: "1. Mik azok a sütik?" },
  { id: "hasznalat", title: "2. Hogyan használjuk?" },
  { id: "tipusok", title: "3. Süti típusok" },
  { id: "szukseges", title: "4. Szükséges sütik" },
  { id: "funkcionalis", title: "5. Funkcionális sütik" },
  { id: "analitika", title: "6. Analitikai sütik" },
  { id: "marketing", title: "7. Marketing sütik" },
  { id: "beallitasok", title: "8. Süti beállítások" },
  { id: "kapcsolat", title: "9. Kapcsolat" },
]

export default function CookiePage() {
  return (
    <LegalPageLayout
      title="Cookie Szabályzat"
      lastUpdated="2026. április 1."
      sections={sections}
      pdfUrl="/documents/cookie.pdf"
    >
      <section id="mik" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          1. Mik azok a sütik?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.1. A sütik (cookie-k) kis méretű szöveges fájlok, amelyeket a 
          weboldal az Ön böngészőjében tárol. Ezek segítik a weboldal 
          megfelelő működését és a felhasználói élmény javítását.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          1.2. A sütik nem tartalmaznak személyesen azonosítható információkat, 
          és nem képesek vírusokat vagy rosszindulatú programokat terjeszteni.
        </p>
      </section>

      <section id="hasznalat" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          2. Hogyan használjuk a sütiket?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.1. A craftbrew.hu weboldalon sütiket használunk az alábbi célokra:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
          <li>A weboldal alapvető funkcióinak biztosítása</li>
          <li>Bejelentkezési állapot megjegyzése</li>
          <li>Kosár tartalmának tárolása</li>
          <li>Nyelvi beállítások megjegyzése</li>
          <li>Látogatottsági statisztikák készítése</li>
          <li>Személyre szabott tartalmak megjelenítése</li>
        </ul>
      </section>

      <section id="tipusok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          3. Süti típusok
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.1. <strong>Munkamenet sütik (session cookies):</strong> ideiglenesen 
          tárolódnak, a böngésző bezárásával törlődnek.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.2. <strong>Állandó sütik (persistent cookies):</strong> a 
          böngésző bezárása után is megmaradnak egy meghatározott ideig.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.3. <strong>Első fél sütik:</strong> közvetlenül a craftbrew.hu 
          által elhelyezett sütik.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          3.4. <strong>Harmadik fél sütik:</strong> partnereink által 
          elhelyezett sütik (pl. analitikai, reklám szolgáltatók).
        </p>
      </section>

      <section id="szukseges" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          4. Szükséges sütik
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ezek a sütik elengedhetetlenek a weboldal működéséhez. 
          Nélkülük a weboldal nem tud megfelelően működni.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground">Süti neve</th>
                <th className="text-left py-3 pr-4 font-medium text-foreground">Cél</th>
                <th className="text-left py-3 font-medium text-foreground">Lejárat</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">cb_session</td>
                <td className="py-3 pr-4">Munkamenet azonosító</td>
                <td className="py-3">Munkamenet</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">cb_cart</td>
                <td className="py-3 pr-4">Kosár tartalom</td>
                <td className="py-3">7 nap</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">cb_auth</td>
                <td className="py-3 pr-4">Bejelentkezési állapot</td>
                <td className="py-3">30 nap</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-xs">cb_consent</td>
                <td className="py-3 pr-4">Süti preferenciák</td>
                <td className="py-3">1 év</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="funkcionalis" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          5. Funkcionális sütik
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ezek a sütik a felhasználói élmény javítását szolgálják, 
          pl. nyelvi beállítások, korábbi keresések megjegyzése.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground">Süti neve</th>
                <th className="text-left py-3 pr-4 font-medium text-foreground">Cél</th>
                <th className="text-left py-3 font-medium text-foreground">Lejárat</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">cb_lang</td>
                <td className="py-3 pr-4">Nyelvi preferencia</td>
                <td className="py-3">1 év</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">cb_recent</td>
                <td className="py-3 pr-4">Legutóbb megtekintett termékek</td>
                <td className="py-3">30 nap</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-xs">cb_wishlist</td>
                <td className="py-3 pr-4">Kedvencek (vendég)</td>
                <td className="py-3">30 nap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="analitika" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          6. Analitikai sütik
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ezek a sütik segítenek megérteni, hogyan használják a látogatók 
          a weboldalt. Az adatok anonimizáltak és összesítettek.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground">Süti neve</th>
                <th className="text-left py-3 pr-4 font-medium text-foreground">Szolgáltató</th>
                <th className="text-left py-3 font-medium text-foreground">Lejárat</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">_ga</td>
                <td className="py-3 pr-4">Google Analytics</td>
                <td className="py-3">2 év</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">_gid</td>
                <td className="py-3 pr-4">Google Analytics</td>
                <td className="py-3">24 óra</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-xs">_vercel_insights</td>
                <td className="py-3 pr-4">Vercel Analytics</td>
                <td className="py-3">1 év</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="marketing" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          7. Marketing sütik
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ezek a sütik a személyre szabott hirdetések megjelenítését 
          szolgálják más weboldalakon.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground">Süti neve</th>
                <th className="text-left py-3 pr-4 font-medium text-foreground">Szolgáltató</th>
                <th className="text-left py-3 font-medium text-foreground">Lejárat</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-xs">_fbp</td>
                <td className="py-3 pr-4">Facebook Pixel</td>
                <td className="py-3">3 hónap</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-xs">_gcl_au</td>
                <td className="py-3 pr-4">Google Ads</td>
                <td className="py-3">3 hónap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="beallitasok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          8. Süti beállítások kezelése
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          8.1. A süti preferenciáit bármikor módosíthatja a láblécben található 
          „Cookie beállítások" linkre kattintva.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          8.2. A böngészőjében is kezelheti a sütiket:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/hu/kb/sutik-engedelyezese-es-tiltasa" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/hu-hu/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/hu-hu/microsoft-edge/cookie-k-t%C3%B6rl%C3%A9se-a-microsoft-edge-ben-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          8.3. Felhívjuk figyelmét, hogy a sütik tiltása befolyásolhatja a 
          weboldal működését és egyes funkciók nem lesznek elérhetők.
        </p>
      </section>

      <section id="kapcsolat" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          9. Kapcsolat
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ha kérdése van a sütik használatával kapcsolatban, kérjük, 
          lépjen kapcsolatba velünk:
        </p>
        <div className="bg-muted/30 rounded-lg p-6 space-y-2">
          <p className="text-muted-foreground">
            <strong className="text-foreground">E-mail:</strong>{" "}
            <a href="mailto:adatvedelem@craftbrew.hu" className="text-primary hover:underline">
              adatvedelem@craftbrew.hu
            </a>
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Cím:</strong> 1075 Budapest, Kazinczy utca 28.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  )
}
