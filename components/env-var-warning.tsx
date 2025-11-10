import { getTranslations } from "next-intl/server";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export async function EnvVarWarning() {
  const t = await getTranslations();
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        {t('envVarWarning.message')}
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          {t('envVarWarning.signIn')}
        </Button>
        <Button size="sm" variant={"default"} disabled>
          {t('envVarWarning.signUp')}
        </Button>
      </div>
    </div>
  );
}
