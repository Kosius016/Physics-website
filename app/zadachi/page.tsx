import { permanentRedirect } from "next/navigation";

export default function ProblemSetsPage() {
  permanentRedirect("/materiali?type=zadachi");
}
