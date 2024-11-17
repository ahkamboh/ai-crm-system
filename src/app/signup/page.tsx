import type { Metadata } from "next";
import Signup from "../components/Registration/Signup";
export const metadata: Metadata = {
  title: "Sign up",
  description: "Login or create new account",
};
function Page() {

  return (
    <>
    <Signup/>
    </>
  );
}
export default Page;
