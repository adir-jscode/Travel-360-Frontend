import ChangePasswordForm from "@/components/modules/user/ChangePasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account&apos;s password and security settings.
        </p>
      </div>

      <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Enter your current password and choose a new one. You&apos;ll
            stay signed in on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
