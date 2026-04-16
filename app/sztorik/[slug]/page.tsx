"use client"

import { use } from "react"
import Link from "next/link"
import {
  Clock,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AspectRatio } from "@/components/ui/aspect-ratio"

// Mock story data
const storyData = {
  slug: "ethiopia-yirgacheffe-tortenete",
  title: "Yirgacheffe: Az etióp felföld rejtett kincse",
  excerpt: "Utazás a kávé bölcsőjébe, ahol minden csésze mögött generációk tudása és szenvedélye áll.",
  category: "Eredetsztorik",
  categorySlug: "origin",
  author: {
    name: "Kovács Anna",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    bio: "Kávészakértő és utazó. 10 éve járja a világ kávétermő régióit.",
  },
  publishedAt: "2026. április 10.",
  readingTime: 8,
  coverImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=900&fit=crop",
  content: `
    <p class="lead">Etiópia déli részén, a zöld hegyek között rejtőzik egy régió, amely évszázadok óta a világ egyik legkülönlegesebb kávéját termeli. A Yirgacheffe név mára a minőség szinonimájává vált.</p>

    <h2>A kávé bölcsője</h2>

    <p>A legenda szerint egy Kaldi nevű kecskepásztor fedezte fel a kávé élénkítő hatását, amikor megfigyelte, hogy kecskéi mennyire energikusak lesznek bizonyos bogyók elfogyasztása után. Bár ez a történet valószínűleg csak legenda, az tény, hogy Etiópia a kávé őshazája.</p>

    <p>A Yirgacheffe régió 1700-2200 méter magasságban terül el, ahol a vulkanikus talaj és a mérsékelt éghajlat ideális körülményeket teremt a kávétermesztéshez. A hagyományos ültetvények itt még mindig kis családi gazdaságok, ahol a kávécseresznyéket kézzel szedik.</p>

    <figure>
      <img src="https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=1200&h=800&fit=crop" alt="Etióp kávéfarm" />
      <figcaption>Kávészedés egy Yirgacheffe-i farmon</figcaption>
    </figure>

    <h2>Feldolgozási módszerek</h2>

    <p>A Yirgacheffe kávé jellegzetes ízvilága nagyrészt a feldolgozási módszernek köszönhető. A régióban két fő technikát alkalmaznak:</p>

    <h3>Mosott (washed) feldolgozás</h3>

    <p>A mosott eljárás során a kávécseresznyéket először meghámozzák, majd vízben áztatják, hogy eltávolítsák a gyümölcshúst. Ez a módszer tiszta, élénk, virágos ízeket eredményez — a Yirgacheffe kávé klasszikus jellemzőit.</p>

    <blockquote>
      <p>"A jó Yirgacheffe olyan, mint egy parfüm — először a virágos jegyeket érzed, aztán jön a citrusos frissesség, végül egy lágy, tea-szerű utóíz."</p>
      <cite>— Alemayehu Tadesse, Q Grader</cite>
    </blockquote>

    <h3>Természetes (natural) feldolgozás</h3>

    <p>A természetes eljárás során a teljes kávécseresznye a napon szárad. Ez intenzívebb, gyümölcsösebb ízeket eredményez — érett bogyók, trópusi gyümölcsök és méz jegyekkel.</p>

    <h2>Ízprofil és főzési ajánlások</h2>

    <p>A Yirgacheffe kávé jellegzetes ízprofillal rendelkezik:</p>

    <ul>
      <li><strong>Virágos jegyek:</strong> jázmin, levendula, narancsvirág</li>
      <li><strong>Gyümölcsös jegyek:</strong> citrom, bergamott, őszibarack</li>
      <li><strong>Alapkarakter:</strong> tea-szerű, selymes, elegáns</li>
    </ul>

    <p>A legjobb eredmény eléréséhez filter módszereket ajánlunk — V60, Chemex vagy AeroPress. A világos vagy közepesen világos pörkölés megőrzi a komplex ízjegyeket.</p>

    <figure>
      <img src="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1200&h=800&fit=crop" alt="V60 készítés" />
      <figcaption>V60 pour over — ideális a Yirgacheffe számára</figcaption>
    </figure>

    <h2>Fenntarthatóság és közösség</h2>

    <p>A Yirgacheffe régióban a kávétermesztés nem csupán megélhetés — ez egy életforma, amely generációkon átível. A helyi kooperatívák segítik a kisgazdákat abban, hogy jobb árat kapjanak a kávéjukért, miközben fenntartható termesztési módszereket alkalmaznak.</p>

    <p>Amikor Yirgacheffe kávét választasz, nem csak egy kiváló kávét kapsz — hozzájárulsz egy közösség fenntartásához is, amely évszázadok óta őrzi ezt a hagyományt.</p>
  `,
}

// Related products
const relatedProducts = [
  {
    id: "1",
    slug: "ethiopia-yirgacheffe",
    name: "Ethiopia Yirgacheffe",
    origin: "ETIÓPIA",
    price: 3490,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    slug: "ethiopia-sidamo",
    name: "Ethiopia Sidamo",
    origin: "ETIÓPIA",
    price: 3290,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    slug: "v60-dripper",
    name: "Hario V60 Dripper",
    origin: "ESZKÖZ",
    price: 4990,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
  },
]

// Related stories
const relatedStories = [
  {
    id: "1",
    slug: "colombia-kave-utazas",
    title: "Kolumbia: A kávétermesztés szíve",
    category: "Eredetsztorik",
    coverImage: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=300&fit=crop",
    readingTime: 12,
  },
  {
    id: "2",
    slug: "light-roast-titkai",
    title: "A világos pörkölés művészete",
    category: "Pörkölés",
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    readingTime: 6,
  },
  {
    id: "3",
    slug: "v60-pour-over-guide",
    title: "V60 Pour Over: A tökéletes csésze útmutatója",
    category: "Főzési útmutatók",
    coverImage: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop",
    readingTime: 10,
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price) + " Ft"
}

export default function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const story = storyData // In real app, fetch by slug

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = story.title

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link másolva!")
        break
    }
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero - Full bleed cover image */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Button variant="secondary" size="sm" asChild className="bg-background/80 backdrop-blur-sm">
            <Link href="/sztorik">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Vissza
            </Link>
          </Button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-secondary text-secondary-foreground">
              {story.category}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium text-white mb-4 leading-tight text-balance">
              {story.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl text-pretty">
              {story.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Meta */}
      <div className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/sztorik">Sztorik</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/sztorik?category=${story.categorySlug}`}>{story.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px]">{story.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Author & Date */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={story.author.avatar} />
                <AvatarFallback>{story.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{story.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {story.publishedAt} · {story.readingTime} perc olvasás
                </p>
              </div>
            </div>

            {/* Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Megosztás
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Link másolása
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="py-8 md:py-12">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div
            className="prose prose-lg prose-stone dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:font-medium
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-p:first-of-type:text-xl prose-p:first-of-type:md:text-2xl prose-p:first-of-type:text-foreground prose-p:first-of-type:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
              prose-blockquote:text-xl prose-blockquote:md:text-2xl prose-blockquote:font-serif
              prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:mt-2
              prose-figure:my-8 prose-figure:md:my-12
              prose-img:rounded-lg prose-img:shadow-lg
              prose-ul:text-muted-foreground prose-li:marker:text-primary
              prose-strong:text-foreground prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>
      </div>

      {/* Author bio */}
      <div className="border-t border-b">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={story.author.avatar} />
              <AvatarFallback>{story.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Írta</p>
              <p className="font-serif text-xl font-medium mb-2">{story.author.name}</p>
              <p className="text-muted-foreground">{story.author.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8">
            Kapcsolódó termékek
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product.id} href={`/kavek/${product.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <AspectRatio ratio={1}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </AspectRatio>
                    <div className="p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {product.origin}
                      </p>
                      <h3 className="font-serif text-lg font-medium group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-mono text-sm mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related stories */}
      <section className="py-12 md:py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8">
            További sztorik
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedStories.map((relatedStory) => (
              <Link key={relatedStory.id} href={`/sztorik/${relatedStory.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={relatedStory.coverImage}
                        alt={relatedStory.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                      >
                        {relatedStory.category}
                      </Badge>
                    </AspectRatio>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {relatedStory.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {relatedStory.readingTime} perc olvasás
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
