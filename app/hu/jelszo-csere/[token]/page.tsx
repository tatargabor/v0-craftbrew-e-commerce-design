"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Minimum 8 karakter"),
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "A jelszavak nem egyeznek",
  path: ["passwordConfirm"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

type TokenStatus = "loading" | "valid" | "expired" | "success"

export default function PasswordResetPage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading")
  
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  })

  const { isSubmitting } = form.formState

  // Simulate token validation
  useEffect(() => {
    const validateToken = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo: "expired" token simulates expired state
      if (resolvedParams.token === "expired") {
        setTokenStatus("expired")
      } else {
        setTokenStatus("valid")
      }
    }
    
    validateToken()
  }, [resolvedParams.token])

  async function onSubmit(data: ResetPasswordFormData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTokenStatus("success")
  }

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80"
      imageAlt="Kávé"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <AnimatePresence mode="wait">
          {tokenStatus === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Link ellenőrzése...</p>
            </motion.div>
          )}

          {tokenStatus === "expired" && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-4 px-0 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center"
                >
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl font-serif font-bold text-foreground">
                    Link lejárt
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    Ez a jelszó visszaállítási link már nem érvényes. 
                    Kérj egy új linket a jelszó visszaállításához.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-0 pt-4">
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/hu/jelszo-csere">
                      Új link kérése
                    </Link>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full"
                    asChild
                  >
                    <Link href="/hu/belepes">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Vissza a bejelentkezéshez
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {tokenStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-4 px-0 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl font-serif font-bold text-foreground">
                    Jelszó frissítve!
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    Az új jelszavad sikeresen beállítva. 
                    Most már bejelentkezhetsz.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-0 pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link href="/hu/belepes">
                    Bejelentkezés
                  </Link>
                </Button>
              </CardContent>
            </motion.div>
          )}

          {tokenStatus === "valid" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-3xl font-serif font-bold text-foreground">
                  Új jelszó beállítása
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Add meg az új jelszavad.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Új jelszó</FormLabel>
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

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mentés...
                        </>
                      ) : (
                        "Mentés"
                      )}
                    </Button>
                  </form>
                </Form>

                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  asChild
                >
                  <Link href="/hu/belepes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vissza a bejelentkezéshez
                  </Link>
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </AuthLayout>
  )
}
