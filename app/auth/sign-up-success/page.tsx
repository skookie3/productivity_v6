import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Target, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Foc3</span>
          </div>
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">
                Vérifiez votre email
              </CardTitle>
              <CardDescription className="text-center">
                Un email de confirmation vous a été envoyé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Cliquez sur le lien dans l&apos;email pour activer votre compte
                et commencer à utiliser Foc3 sur tous vos appareils.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
