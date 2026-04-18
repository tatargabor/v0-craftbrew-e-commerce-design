"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { AuthLayout } from "@/components/auth-layout"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const resetRequestSchema = z.object({
  email: z.string().email("Érvénytelen email cím"),
})

type ResetRequestFormData = z.infer<typeof resetRequestSchema>

export default function PasswordResetRequestPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  
  const form = useForm<ResetRequestFormData>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: ResetRequestFormData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSubmittedEmail(data.email)
    setIsSuccess(true)
  }

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80"
      imageAlt="Kávé készítés"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <AnimatePresence mode="wait">
          {isSuccess ? (
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
                    Emailt küldtünk!
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    Emailt küldtünk a megadott címre:
                    <br />
                    <span className="font-medium text-foreground">{submittedEmail}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-0 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p>Nézd meg a beérkező leveleid, és kattints a jelszó visszaállítási linkre.</p>
                        <p className="mt-2">Nem találod? Ellenőrizd a spam mappát is.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSuccess(false)
                      form.reset()
                    }}
                  >
                    Másik email cím megadása
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full"
                    asChild
                  >
                    <Link href={ROUTES.login}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Vissza a bejelentkezéshez
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-3xl font-serif font-bold text-foreground">
                  Elfelejtett jelszó
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Add meg az email címed, és küldünk egy linket a jelszó visszaállításához.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Küldés...
                        </>
                      ) : (
                        "Új jelszó kérése"
                      )}
                    </Button>
                  </form>
                </Form>

                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  asChild
                >
                  <Link href={ROUTES.login}>
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
