import { NextResponse } from "next/server";
import docker from "@/lib/docker";
import { analyzeLogs, IssueItem }
from "@/lib/logAnalyzer";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type LogsResponse = {
  logs: string;
  analysis: IssueItem[];
};

// GET /api/containers/:id/logs - Retorna logs do container + análise inteligente
export async function GET(
  _request: Request,
  { params }: Params
): Promise<NextResponse<LogsResponse | { error: { code: number; message: string } }>> {

  try {

    // Extrai o ID do container da URL
    const { id } = await params;

    // Obtém a instância do container
    const container =
      await docker.getContainer(id);

    // Recupera os últimos 300 logs
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 300,
      timestamps: true,
    });

    // Garante que logs não seja null antes de converter para string
    const rawLogs =
      logs?.toString("utf8") ?? "";

    // Remove caracteres binários do Docker (BOM, control chars, etc)
    const cleanLogs = rawLogs.replace(
      /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g,
      ""
    );

    // Executa análise inteligente nos logs
    const analysis =
      analyzeLogs(cleanLogs);

    // Retorna logs limpos + análise com sugestões
    return NextResponse.json<LogsResponse>({
      logs: cleanLogs,
      analysis,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: {
          code: 500,
          message:
            "Error getting container logs",
        },
      },
      {
        status: 500,
      }
    );

  }
}