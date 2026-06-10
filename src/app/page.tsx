"use client";

import DashboardCard from "@/components/DashboardCard";
import ContainerTable from "@/components/ContainerTable";
import { Container } from "@/types/container";

import { useEffect, useState } from "react";

type SystemInfo = {
  hostname: string;
  cpuCores: number;
  totalMemory: string;
};

export default function Home() {

  const [containers, setContainers] =
    useState<Container[]>([]);

  const [systemInfo, setSystemInfo] =
    useState<SystemInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdate, setLastUpdate] =
    useState("");

  useEffect(() => {

    async function fetchData() {

      try {

        // Containers
        const containersResponse =
          await fetch("/api/containers");

        const containersData: Container[] =
          await containersResponse.json();

        setContainers(containersData);

        // System info
        const systemResponse =
          await fetch("/api/system");

        const systemData: SystemInfo =
          await systemResponse.json();

        setSystemInfo(systemData);

        // Last update
        setLastUpdate(
          new Date().toLocaleTimeString()
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const runningContainers = containers.filter(
    (container) =>
      container.status === "running"
  );

  const errorContainers = containers.filter(
    (container) =>
      [
        "dead",
        "restarting",
        "exited",
      ].includes(container.status)
  );

  const stoppedContainers = containers.filter(
    (container) =>
      container.status === "paused" ||
      container.status === "created"
  );

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-white
          bg-[radial-gradient(circle_at_top_left,_#172554,_transparent_35%),radial-gradient(circle_at_bottom_right,_#312e81,_transparent_35%),linear-gradient(to_bottom_right,_#020617,_#000000)]
        "
      >
        <h1 className="text-2xl font-semibold animate-pulse">
          Loading containers...
        </h1>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        text-white
        px-8
        py-6
        bg-[radial-gradient(circle_at_top_left,_#172554,_transparent_35%),radial-gradient(circle_at_bottom_right,_#312e81,_transparent_35%),linear-gradient(to_bottom_right,_#020617,_#000000)]
      "
    >

      <div className="max-w-7xl mx-auto space-y-5">

        {/* HEADER */}
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-2xl
            shadow-black/40
          "
        >

          <div className="flex items-start justify-between">

            <div>

              <h1
              className="
                text-5xl
                font-bold
                tracking-tight
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-white
                via-zinc-100
                to-blue-200
              "
              >
                Docker Monitor
              </h1>

              <p className="text-zinc-300 mt-3 text-lg">
                Real-time monitoring for Docker containers
              </p>

            </div>

            <div className="text-right">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  px-4
                  py-2
                  rounded-full
                "
              >

                <div
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-emerald-400
                    animate-pulse
                  "
                />

                <span
                  className="
                    text-emerald-300
                    text-sm
                    font-medium
                  "
                >
                  LIVE
                </span>

              </div>

              <p className="text-sm text-zinc-300 mt-3">
                Last update: {lastUpdate}
              </p>

            </div>

          </div>

        </div>

        {/* TOTAL CONTAINERS */}
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-2xl
            shadow-black/30
          "
        >

          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div>

              <p className="text-zinc-300 text-sm uppercase tracking-wider">
                Total Containers
              </p>

              <h2
                className="
                  text-5xl
                  font-bold
                  tracking-tight
                  mt-2
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-white
                  to-blue-200
                "
              >
                {containers.length}
              </h2>

            </div>

            {/* RIGHT */}
            <div
              className="
                text-right
                space-y-2
                text-zinc-200
              "
            >

              <p>
                <span className="text-zinc-400">
                  Container ID:
                </span>{" "}
                {systemInfo?.hostname}
              </p>

              <p>
                <span className="text-zinc-400">
                  CPU Cores:
                </span>{" "}
                {systemInfo?.cpuCores}
              </p>

              <p>
                <span className="text-zinc-400">
                  Total RAM:
                </span>{" "}
                {systemInfo?.totalMemory}
              </p>

            </div>

          </div>

        </div>

        {/* DASHBOARD CARDS */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          <DashboardCard
            title="Running"
            value={runningContainers.length}
            color="emerald"
          />

          <DashboardCard
            title="Stopped"
            value={stoppedContainers.length}
            color="amber"
          />

          <DashboardCard
            title="Errors"
            value={errorContainers.length}
            color="red"
          />

        </div>

        {/* TABLE */}
        <ContainerTable containers={containers} />

      </div>

    </main>
  );
}