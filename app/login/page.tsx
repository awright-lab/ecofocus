import LoginForm from "./LoginForm";

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirect = searchParams?.redirect || "/portal";
  return <LoginForm redirect={redirect} />;
}
