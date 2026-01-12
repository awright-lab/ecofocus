import LoginForm from "./LoginForm";
import LoginHandler from "./LoginHandler";

export default function LoginPage({ searchParams }: any) {
  const redirectParam = searchParams?.redirect;
  const redirect = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam || "/portal";

  const codeParam = searchParams?.code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

  return (
    <>
      <LoginHandler code={code} redirect={redirect} />
      <LoginForm redirect={redirect} />
    </>
  );
}
