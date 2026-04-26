import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-0.5">Vos conversations avec artisans et clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messagerie</CardTitle>
          <CardDescription>
            Communiquez directement avec vos interlocuteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-lg">Bientôt disponible</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              La messagerie intégrée vous permettra de discuter directement
              avec vos artisans ou clients, partager des photos et des documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
