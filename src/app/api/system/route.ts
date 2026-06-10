import { NextResponse } from "next/server";
import os from "os";

// GET /api/system - Retorna informações do sistema operacional
export async function GET() {

  try {

    // Calcula memória total em GB
    const totalMemory =
      os.totalmem() / 1024 / 1024 / 1024;

    // Obtém número de cores do CPU
    const cpuCores =
      os.cpus().length;

    // Tenta obter o ID do container a partir do hostname
    const maybeContainerId = os.hostname();
    let hostname = "None";

    // Valida se o hostname é um ID de container válido (hex com 6+ caracteres)
    if (
      maybeContainerId &&
      /^[0-9a-fA-F]{6,}$/.test(maybeContainerId)
    ) {
      hostname = maybeContainerId;
    }

    // Retorna informações do sistema
    return NextResponse.json({
      hostname,
      cpuCores,
      totalMemory:
        `${totalMemory.toFixed(2)} GB`,
    });

  } catch {

    return NextResponse.json(
      {
        error: {
          code: 500,
          message:
            "Error getting system info",
        },
      },
      {
        status: 500,
      }
    );

  }
}