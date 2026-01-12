import LoginForm from "./LoginForm";

export default function LoginPage(props: { searchParams?: Record<string, string | string[] | undefined> }) {
  const redirectParam = props.searchParams?.redirect;
  const redirect = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam || "/portal";
  return <LoginForm redirect={redirect} />;
}
