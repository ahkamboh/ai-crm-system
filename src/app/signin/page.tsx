import type { Metadata } from "next";
import Signin from "../components/Registration/Signin";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Login or create new account",
};
function Page() {
 
  return (
  <>
  <Signin/>
  </>
  );
}

export default Page;
