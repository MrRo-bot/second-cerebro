import { redirect } from "next/navigation";

export default function Default() {
  redirect("/dashboard/settings/sessions");
}
