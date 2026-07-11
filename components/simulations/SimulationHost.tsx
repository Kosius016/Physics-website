"use client";

import { useState } from "react";
import type { SimulationSection } from "@/lib/types";
import { simulationRegistry } from "./registry";

/**
 * Държи състоянието на параметрите, рендва генерични плъзгачи от дефинициите
 * в урока и подава стойностите на конкретния симулационен компонент.
 */
export default function SimulationHost({ section }: { section: SimulationSection }) {
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(section.params.map((p) => [p.key, p.defaultValue])),
  );

  const Simulation = simulationRegistry[section.componentId];
  if (!Simulation) {
    return (
      <p className="rounded-[10px] border-[1.5px] border-plus bg-plus/10 px-4 py-3 text-sm text-plus">
        Липсва симулационен компонент с id „{section.componentId}“.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Плъзгачи от дефинициите в урока */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {section.params.map((p) => (
          <div key={p.key} className="min-w-[220px] flex-1">
            <label
              htmlFor={`sim-param-${p.key}`}
              className="mb-1 flex items-baseline justify-between text-[13.5px] font-medium text-muted"
            >
              <span>{p.label}</span>
              <span className="font-bold tabular-nums text-minus">
                {params[p.key]}
                {p.unit ? ` ${p.unit}` : ""}
              </span>
            </label>
            <input
              id={`sim-param-${p.key}`}
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={params[p.key]}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [p.key]: parseFloat(e.target.value) }))
              }
              className="w-full accent-(--color-minus)"
            />
            <div className="mt-0.5 flex justify-between text-[11px] tabular-nums text-rule">
              <span>{p.min}</span>
              <span>{p.max}</span>
            </div>
          </div>
        ))}
      </div>

      <Simulation params={params} onParamsChange={setParams} />
    </div>
  );
}
