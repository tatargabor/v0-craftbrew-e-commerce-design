"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const registerSchema = z.object({
  name: z.string().min(2, "Add meg a teljes neved"),
  email: z.string().email("Érvénytelen email cím"),
  password: z.string().min(8, "Minimum 8 karakter"),
  passwordConfirm: z.string(),
  language: z.enum(["hu", "en"]),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "El kell fogadnod az ÁSZF-et és az Adatvédelmi szabályzatot",
  }),
}).refine(data => data.password === data.passwordConfirm, {
  message: "A jelszavak nem egyeznek",
  path: ["passwordConfirm"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      language: "hu",
      acceptTerms: false,
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: RegisterFormData) {
    setAuthError(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo: simulate email already exists
    if (data.email === "exists@test.com") {
      setAuthError("Ez az email cím már regisztrálva van")
      return
    }
    
    // Success - redirect to login
    router.push("/hu/belepes?registered=true")
  }

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80"
      imageAlt="Kávézás"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-1 px-0">
          <CardTitle className="text-3xl font-serif font-bold text-foreground">
            Regisztráció
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Hozd létre a fiókodat és fedezd fel a kávé világát.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AnimatePresence mode="wait">
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg"
                  >
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teljes név</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kovács Anna"
                        autoComplete="name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nev@email.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jelszó</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Jelszó elrejtése" : "Jelszó mutatása"}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>Minimum 8 karakter</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jelszó megerősítése</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswordConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPasswordConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPasswordConfirm ? "Jelszó elrejtése" : "Jelszó mutatása"}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nyelv</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isSubmitting}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hu" id="lang-hu" />
                          <Label htmlFor="lang-hu" className="font-normal cursor-pointer">
                            Magyar
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en" id="lang-en" />
                          <Label htmlFor="lang-en" className="font-normal cursor-pointer">
                            English
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="leading-none">
                      <Label className="text-sm font-normal cursor-pointer">
                        Elfogadom az{" "}
                        <Link href="/aszf" className="text-primary hover:underline">
                          ÁSZF
                        </Link>
                        -et és az{" "}
                        <Link href="/adatvedelem" className="text-primary hover:underline">
                          Adatvédelmi szabályzat
                        </Link>
                        ot
                      </Label>
                      <FormMessage className="mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regisztráció...
                  </>
                ) : (
                  "Regisztráció"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Van már fiókod?{" "}
            <Link
              href="/hu/belepes"
              className="text-primary font-medium hover:underline"
            >
              Bejelentkezés
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
