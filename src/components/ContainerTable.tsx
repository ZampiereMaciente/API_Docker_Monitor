"use client";

import { useState } from "react";

import { Container } from "@/types/container";
import StatusBadge from "./StatusBadge";

type Props = {
  containers: Container[];
};

// Tipo que representa um problema detectado nos logs do container
type IssueItem = {
  emoji: string;
  title: string;
  severity: "info" | "warning" | "critical";
  message: string;
  suggestion: string;
};

// Lista de problemas encontrados
type Analysis = IssueItem[];

export default function ContainerTable({
  containers,
}: Props) {

  // Armazena logs brutos do container selecionado
  const [selectedLogs, setSelectedLogs] =
    useState("");

  // Armazena lista de problemas detectados
  const [analysis, setAnalysis] =
    useState<Analysis>([]);

  // Controla se o modal está aberto
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Busca logs do container na API e executa análise inteligente
  async function openLogs(
    containerId: string
  ) {

    try {

      // Chama a API para obter logs + análise
      const response =
        await fetch(
          `/api/containers/${containerId}/logs`
        );

      const data =
        await response.json();

      // Armazena os logs e análise para exibir no modal
      setSelectedLogs(data.logs);

      setAnalysis(data.analysis);

      // Abre o modal
      setIsModalOpen(true);

    } catch (error) {

      console.error(error);

    }
  }

  return (
    <>

      <div
        className="
          bg-slate-800/80
          text-white
          rounded-xl
          shadow
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-slate-700/40
              text-slate-200
              uppercase
              text-sm
            "
          >

            <tr>

              <th className="text-left p-4">
                Container
              </th>

              <th className="text-left p-4">
                Image
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                CPU
              </th>

              <th className="text-left p-4">
                RAM
              </th>

              <th className="text-left p-4">
                Logs
              </th>

            </tr>

          </thead>

          <tbody>

            {containers.map((container) => (

              <tr
                key={container.id}
                className="
                  border-t
                  border-slate-700
                  hover:bg-slate-700
                  transition
                "
              >

                <td
                  className="
                    p-4
                    font-medium
                    text-slate-100
                  "
                >
                  {container.name}
                </td>

                <td
                  className="
                    p-4
                    text-slate-300
                  "
                >
                  {container.image}
                </td>

                <td className="p-4">

                  <StatusBadge
                    status={container.status}
                  />

                </td>

                <td
                  className="
                    p-4
                    text-slate-300
                  "
                >
                  {container.cpu}
                </td>

                <td
                  className="
                    p-4
                    text-slate-300
                  "
                >
                  {container.ram}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      openLogs(container.id)
                    }
                    className="
                      bg-slate-600
                      hover:bg-slate-500
                      px-3
                      py-1
                      rounded-lg
                      text-sm
                      transition
                    "
                  >
                    Logs
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {
        isModalOpen && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              z-50
            "
          >

            <div
              className="
                bg-slate-900
                w-[80%]
                max-h-[80vh]
                rounded-2xl
                p-6
                overflow-auto
                shadow-2xl
              "
            >

              {/* HEADER */}
              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    Container Logs
                  </h2>

                  <p
                    className="
                      text-slate-400
                      mt-1
                    "
                  >
                    Intelligent log analysis
                  </p>

                </div>

                <button
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="
                    bg-red-600
                    hover:bg-red-500
                    px-3
                    py-1
                    rounded-lg
                    text-white
                    transition
                  "
                >
                  Close
                </button>

              </div>

              {/* Exibe análise inteligente se houver problemas detectados */}
              {
                analysis.length > 0 && (
                  <div className="space-y-4">
                    {/* Itera sobre cada problema encontrado */}
                    {analysis.map((issue, index) => (
                      <div
                        key={index}
                        className={`
                          mb-6
                          p-5
                          rounded-2xl
                          border

                          ${
                            issue.severity === "critical"
                              ? `
                                bg-red-500/10
                                border-red-500/20
                              `
                              : issue.severity === "warning"
                              ? `
                                bg-amber-500/10
                                border-amber-500/20
                              `
                              : `
                                bg-emerald-500/10
                                border-emerald-500/20
                              `
                          }
                        `}
                      >

                        <div className="space-y-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="text-3xl"
                            >
                              {issue.emoji}
                            </div>

                            <h3
                              className={`
                                text-xl
                                font-bold

                                ${
                                  issue.severity === "critical"
                                    ? "text-red-300"
                                    : issue.severity === "warning"
                                    ? "text-amber-300"
                                    : "text-emerald-300"
                                }
                              `}
                            >
                              {issue.title}
                            </h3>

                          </div>

                          <p
                            className="
                              text-slate-200
                            "
                          >
                            {issue.message}
                          </p>

                          <div
                            className="
                              bg-black/20
                              border
                              border-white/10
                              rounded-xl
                              p-4
                            "
                          >

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-wider
                                text-slate-400
                                mb-2
                              "
                            >
                              Suggested Fix
                            </p>

                            <p
                              className="
                                text-slate-100
                              "
                            >
                              {issue.suggestion}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))}
                  </div>

                )
              }

              {/* RAW LOGS */}
              <div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >

                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-slate-300
                    "
                  >
                    Raw Logs
                  </h3>

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Docker output
                  </span>

                </div>

                <pre
                  className="
                    text-sm
                    text-green-400
                    whitespace-pre-wrap
                    bg-black/30
                    p-4
                    rounded-xl
                    overflow-auto
                    max-h-[50vh]
                  "
                >
                  {selectedLogs || "No logs available."}
                </pre>

              </div>

            </div>

          </div>

        )
      }

    </>
  );
}