import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
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
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-center">
                Erreur d&apos;authentification
              </CardTitle>
              <CardDescription className="text-center">
                Une erreur est survenue lors de la connexion
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Le lien a peut-être expiré ou est invalide. Veuillez réessayer.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Retour à la connexion</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
