'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Mail, Moon, Sun, Copy, Check, ExternalLink } from 'lucide-react'

// Import templates
import { welcomeEmailHU, welcomeEmailEN } from '@/lib/email-templates/welcome'
import { orderConfirmationEmail } from '@/lib/email-templates/order-confirmation'
import { shippingNotificationEmail } from '@/lib/email-templates/shipping-notification'
import { deliveryReviewEmail } from '@/lib/email-templates/delivery-review'
import { backInStockEmail } from '@/lib/email-templates/back-in-stock'
import { promoAnnouncementEmail } from '@/lib/email-templates/promo-announcement'
import { passwordResetEmail } from '@/lib/email-templates/password-reset'

// Sample data for previews
const SAMPLE_DATA = {
  welcome: { name: 'Kovács Anna' },
  order: {
    orderNumber: '#CB-20260416-001',
    orderDate: '2026. április 16.',
    items: [
      { name: 'Ethiopia Yirgacheffe', variant: '250g, őrölt', quantity: 2, price: '6 980 Ft', image: 'https://placehold.co/60x60/FAF7F2/6F4E37?text=ETH' },
      { name: 'Colombia Supremo', variant: '500g, szemes', quantity: 1, price: '4 990 Ft', image: 'https://placehold.co/60x60/FAF7F2/6F4E37?text=COL' },
    ],
    subtotal: '11 970 Ft',
    shipping: '990 Ft',
    discount: '1 197 Ft',
    total: '11 763 Ft',
    shippingAddress: {
      name: 'Kovács Anna',
      street: 'Váci út 123. 2/4',
      city: 'Budapest',
      postal: '1138',
    },
    trackingUrl: 'https://craftbrew.hu/rendeleseink/CB-20260416-001',
  },
  shipping: {
    orderNumber: '#CB-20260416-001',
    courierName: 'GLS Hungary',
    courierLogo: 'https://placehold.co/120x32/FAF7F2/6F4E37?text=GLS',
    trackingNumber: 'GLS123456789HU',
    trackingUrl: 'https://gls-group.eu/HU/hu/csomagkovetes',
    estimatedDelivery: '2026. április 18. (péntek)',
    items: [
      { name: 'Ethiopia Yirgacheffe (250g × 2)', quantity: 2 },
      { name: 'Colombia Supremo (500g)', quantity: 1 },
    ],
  },
  delivery: {
    orderNumber: 'CB-20260416-001',
    productName: 'Ethiopia Yirgacheffe',
    productImage: 'https://placehold.co/200x200/FAF7F2/6F4E37?text=Ethiopia',
    reviewUrl: 'https://craftbrew.hu/kavek/ethiopia-yirgacheffe/ertekeles',
  },
  backInStock: {
    productName: 'Kenya AA Nyeri',
    productOrigin: 'Kenya',
    productPrice: '4 290 Ft',
    productImage: 'https://placehold.co/560x300/FAF7F2/6F4E37?text=Kenya+AA',
    productUrl: 'https://craftbrew.hu/kavek/kenya-aa-nyeri',
    optOutUrl: 'https://craftbrew.hu/notifications/unsubscribe?product=kenya-aa',
  },
  promo: {
    title: 'Tavaszi kávéünnep',
    discountPercent: 20,
    code: 'TAVASZ20',
    validUntil: '2026. április 30.',
    ctaUrl: 'https://craftbrew.hu/kavek?promo=TAVASZ20',
    featuredProducts: [
      { name: 'Ethiopia Yirgacheffe', origin: 'Etiópia', price: '2 792 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=ETH', href: '#' },
      { name: 'Colombia Supremo', origin: 'Kolumbia', price: '2 392 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=COL', href: '#' },
      { name: 'Guatemala Antigua', origin: 'Guatemala', price: '2 632 Ft', image: 'https://placehold.co/160x160/FAF7F2/6F4E37?text=GUA', href: '#' },
    ],
  },
  passwordReset: {
    resetUrl: 'https://craftbrew.hu/hu/jelszo-csere/abc123xyz',
    expiresIn: '24 óráig',
  },
}

type TemplateKey = 'welcome' | 'order' | 'shipping' | 'delivery' | 'backInStock' | 'promo' | 'passwordReset'

const TEMPLATES: { key: TemplateKey; label: string; labelEN?: string; category: string }[] = [
  { key: 'welcome', label: 'Üdvözlő email', labelEN: 'Welcome Email', category: 'Onboarding' },
  { key: 'order', label: 'Rendelés visszaigazolás', category: 'Tranzakciós' },
  { key: 'shipping', label: 'Szállítási értesítés', category: 'Tranzakciós' },
  { key: 'delivery', label: 'Kézbesítés + Értékelés kérés', category: 'Tranzakciós' },
  { key: 'backInStock', label: 'Újra készleten', category: 'Marketing' },
  { key: 'promo', label: 'Promóciós ajánlat', category: 'Marketing' },
  { key: 'passwordReset', label: 'Jelszó visszaállítás', category: 'Fiók' },
]

function getTemplateHtml(key: TemplateKey, lang: 'hu' | 'en' = 'hu'): string {
  switch (key) {
    case 'welcome':
      return lang === 'en' ? welcomeEmailEN(SAMPLE_DATA.welcome) : welcomeEmailHU(SAMPLE_DATA.welcome)
    case 'order':
      return orderConfirmationEmail(SAMPLE_DATA.order)
    case 'shipping':
      return shippingNotificationEmail(SAMPLE_DATA.shipping)
    case 'delivery':
      return deliveryReviewEmail(SAMPLE_DATA.delivery)
    case 'backInStock':
      return backInStockEmail(SAMPLE_DATA.backInStock)
    case 'promo':
      return promoAnnouncementEmail(SAMPLE_DATA.promo)
    case 'passwordReset':
      return passwordResetEmail(SAMPLE_DATA.passwordReset)
  }
}

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('welcome')
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState<'hu' | 'en'>('hu')

  const currentTemplate = TEMPLATES.find(t => t.key === selectedTemplate)!
  const html = getTemplateHtml(selectedTemplate, lang)

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-medium text-foreground">
                Email Sablonok
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                CraftBrew tranzakciós és marketing email sablonok előnézete
              </p>
            </div>
            <Badge variant="secondary" className="font-mono">
              7 sablon
            </Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sablon kiválasztása</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.key}
                    onClick={() => setSelectedTemplate(template.key)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedTemplate === template.key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{template.label}</p>
                      <p className={`text-xs ${selectedTemplate === template.key ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {template.category}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Beállítások</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language Toggle (only for Welcome) */}
                {selectedTemplate === 'welcome' && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Nyelv</Label>
                    <Select value={lang} onValueChange={(v) => setLang(v as 'hu' | 'en')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hu">Magyar (HU)</SelectItem>
                        <SelectItem value="en">English (EN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <Label htmlFor="dark-mode" className="text-sm">Sötét mód előnézet</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="flex flex-col gap-2 pt-6">
                <Button onClick={copyHtml} variant="outline" className="w-full justify-start">
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? 'Másolva!' : 'HTML másolása'}
                </Button>
                <Button onClick={openInNewTab} variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Megnyitás új ablakban
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="space-y-4">
            {/* Template Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium">{currentTemplate.label}</h2>
                {currentTemplate.labelEN && lang === 'en' && (
                  <p className="text-sm text-muted-foreground">{currentTemplate.labelEN}</p>
                )}
              </div>
              <Badge variant="outline">{currentTemplate.category}</Badge>
            </div>

            {/* Preview Tabs */}
            <Tabs defaultValue="preview" className="w-full">
              <TabsList>
                <TabsTrigger value="preview">Előnézet</TabsTrigger>
                <TabsTrigger value="html">HTML forrás</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div
                  className={`overflow-hidden rounded-xl border ${
                    darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAF7F2]'
                  }`}
                  style={{ minHeight: 600 }}
                >
                  <iframe
                    srcDoc={html}
                    className="h-[800px] w-full border-0"
                    title="Email Preview"
                    style={{
                      colorScheme: darkMode ? 'dark' : 'light',
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <pre className="max-h-[600px] overflow-auto rounded-xl border bg-muted p-4 text-xs">
                    <code>{html}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-4 top-4"
                    onClick={copyHtml}
                  >
                    {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                    {copied ? 'Másolva' : 'Másolás'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* i18n Side-by-Side Demo (only for Welcome) */}
            {selectedTemplate === 'welcome' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    HU / EN összehasonlítás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Badge className="mb-2">Magyar</Badge>
                      <div className="overflow-hidden rounded-lg border bg-[#FAF7F2]">
                        <iframe
                          srcDoc={welcomeEmailHU(SAMPLE_DATA.welcome)}
                          className="h-[400px] w-full border-0"
                          title="Welcome Email HU"
                        />
                      </div>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">English</Badge>
                      <div className="overflow-hidden rounded-lg border bg-[#FAF7F2]">
                        <iframe
                          srcDoc={welcomeEmailEN(SAMPLE_DATA.welcome)}
                          className="h-[400px] w-full border-0"
                          title="Welcome Email EN"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
