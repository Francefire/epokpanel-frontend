"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveApiKeysAction } from "@/app/protected/settings/actions";
import { useTranslations } from 'next-intl';

interface SettingsFormProps {
  initialApiKey?: string;
  initialStoreUrl?: string;
}

export function SettingsForm({ initialApiKey, initialStoreUrl }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const t = useTranslations('settings.apiConfiguration');

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    
    startTransition(async () => {
      const result = await saveApiKeysAction(formData);
      
      if (result.success) {
        setMessage({
          type: "success",
          text: t('successMessage'),
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || t('errorMessage'),
        });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">{t('apiKey')}</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          placeholder={t('apiKeyPlaceholder')}
          defaultValue={initialApiKey}
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="storeUrl">{t('storeUrl')}</Label>
        <Input
          id="storeUrl"
          name="storeUrl"
          type="url"
          placeholder={t('storeUrlPlaceholder')}
          defaultValue={initialStoreUrl}
          required
          disabled={isPending}
        />
      </div>
      
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
      
      <Button type="submit" disabled={isPending}>
        {isPending ? t('saving') : t('saveButton')}
      </Button>
    </form>
  );
}
