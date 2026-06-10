// Docker Container Types

// Estrutura básica de um container Docker
export interface DockerContainer {
  Id: string;           // ID único do container
  Names: string[];      // Nomes atribuídos ao container
  Image: string;        // Imagem utilizada
  State: string;        // Estado (running, exited, etc)
  Status: string;       // Status detalhado
}

// Informações de memória do container
export interface MemoryStats {
  usage?: number;       // Memória em uso (bytes)
  limit?: number;       // Limite de memória (bytes)
}

// Uso de CPU
export interface CPUUsage {
  total_usage: number;  // Total de CPU usado
}

// Estatísticas de CPU do container
export interface CPUStats {
  cpu_usage: CPUUsage;
  system_cpu_usage: number;  // CPU total do sistema
  online_cpus: number;       // Número de CPUs disponíveis
}

// Estatísticas de CPU anterior (para cálculo delta)
export interface PreCPUStats {
  cpu_usage: CPUUsage;
  system_cpu_usage: number;
}

// Estatísticas completas do container
export interface ContainerStats {
  memory_stats: MemoryStats;
  cpu_stats: CPUStats;
  precpu_stats: PreCPUStats;
}

// Container formatado para retorno da API
export interface FormattedContainer {
  id: string;       // ID do container
  name: string;     // Nome do container
  image: string;    // Imagem utilizada
  status: string;   // Estado do container
  cpu: string;      // Percentual de CPU com símbolo %
  ram: string;      // Percentual de RAM com símbolo %
}

// Resultado da busca de containers
export interface SearchResult {
  id: string;
  name: string;
  image: string;
  status: string;
}
