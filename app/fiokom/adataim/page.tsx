"use client"

import { useState } from "react"
import { Check, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export default function AdataimPage() {
  // Profile form state
  const [fullName, setFullName] = useState("Kovács Anna")
  const [email] = useState("anna.kovacs@email.hu")
  const [language, setLanguage] = useState<"hu" | "en">("hu")
  const [newsletters, setNewsletters] = useState({
    weekly: true,
    newProducts: true,
    promotions: false,
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Password form state
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const handleProfileSave = async () => {
    setProfileSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setProfileSaving(false)
    setProfileSaved(true)
    toast.success("Adatok mentve")
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const validatePassword = () => {
    const errors: typeof passwordErrors = {}

    if (!oldPassword) {
      errors.oldPassword = "Add meg a jelenlegi jelszavad"
    }

    if (!newPassword) {
      errors.newPassword = "Add meg az új jelszót"
    } else if (newPassword.length < 8) {
      errors.newPassword = "Legalább 8 karakter szükséges"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Erősítsd meg az új jelszót"
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "A jelszavak nem egyeznek"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordChange = async () => {
    if (!validatePassword()) return

    setPasswordSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate wrong old password error
    if (oldPassword === "wrong") {
      setPasswordErrors({ oldPassword: "Hibás jelenlegi jelszó" })
      setPasswordSaving(false)
      return
    }

    setPasswordSaving(false)
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordOpen(false)
    toast.success("Jelszó sikeresen módosítva")
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Adataim
        </h1>
        <p className="text-muted-foreground">
          Személyes adataid és beállításaid kezelése
        </p>
      </div>

      <Separator />

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Profil adatok</CardTitle>
          <CardDescription>
            Frissítsd a személyes adataidat és preferenciáidat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Teljes név</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Pl. Kovács Anna"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email cím</Label>
            <div className="relative">
              <Input
                id="email"
                value={email}
                readOnly
                className="pr-10 bg-muted/50 cursor-not-allowed"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Az email cím módosításához vedd fel velünk a kapcsolatot
            </p>
          </div>

          {/* Language Toggle */}
          <div className="space-y-3">
            <Label>Nyelv</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={language === "hu" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("hu")}
                className="w-20"
              >
                Magyar
              </Button>
              <Button
                type="button"
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
                className="w-20"
              >
                English
              </Button>
            </div>
          </div>

          {/* Newsletter Preferences */}
          <div className="space-y-4">
            <Label>Hírlevél preferenciák</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="weekly"
                  checked={newsletters.weekly}
                  onCheckedChange={(checked) =>
                    setNewsletters((prev) => ({ ...prev, weekly: !!checked }))
                  }
                />
                <Label htmlFor="weekly" className="font-normal cursor-pointer">
                  Heti kávéajánlatok és szakmai tippek
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="newProducts"
                  checked={newsletters.newProducts}
                  onCheckedChange={(checked) =>
                    setNewsletters((prev) => ({ ...prev, newProducts: !!checked }))
                  }
                />
                <Label htmlFor="newProducts" className="font-normal cursor-pointer">
                  Új termékek és limitált kiadások
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="promotions"
                  checked={newsletters.promotions}
                  onCheckedChange={(checked) =>
                    setNewsletters((prev) => ({ ...prev, promotions: !!checked }))
                  }
                />
                <Label htmlFor="promotions" className="font-normal cursor-pointer">
                  Promóciók és kedvezmények
                </Label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              onClick={handleProfileSave}
              disabled={profileSaving}
              className="min-w-32"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mentés...
                </>
              ) : profileSaved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Mentve
                </>
              ) : (
                "Mentés"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <Collapsible open={passwordOpen} onOpenChange={setPasswordOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium">
                    Jelszó módosítása
                  </CardTitle>
                  <CardDescription>
                    Változtasd meg a fiókod jelszavát
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  {passwordOpen ? "Bezárás" : "Megnyitás"}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6 pt-0">
              <Separator className="mb-6" />

              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Jelenlegi jelszó</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value)
                      setPasswordErrors((prev) => ({ ...prev, oldPassword: undefined }))
                    }}
                    className={cn(
                      "pr-10",
                      passwordErrors.oldPassword && "border-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Új jelszó</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }))
                    }}
                    className={cn(
                      "pr-10",
                      passwordErrors.newPassword && "border-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.newPassword ? (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Legalább 8 karakter</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    className={cn(
                      "pr-10",
                      passwordErrors.confirmPassword && "border-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {/* Change Button */}
              <div className="pt-2">
                <Button
                  onClick={handlePasswordChange}
                  disabled={passwordSaving}
                  className="min-w-32"
                >
                  {passwordSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Módosítás...
                    </>
                  ) : (
                    "Módosítás"
                  )}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
