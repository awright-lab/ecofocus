export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
      <p className="text-sm text-gray-600">
        Portal access requires a Supabase session. Connect your auth flow here or use your existing identity
        provider. If you were redirected, your session likely expired.
      </p>
    </div>
  );
}
