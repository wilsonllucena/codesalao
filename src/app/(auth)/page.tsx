import { UserAuthForm } from "~/components/forms/user-auth-form";

export default function AuthenticationPage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <UserAuthForm />
        </div>
      </div>
    </>
  );
}
