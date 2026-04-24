import ClientSessionProvider from '@/components/session-provider';

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ClientSessionProvider>{children}</ClientSessionProvider>;
}
