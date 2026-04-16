'use client'

import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail, MapPin } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

const COOKIE_CONSENT_KEY = "craftbrew-cookie-consent"

const FOOTER_NAV = {
  shop: {
    title: 'Kávék',
    links: [
      { label: 'Összes kávé', href: '/kavek' },
      { label: 'Szemes kávé', href: '/kavek/szemes' },
      { label: 'Őrölt kávé', href: '/kavek/orolt' },
      { label: 'Előfizetés', href: '/elofizetes' },
    ],
  },
  equipment: {
    title: 'Eszközök',
    links: [
      { label: 'Pour over', href: '/eszkozok/pour-over' },
      { label: 'French press', href: '/eszkozok/french-press' },
      { label: 'Darálók', href: '/eszkozok/daralok' },
      { label: 'Kiegészítők', href: '/eszkozok/kiegeszitok' },
    ],
  },
  info: {
    title: 'Információ',
    links: [
      { label: 'Sztorik', href: '/sztorik' },
      { label: 'Rólunk', href: '/rolunk' },
      { label: 'Szállítás', href: '/szallitas' },
      { label: 'Kapcsolat', href: '/kapcsolat' },
    ],
  },
  support: {
    title: 'Segítség',
    links: [
      { label: 'GYIK', href: '/gyik' },
      { label: 'Visszaküldés', href: '/visszakuldes' },
      { label: 'Nagykereskedelem', href: '/nagykereskedelem' },
    ],
  },
}

const SOCIAL_LINKS = [
  { icon: Instagram, href: 'https://instagram.com/craftbrew', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/craftbrew', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/craftbrew', label: 'YouTube' },
]

const LEGAL_LINKS = [
  { label: 'ÁSZF', href: '/hu/aszf' },
  { label: 'Adatvédelmi', href: '/hu/adatvedelem' },
  { label: 'Cookie szabályzat', href: '/hu/cookie' },
  { label: 'Cookie beállítások', href: '#', isCookieSettings: true },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-foreground">
                CraftBrew
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Specialty kávék, gondosan válogatva és frissen pörkölve. 
              Minden csésze egy történet.
            </p>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a
                href="mailto:hello@craftbrew.hu"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                hello@craftbrew.hu
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 flex-shrink-0" />
                <span>
                  1054 Budapest,<br />
                  Kávé utca 12.
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {Object.values(FOOTER_NAV).map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold tracking-wide text-foreground">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Legal Footer */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 CraftBrew Kft. Minden jog fenntartva.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {LEGAL_LINKS.map((link, index) => (
              <span key={link.label} className="flex items-center">
                {'isCookieSettings' in link && link.isCookieSettings ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem(COOKIE_CONSENT_KEY)
                      window.location.reload()
                    }}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )}
                {index < LEGAL_LINKS.length - 1 && (
                  <span className="ml-4 text-border sm:ml-6">·</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
