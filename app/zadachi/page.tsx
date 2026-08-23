import { permanentRedirect } from "next/navigation";

export default function ProblemSetsPage() {
  permanentRedirect("/materiali?subject=physics&level=university&type=zadachi");
}
