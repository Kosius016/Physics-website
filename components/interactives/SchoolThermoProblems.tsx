"use client";
import GuidedProblem from "./GuidedProblem";
import { schoolThermoProblems } from "@/lib/problemSets/thermodynamicsSchool";
export default function SchoolThermoProblems({ ids }: { ids: string[] }) {
  return <div className="space-y-7">{ids.map((id, i) =>
    <div key={id} data-school-problem={id}><GuidedProblem index={i + 1} data={schoolThermoProblems[id]} /></div>
  )}</div>;
}
