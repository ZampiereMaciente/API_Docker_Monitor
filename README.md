# 🐳 Docker Monitor 📊

> Um dashboard e em tempo real para monitoramento inteligente de containers Docker. Desenvolvido com **Next.js**, **Tailwind CSS**, **TypeScript** e **Dockerode**.

Este projeto conecta-se diretamente ao socket do Docker do host (`/var/run/docker.sock`) para fornecer telemetria em tempo real, visualização de logs e **Análise Inteligente de Erros** diretamente no seu navegador.

<p align="center">
  <img width="1387" height="780" alt="Screenshot from 2026-06-10 11-56-56" src="https://github.com/user-attachments/assets/3341b5a6-bd7e-4448-9a03-d5790898dee2" />
</p>


---

## ✨ Funcionalidades Principais

* **⚡ Telemetria em Tempo Real**: Atualizações a cada 5 segundos de consumo de **CPU** e **Memória RAM** de cada container individual.
* **📈 Métricas do Host**: Monitoramento básico da máquina host (Hostname, Núcleos de CPU e Memória RAM total disponível).
* **🧠 Analisador de Logs Inteligente (Engine Integrada)**:
  Nossa engine analítica integrada (`src/lib/logAnalyzer.ts`) inspeciona os logs do container em tempo real ao abrir a modal de logs, identificando mais de 25 padrões clássicos de falhas, incluindo:
  * Erros de configuração (ex. senha do PostgreSQL ausente).
  * Portas já alocadas e conflitos de rede.
  * Falhas de Out Of Memory (OOM) e limitação de recursos.
  * Erros de DNS e falhas de conexão de banco de dados.
  * Falhas de runtime (Node.js uncaught exceptions, Java OOM, exceções Python).
  * Problemas de permissão de arquivos e sistemas de arquivos read-only.
* **🏷️ Filtragem Dinâmica de Status**: Contagem e classificação automática de containers nos estados **Running (Ativo)**, **Stopped (Pausado/Criado)** e **Errors (Com falhas/reiniciando)**.

---

## 🚀 Como Executar o Projeto

Você pode rodar a aplicação de três formas diferentes, dependendo da sua necessidade:

### Opção 1: Via Imagem do Docker Hub (Rápido e Direto)
Esta é a forma mais rápida de rodar a aplicação pronta sem precisar baixar o código-fonte.

* **Via Docker CLI (`docker run`):**
  ```bash
  docker run -d \
    --name docker-monitor \
    -p 3000:3000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --restart unless-stopped \
    renatozampiere/rest-api-docker-monitor:latest
  ```

* **Via Docker Compose:**
  Adicione o serviço abaixo ao seu arquivo `docker-compose.yml`:
  ```yaml
  services:
    docker-monitor:
      image: renatozampiere/rest-api-docker-monitor:latest
      container_name: docker-monitor
      ports:
        - "3000:3000"
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock
      restart: unless-stopped
  ```
  E inicie com:
  ```bash
  docker compose up -d
  ```

---

### Opção 2: Via Docker Compose Local (Compilando do Código-Fonte)
Ideal se você tem o código clonado e quer subir um container Docker construído localmente na sua máquina:

1. Suba o serviço compilando a imagem local:
   ```bash
   docker compose up -d --build
   ```
2. Acesse em: [http://localhost:3000](http://localhost:3000)

---

### Opção 3: Via NPM (Desenvolvimento Local)
Ideal para desenvolvedores que querem fazer modificações no código-fonte em tempo real com hot-reload (com a aplicação rodando no seu host e conectando ao Docker local).

**Pré-requisitos:**
* **Node.js** (versão 18 ou superior) instalado no host.
* **Docker** ativo e rodando no host.

**Passo a Passo:**
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Ambiente de Teste: Simulando Falhas Reais

Para testar a capacidade de diagnóstico do seu painel, criamos o arquivo de simulação [docker-compose.test.yml].

```bash
   docker compose -f docker-compose.test.yml up -d  
```

```bash
   docker compose down --remove-orphans  
```
