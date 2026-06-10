import { NextRequest, NextResponse } from "next/server";
import docker from "@/lib/docker";
import {
  DockerContainer,
  SearchResult,
} from "@/types/docker";

// GET /api/search?name=<nome> - Busca containers por nome
export async function GET(request: NextRequest) {
  try {
    // Extrai parâmetro de busca da query string
    const searchParams = request.nextUrl.searchParams;

    const name = searchParams.get("name");

    // Valida se o parâmetro 'name' foi fornecido
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: "Parameter 'name' cannot be empty",
          },
        },
        {
          status: 400,
        }
      );
    }

    // Lista todos os containers
    const containers: DockerContainer[] = (await docker.listContainers()) ?? [];

    // Filtra containers que correspondem ao nome procurado
    const result: SearchResult[] = containers
      .filter((container: DockerContainer) =>
        container.Names?.[0]
          ?.toLowerCase()
          .includes(name.toLowerCase())
      )
      .map((container: DockerContainer) => ({
        id: container.Id,
        name: container.Names?.[0]?.replace("/", "") || "unknown",
        image: container.Image,
        status: container.State,
      }));

    // Retorna erro se nenhum container foi encontrado
    if (result.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `No containers found with name '${name}'`,
          },
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result);

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