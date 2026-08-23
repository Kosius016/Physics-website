import { permanentRedirect } from "next/navigation";

export default function PracticumPage() {
  permanentRedirect("/materiali?type=praktikum");
}
