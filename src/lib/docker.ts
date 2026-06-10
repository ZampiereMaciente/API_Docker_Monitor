import http from "http";
import type { ContainerStats, DockerContainer } from "@/types/docker";

const socketPath = "/var/run/docker.sock";

// Suporte a chamadas Docker: stream raw retorna Buffer, JSON retorna T ou null
async function dockerRequest(path: string, raw: true): Promise<Buffer>;
async function dockerRequest<T = Record<string, unknown>>(path: string, raw?: false): Promise<T | null>;
async function dockerRequest<T = Record<string, unknown>>(path: string, raw = false): Promise<T | Buffer | null> {
  return new Promise<T | Buffer | null>((resolve, reject) => {
    const req = http.request(
      {
        socketPath,
        path,
        method: "GET",
        headers: {
          Accept: raw ? "application/octet-stream" : "application/json",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        res.on("end", () => {
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            return reject(
              new Error(
                `Docker request failed: ${res.statusCode} ${res.statusMessage}`
              )
            );
          }

          const buffer = Buffer.concat(chunks);
          if (raw) {
            return resolve(buffer);
          }

          if (buffer.length === 0) {
            return resolve(null);
          }

          try {
            resolve(JSON.parse(buffer.toString("utf8")));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

const docker = {
  async listContainers() {
    return dockerRequest<DockerContainer[]>("/containers/json?all=true");
  },

  async getContainer(id: string) {
    return {
      async stats(opts: { stream: boolean }) {
        return dockerRequest<ContainerStats>(`/containers/${id}/stats?stream=${opts.stream}`);
      },

      async logs(opts: {
        stdout: boolean;
        stderr: boolean;
        tail: number | string;
        timestamps: boolean;
      }) {
        const query = new URLSearchParams({
          stdout: String(opts.stdout),
          stderr: String(opts.stderr),
          tail: String(opts.tail),
          timestamps: String(opts.timestamps),
        }).toString();

        return dockerRequest(`/containers/${id}/logs?${query}`, true);
      },
    };
  },

  async info() {
    return dockerRequest("/info");
  },
};

export default docker;
