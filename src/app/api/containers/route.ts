import { NextResponse } from "next/server";
import docker from "@/lib/docker";
import {
  DockerContainer,
  ContainerStats,
  FormattedContainer,
} from "@/types/docker";

// GET /api/containers - Retorna lista de todos os containers com stats (CPU, RAM)
export async function GET() {
  try {

    // Lista todos os containers (incluindo parados)
    const containers: DockerContainer[] = (await docker.listContainers()) as unknown as DockerContainer[];

    // Processa cada container para extrair stats
    const formattedContainers: FormattedContainer[] = await Promise.all(
      containers.map(async (container: DockerContainer) => {

        const containerInstance =
          await docker.getContainer(container.Id);

        // Obtém estatísticas de CPU, RAM, etc
        const stats: ContainerStats = (await containerInstance.stats({
          stream: false,
        })) as unknown as ContainerStats;

        // Calcula percentual de memória
        const memoryUsage =
          stats.memory_stats?.usage || 0;

        const memoryLimit =
          stats.memory_stats?.limit || 1;

        const memoryPercent =
          (
            (memoryUsage / memoryLimit) *
            100
          ).toFixed(2);

        // Calcula percentual de CPU
        const cpuDelta =
          stats.cpu_stats.cpu_usage.total_usage -
          stats.precpu_stats.cpu_usage.total_usage;

        const systemDelta =
          stats.cpu_stats.system_cpu_usage -
          stats.precpu_stats.system_cpu_usage;

        const cpuPercent =
          systemDelta > 0
            ? (
                (cpuDelta / systemDelta) *
                stats.cpu_stats.online_cpus *
                100
              ).toFixed(2)
            : "0";

        // Retorna dados formatados do container
        return {
          id: container.Id,

          name:
            container.Names?.[0]?.replace("/", "") ||
            "unknown",

          image: container.Image,

          status: container.State,

          cpu: `${cpuPercent}%`,

          ram: `${memoryPercent}%`,
        } as FormattedContainer;
      })
    );

    return NextResponse.json(formattedContainers);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: {
          code: 500,
          message: "Error communicating with Docker",
        },
      },
      {
        status: 500,
      }
    );
  }
}