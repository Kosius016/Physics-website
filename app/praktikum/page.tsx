import { permanentRedirect } from "next/navigation";

export default function PracticumPage() {
  permanentRedirect("/materiali?subject=physics&level=university&type=praktikum");
}
