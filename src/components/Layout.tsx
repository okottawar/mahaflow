"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { key: "navOverview" as const, href: "/", icon: "◉" },
  { key: "navMap" as const, href: "/map", icon: "◎" },
  { key: "navAdvisor" as const, href: "/advisor", icon: "⇢" },
  { key: "navControl" as const, href: "/control", icon: "⊞" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, state, isPaused, togglePause } = useSimulation();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1 className="sidebar-logo">MahaFlow</h1>
          <p className="sidebar-tagline">{t.appTagline}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "sidebar-link-active" : ""}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{t[item.key]}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Live Simulation Status — Prominent */}
          <div className="sim-status-block">
            <div className="sim-status-header">
              <span className={`sim-dot ${isPaused ? "sim-dot-paused" : "sim-dot-live"}`} />
              <span className="sim-status-label">{t.liveSimulation}</span>
              <button onClick={togglePause} className="sim-toggle-btn" aria-label={isPaused ? "Resume" : "Pause"}>
                {isPaused ? "▶" : "⏸"}
              </button>
            </div>
            <div className="sim-time-display">
              <span className="sim-time-value">{state.timeLabel}</span>
            </div>
            <div className="sim-meta-row">
              <span className="sim-tick">TICK #{state.tickCount}</span>
              <span className={`sim-network-status ${state.systemHealthy ? "sim-status-ok" : "sim-status-alert"}`}>
                {state.systemHealthy ? "● NOMINAL" : "● DEGRADED"}
              </span>
            </div>
          </div>

          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
