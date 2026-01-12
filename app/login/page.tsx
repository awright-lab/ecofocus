import LoginForm from "./LoginForm";

export default function LoginPage({ searchParams }: any) {
  const redirectParam = searchParams?.redirect;
  const redirect = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam || "/portal";
  return <LoginForm redirect={redirect} />;
}
