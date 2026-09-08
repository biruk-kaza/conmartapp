// =============================================================================
// ConMart — Register Form (Client Component)
// =============================================================================
// Registration form with role selection (BUYER or SELLER).
// Uses React Hook Form + Zod for validation.
// Creates both a Supabase Auth user and a database user record.
// Fully bilingual English & Amharic.
// =============================================================================

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Building2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/form-alert";

import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { signUp } from "@/app/actions/auth";
import { useLanguage } from "@/lib/i18n/language-context";

export function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      companyName: "",
      role: "BUYER",
    },
  });

  // `useWatch` rather than `watch("role")`: the latter hands back a function
  // the React Compiler cannot memoize, so it bails out of optimizing this
  // component entirely.
  const selectedRole = useWatch({ control, name: "role" });

  function onSubmit(data: RegisterFormData) {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      formData.set("confirmPassword", data.confirmPassword);
      formData.set("name", data.name);
      formData.set("phone", data.phone);
      formData.set("companyName", data.companyName);
      formData.set("role", data.role);

      const result = await signUp(formData);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      router.push(result.data.redirectUrl);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="heading-display text-2xl text-foreground">
          {t("auth_register_title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("auth_register_subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormAlert>{serverError}</FormAlert>

          {/* --- Role Selection --- */}
          <div className="space-y-2">
            <Label>{t("auth_role_label")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("role", "BUYER")}
                aria-pressed={selectedRole === "BUYER"}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center text-xs font-semibold transition-all ${
                  selectedRole === "BUYER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="line-clamp-2">{t("auth_role_buyer")}</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "SELLER")}
                aria-pressed={selectedRole === "SELLER"}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center text-xs font-semibold transition-all ${
                  selectedRole === "SELLER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span className="line-clamp-2">{t("auth_role_seller")}</span>
              </button>
            </div>
            {/* Hidden input for form registration */}
            <input type="hidden" {...register("role")} />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* --- Name Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-name">{t("auth_name_label")}</Label>
            <Input
              id="reg-name"
              placeholder={t("auth_name_placeholder")}
              autoComplete="name"
              disabled={isPending}
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* --- Company Name Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-company">{t("auth_company_label")}</Label>
            <Input
              id="reg-company"
              placeholder={t("auth_company_placeholder")}
              disabled={isPending}
              {...register("companyName")}
              aria-invalid={!!errors.companyName}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* --- Phone Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-phone">{t("auth_phone_label")}</Label>
            <Input
              id="reg-phone"
              type="tel"
              placeholder="+251 91 234 5678"
              autoComplete="tel"
              disabled={isPending}
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* --- Email Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-email">{t("auth_email_label")}</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder={t("auth_email_placeholder")}
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* --- Password Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-password">{t("auth_password_label")}</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* --- Confirm Password Field --- */}
          <div className="space-y-2">
            <Label htmlFor="reg-confirm">{t("auth_confirm_password_label")}</Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          size="lg"
          loading={isPending}
          loadingLabel={t("auth_btn_registering")}
        >
          <UserPlus />
          {t("auth_btn_register")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth_have_account")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("auth_sign_in_link")}
          </Link>
        </p>
      </form>
    </div>
  );
}
