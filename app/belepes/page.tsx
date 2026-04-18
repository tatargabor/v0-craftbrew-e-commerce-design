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
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginSchema = z.object({
  email: z.string().email("Érvénytelen email cím"),
  password: z.string().min(1, "Add meg a jelszavad"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: LoginFormData) {
    setAuthError(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo: simulate auth failure for specific email
    if (data.email === "fail@test.com") {
      setAuthError("Érvénytelen email vagy jelszó")
      return
    }
    
    // Success - redirect
    router.push("/")
  }

  return (
    <AuthLayout>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-1 px-0">
          <CardTitle className="text-3xl font-serif font-bold text-foreground">
            Bejelentkezés
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Üdv újra! Jelentkezz be a fiókodba.
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Jelszó</FormLabel>
                      <Link
                        href={ROUTES.passwordReset}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Elfelejtett jelszó?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <Label className="text-sm font-normal cursor-pointer">
                      Emlékezz rám
                    </Label>
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
                    Bejelentkezés...
                  </>
                ) : (
                  "Bejelentkezés"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
                Nincs még fiókod?
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full mt-6"
              size="lg"
              asChild
            >
              <Link href={ROUTES.register}>
                Regisztráció
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
