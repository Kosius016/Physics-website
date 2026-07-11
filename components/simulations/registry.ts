import type { ComponentType } from "react";
import type { SimulationProps } from "@/lib/types";
import ProjectileMotion from "./ProjectileMotion";

/**
 * Регистър на симулационните компоненти.
 * Уроците реферират симулация по id (SimulationSection.componentId).
 */
export const simulationRegistry: Record<string, ComponentType<SimulationProps>> = {
  "projectile-motion": ProjectileMotion,
};
