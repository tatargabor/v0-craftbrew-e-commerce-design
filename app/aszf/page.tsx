import { Metadata } from "next"
import { LegalPageLayout } from "@/components/legal-page-layout"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek | CraftBrew",
  description: "CraftBrew Kft. általános szerződési feltételei",
}

const sections = [
  { id: "bevezeto", title: "1. Bevezető rendelkezések" },
  { id: "fogalmak", title: "2. Fogalmak" },
  { id: "megrendeles", title: "3. Megrendelés" },
  { id: "szallitas", title: "4. Szállítás" },
  { id: "fizetes", title: "5. Fizetés" },
  { id: "elallas", title: "6. Elállási jog" },
  { id: "garancia", title: "7. Garancia és szavatosság" },
  { id: "adatvedelem", title: "8. Adatvédelem" },
  { id: "vegyes", title: "9. Vegyes rendelkezések" },
]

export default function ASZFPage() {
  return (
    <LegalPageLayout
      title="Általános Szerződési Feltételek"
      lastUpdated="2026. április 1."
      sections={sections}
      pdfUrl="/documents/aszf.pdf"
    >
      <section id="bevezeto" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          1. Bevezető rendelkezések
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.1. A jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF)
          a CraftBrew Kft. (székhely: 1075 Budapest, Kazinczy utca 28., 
          cégjegyzékszám: 01-09-123456, adószám: 12345678-2-42, a továbbiakban: 
          Szolgáltató) által üzemeltetett craftbrew.hu weboldalon (a továbbiakban: 
          Weboldal) keresztül nyújtott szolgáltatásokra vonatkoznak.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.2. A Weboldal használatával, valamint a megrendelés leadásával 
          a Felhasználó elfogadja a jelen ÁSZF-ben foglalt feltételeket.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          1.3. A Szolgáltató fenntartja a jogot, hogy az ÁSZF-et egyoldalúan 
          módosítsa. A módosítások a Weboldalon történő közzététellel lépnek hatályba.
        </p>
      </section>

      <section id="fogalmak" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          2. Fogalmak
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.1. <strong>Felhasználó:</strong> a Weboldalt meglátogató, illetve 
          azon regisztráló és/vagy vásárló természetes vagy jogi személy.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.2. <strong>Fogyasztó:</strong> a szakmája, önálló foglalkozása 
          vagy üzleti tevékenysége körén kívül eljáró természetes személy.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.3. <strong>Termék:</strong> a Weboldalon megvásárolható árucikkek, 
          különösen, de nem kizárólagosan: kávé, kávékészítő eszközök, kiegészítők.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          2.4. <strong>Előfizetés:</strong> rendszeres időközönként ismétlődő 
          termékszállítást magában foglaló szolgáltatás.
        </p>
      </section>

      <section id="megrendeles" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          3. Megrendelés
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.1. A megrendelés leadása a Weboldalon keresztül, a kosárba helyezett 
          termékek kiválasztását és a pénztári folyamat befejezését követően történik.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.2. A megrendelés leadása fizetési kötelezettséget keletkeztet.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.3. A Szolgáltató a megrendelés beérkezését követően automatikus 
          visszaigazoló e-mailt küld a Felhasználó által megadott e-mail címre.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          3.4. A szerződés a visszaigazoló e-mail elküldésével jön létre.
        </p>
      </section>

      <section id="szallitas" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          4. Szállítás
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.1. A Szolgáltató Magyarország egész területére vállalja a 
          termékek kiszállítását.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.2. <strong>Szállítási díjak:</strong>
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>Budapest: 990 Ft</li>
          <li>Budapesttől 20 km-en belül: 1 490 Ft</li>
          <li>Budapesttől 20-40 km: 1 990 Ft</li>
          <li>40 km felett: egyedi árazás</li>
          <li>15 000 Ft feletti rendelés esetén Budapesten ingyenes</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.3. A kiszállítás várható ideje: 1-3 munkanap.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          4.4. Személyes átvétel lehetséges a CraftBrew Laborban 
          (1075 Budapest, Kazinczy utca 28.) nyitvatartási időben.
        </p>
      </section>

      <section id="fizetes" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          5. Fizetés
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          5.1. A Weboldalon az alábbi fizetési módok érhetők el:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>Bankkártyás fizetés (Visa, Mastercard, American Express)</li>
          <li>Ajándékkártya</li>
          <li>Utánvét (készpénz a futárnál)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          5.2. A bankkártyás fizetés biztonságos SSL titkosítással történik, 
          a kártyaadatokat a Szolgáltató nem tárolja.
        </p>
      </section>

      <section id="elallas" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          6. Elállási jog
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          6.1. A Fogyasztó a termék kézhezvételétől számított 14 napon belül 
          indoklás nélkül elállhat a szerződéstől.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          6.2. Az elállási jog nem gyakorolható:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>felbontott, bontatlan csomagolású élelmiszer esetén</li>
          <li>egyedi igények alapján készült termékek esetén</li>
          <li>romlandó termékek esetén</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          6.3. Az elállás esetén a Szolgáltató haladéktalanul, de legkésőbb 
          14 napon belül visszatéríti a Fogyasztó által megfizetett összeget.
        </p>
      </section>

      <section id="garancia" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          7. Garancia és szavatosság
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.1. A Szolgáltató a termékekre a jogszabályban előírt szavatosságot 
          és jótállást biztosítja.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.2. Kávékészítő gépekre 2 év jótállás vonatkozik.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          7.3. Reklamáció esetén kérjük, vegye fel velünk a kapcsolatot a 
          hello@craftbrew.hu e-mail címen.
        </p>
      </section>

      <section id="adatvedelem" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          8. Adatvédelem
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          8.1. A Szolgáltató a Felhasználók személyes adatait az Adatvédelmi 
          Szabályzatban foglaltak szerint kezeli.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          8.2. A részletes adatkezelési tájékoztató elérhető:{" "}
          <a href={ROUTES.privacy} className="text-primary hover:underline">
            Adatvédelmi Szabályzat
          </a>
        </p>
      </section>

      <section id="vegyes" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          9. Vegyes rendelkezések
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          9.1. A jelen ÁSZF-ben nem szabályozott kérdésekben a magyar jog, 
          különösen a Polgári Törvénykönyv és a fogyasztóvédelmi jogszabályok 
          rendelkezései irányadók.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          9.2. Jogvita esetén a Szolgáltató székhelye szerint illetékes 
          bíróság jár el.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          9.3. Kapcsolat: hello@craftbrew.hu, +36 1 234 5678
        </p>
      </section>
    </LegalPageLayout>
  )
}
