import { Metadata } from "next"
import { LegalPageLayout } from "@/components/legal-page-layout"

export const metadata: Metadata = {
  title: "Adatvédelmi Szabályzat | CraftBrew",
  description: "CraftBrew Kft. adatvédelmi szabályzata és tájékoztatója",
}

const sections = [
  { id: "bevezeto", title: "1. Bevezető" },
  { id: "adatkezelo", title: "2. Az adatkezelő adatai" },
  { id: "adatok", title: "3. Kezelt adatok köre" },
  { id: "jogalapok", title: "4. Jogalapok" },
  { id: "celok", title: "5. Adatkezelés céljai" },
  { id: "idotartam", title: "6. Adatkezelés időtartama" },
  { id: "jogok", title: "7. Az érintett jogai" },
  { id: "harmadik", title: "8. Adattovábbítás" },
  { id: "biztonsag", title: "9. Adatbiztonság" },
  { id: "jogorvoslat", title: "10. Jogorvoslat" },
]

export default function AdatvedelemPage() {
  return (
    <LegalPageLayout
      title="Adatvédelmi Szabályzat"
      lastUpdated="2026. április 1."
      sections={sections}
      pdfUrl="/documents/adatvedelem.pdf"
    >
      <section id="bevezeto" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          1. Bevezető
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.1. A CraftBrew Kft. (a továbbiakban: Adatkezelő) elkötelezett 
          a személyes adatok védelme mellett. Jelen Adatvédelmi Szabályzat 
          célja, hogy tájékoztassa a Felhasználókat az adatkezelési 
          gyakorlatunkról.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          1.2. Az adatkezelés során az Adatkezelő az Európai Parlament és a 
          Tanács (EU) 2016/679 rendelete (GDPR) és az információs önrendelkezési 
          jogról szóló 2011. évi CXII. törvény rendelkezései szerint jár el.
        </p>
      </section>

      <section id="adatkezelo" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          2. Az adatkezelő adatai
        </h2>
        <div className="bg-muted/30 rounded-lg p-6 space-y-2">
          <p className="text-muted-foreground">
            <strong className="text-foreground">Név:</strong> CraftBrew Kft.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Székhely:</strong> 1075 Budapest, Kazinczy utca 28.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Cégjegyzékszám:</strong> 01-09-123456
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Adószám:</strong> 12345678-2-42
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">E-mail:</strong>{" "}
            <a href="mailto:adatvedelem@craftbrew.hu" className="text-primary hover:underline">
              adatvedelem@craftbrew.hu
            </a>
          </p>
        </div>
      </section>

      <section id="adatok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          3. Kezelt adatok köre
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.1. <strong>Regisztráció során megadott adatok:</strong>
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>Teljes név</li>
          <li>E-mail cím</li>
          <li>Jelszó (titkosított formában)</li>
          <li>Nyelvi preferencia</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.2. <strong>Vásárlás során megadott adatok:</strong>
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>Szállítási cím (név, irányítószám, város, utca, házszám)</li>
          <li>Telefonszám</li>
          <li>Számlázási adatok</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.3. <strong>Automatikusan gyűjtött adatok:</strong>
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
          <li>IP-cím</li>
          <li>Böngésző típusa és verziója</li>
          <li>Operációs rendszer</li>
          <li>Látogatás időpontja és időtartama</li>
          <li>Megtekintett oldalak</li>
        </ul>
      </section>

      <section id="jogalapok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          4. Jogalapok
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.1. <strong>Szerződés teljesítése (GDPR 6. cikk (1) b)):</strong>{" "}
          A vásárlás és szállítás lebonyolításához szükséges adatkezelés.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.2. <strong>Jogi kötelezettség (GDPR 6. cikk (1) c)):</strong>{" "}
          Számviteli és adójogi kötelezettségek teljesítése.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.3. <strong>Hozzájárulás (GDPR 6. cikk (1) a)):</strong>{" "}
          Hírlevél küldése, marketing kommunikáció.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          4.4. <strong>Jogos érdek (GDPR 6. cikk (1) f)):</strong>{" "}
          Weboldal működtetése, visszaélések megelőzése.
        </p>
      </section>

      <section id="celok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          5. Adatkezelés céljai
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
          <li>Felhasználói fiók létrehozása és kezelése</li>
          <li>Megrendelések feldolgozása és teljesítése</li>
          <li>Szállítás lebonyolítása</li>
          <li>Ügyfélszolgálati támogatás nyújtása</li>
          <li>Számlázás</li>
          <li>Hírlevél és promóciós anyagok küldése (hozzájárulás esetén)</li>
          <li>Weboldal fejlesztése és optimalizálása</li>
          <li>Statisztikai elemzések készítése</li>
        </ul>
      </section>

      <section id="idotartam" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          6. Adatkezelés időtartama
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          6.1. <strong>Felhasználói fiók adatai:</strong> a fiók törléséig 
          vagy az utolsó bejelentkezéstől számított 3 évig.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          6.2. <strong>Vásárlási adatok:</strong> a számviteli törvény 
          szerinti 8 évig.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          6.3. <strong>Hírlevél feliratkozás:</strong> a leiratkozásig.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          6.4. <strong>Cookie adatok:</strong> lásd{" "}
          <a href="/hu/cookie" className="text-primary hover:underline">
            Cookie Szabályzat
          </a>
        </p>
      </section>

      <section id="jogok" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          7. Az érintett jogai
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.1. <strong>Hozzáférési jog:</strong> tájékoztatást kérhet a 
          kezelt személyes adatairól.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.2. <strong>Helyesbítéshez való jog:</strong> kérheti pontatlan 
          adatai kijavítását.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.3. <strong>Törléshez való jog:</strong> kérheti adatai törlését 
          („elfeledtetéshez való jog").
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.4. <strong>Korlátozáshoz való jog:</strong> kérheti az 
          adatkezelés korlátozását.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          7.5. <strong>Adathordozhatósághoz való jog:</strong> kérheti 
          adatai strukturált formátumban történő kiadását.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          7.6. <strong>Tiltakozáshoz való jog:</strong> tiltakozhat az 
          adatkezelés ellen.
        </p>
      </section>

      <section id="harmadik" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          8. Adattovábbítás
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          8.1. Az Adatkezelő az alábbi harmadik feleknek továbbíthat adatokat:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
          <li>Futárszolgálatok (szállítás céljából)</li>
          <li>Fizetési szolgáltatók (tranzakció lebonyolítása)</li>
          <li>Könyvelő iroda (számviteli kötelezettségek)</li>
          <li>Tárhelyszolgáltató (adattárolás)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          8.2. Az adatfeldolgozókkal írásbeli szerződés biztosítja az 
          adatvédelmi előírások betartását.
        </p>
      </section>

      <section id="biztonsag" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          9. Adatbiztonság
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          9.1. Az Adatkezelő megfelelő technikai és szervezési intézkedéseket 
          alkalmaz a személyes adatok védelme érdekében:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
          <li>SSL/TLS titkosítás</li>
          <li>Jelszavak hash-elése</li>
          <li>Tűzfal és behatolás-érzékelő rendszerek</li>
          <li>Rendszeres biztonsági mentések</li>
          <li>Hozzáférés-korlátozás</li>
        </ul>
      </section>

      <section id="jogorvoslat" className="mb-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          10. Jogorvoslat
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          10.1. Panasz esetén forduljon az Adatkezelőhöz:{" "}
          <a href="mailto:adatvedelem@craftbrew.hu" className="text-primary hover:underline">
            adatvedelem@craftbrew.hu
          </a>
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          10.2. Jogorvoslatért a Nemzeti Adatvédelmi és Információszabadság 
          Hatósághoz fordulhat:
        </p>
        <div className="bg-muted/30 rounded-lg p-6 space-y-2">
          <p className="text-muted-foreground">
            <strong className="text-foreground">NAIH</strong>
          </p>
          <p className="text-muted-foreground">Cím: 1055 Budapest, Falk Miksa utca 9-11.</p>
          <p className="text-muted-foreground">Telefon: +36 (1) 391-1400</p>
          <p className="text-muted-foreground">
            E-mail:{" "}
            <a href="mailto:ugyfelszolgalat@naih.hu" className="text-primary hover:underline">
              ugyfelszolgalat@naih.hu
            </a>
          </p>
          <p className="text-muted-foreground">
            Weboldal:{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.naih.hu
            </a>
          </p>
        </div>
      </section>
    </LegalPageLayout>
  )
}
