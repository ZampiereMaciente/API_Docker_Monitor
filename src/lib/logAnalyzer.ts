// Tipo que representa um problema detectado nos logs
export type IssueItem = {
  emoji: string;  // 🔴 crítico, 🟡 aviso, 🟢 info
  title: string;
  severity: "info" | "warning" | "critical";
  message: string;
  suggestion: string;
};

// Analisa logs do container e detecta problemas comuns
// Retorna lista de problemas encontrados
export function analyzeLogs(
  logs: string
): IssueItem[] {

  // Converte logs para lowercase para comparação case-insensitive
  const lowerLogs =
    logs.toLowerCase();
  
  // Array que acumula todos os problemas encontrados
  const issues: IssueItem[] = [];

  // ====================================
  // POSTGRES PASSWORD
  // ====================================
  if (
    lowerLogs.includes(
      "superuser password is not specified"
    )
  ) {

    issues.push({
    emoji: "🔴",
      severity: "critical",
      title:
        "Missing PostgreSQL Password",
      message:
        "Container failed because POSTGRES_PASSWORD is missing.",
      suggestion:
        "Add POSTGRES_PASSWORD to your environment variables.",
   });
  }

  // ====================================
  // PORT CONFLICT
  // ====================================
  if (
    lowerLogs.includes(
      "port is already allocated"
    )
  ) {

    issues.push({
    emoji: "🔴",
      severity: "critical",
      title: "Port Conflict",
      message:
        "Another container is already using this port.",
      suggestion:
        "Change the mapped port or stop the conflicting container.",
   });
  }

  // ====================================
  // POSTGRES HEALTHY
  // ====================================
  if (
    lowerLogs.includes(
      "database system is ready to accept connections"
    )
  ) {

    issues.push({
    emoji: "🟢",
      severity: "info",
      title:
        "PostgreSQL Healthy",
      message:
        "Database started successfully.",
      suggestion:
        "No action required.",
   });
  }

  // ====================================
  // NGINX HEALTHY
  // ====================================
  if (
    lowerLogs.includes(
      "ready for start up"
    )
  ) {

    issues.push({
    emoji: "🟢",
      severity: "info",
      title:
        "Nginx Running",
      message:
        "Nginx container initialized successfully.",
      suggestion:
        "No action required.",
   });
  }

  // ====================================
// NORMAL EXIT
// ====================================
if (
  lowerLogs.includes(
    "container finished execution"
  )
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title:
      "Container Stopped",
    message:
      "Container finished execution and stopped normally.",
    suggestion:
      "Restart the container if it should remain running continuously.",
 });
}

// ====================================
// EMPTY LOGS
// ====================================
if (
  lowerLogs.trim() === ""
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title:
      "Container Failed Before Startup",
    message:
      "The container exited before generating logs.",
    suggestion:
      "Check for port conflicts, invalid environment variables, or startup command issues.",
 });
}

// ====================================
// PORT CONFLICT
// ====================================
if (
  lowerLogs.includes("address already in use") ||
  lowerLogs.includes("port is already allocated")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Port Conflict",
    message:
      "Another container or application is already using this port.",
    suggestion:
      "Change the exposed port or stop the conflicting container.",
 });
}

// ====================================
// OUT OF MEMORY
// ====================================
if (
  lowerLogs.includes("out of memory") ||
  lowerLogs.includes("oomkilled") ||
  lowerLogs.includes("memory limit") ||
  lowerLogs.includes("killed") && lowerLogs.includes("memory")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Out Of Memory",
    message:
      "Container exceeded available memory.",
    suggestion:
      "Increase memory limits or optimize memory usage.",
 });
}

// ====================================
// DATABASE CONNECTION FAILURE
// ====================================
if (
  lowerLogs.includes("connection refused") ||
  lowerLogs.includes("could not connect to server")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Database Connection Failure",
    message:
      "Application could not connect to the database.",
    suggestion:
      "Verify database host, port, credentials, and network connectivity.",
 });
}

// ====================================
// AUTHENTICATION FAILURE
// ====================================
if (
  lowerLogs.includes("authentication failed") ||
  lowerLogs.includes("access denied") ||
  lowerLogs.includes("invalid credentials")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Authentication Failure",
    message:
      "Invalid credentials detected.",
    suggestion:
      "Verify environment variables and authentication credentials.",
 });
}

// ====================================
// DISK FULL
// ====================================
if (
  lowerLogs.includes("no space left on device")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Disk Full",
    message:
      "Host machine storage is full.",
    suggestion:
      "Remove unused Docker images, volumes, or containers.",
 });
}

// ====================================
// CRASH LOOP
// ====================================
if (
  lowerLogs.includes("restarting") ||
  lowerLogs.includes("back-off restarting") ||
  lowerLogs.includes("fatal error") ||
  lowerLogs.includes("exit 1") ||
  lowerLogs.includes("exit code: 1")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Crash Loop Detected",
    message:
      "Container is continuously restarting.",
    suggestion:
      "Inspect startup logs and validate environment variables.",
 });
}

// ====================================
// MISSING ENV VARIABLES
// ====================================
if (
  lowerLogs.includes("environment variable") &&
  lowerLogs.includes("not set")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Missing Environment Variable",
    message:
      "Required environment variables are missing.",
    suggestion:
      "Check your .env file or Docker Compose configuration.",
 });
}

// ====================================
// DNS FAILURE
// ====================================
if (
  lowerLogs.includes("temporary failure in name resolution") ||
  lowerLogs.includes("dns")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "DNS Resolution Failure",
    message:
      "Container could not resolve a hostname.",
    suggestion:
      "Verify Docker network configuration and DNS settings.",
 });
}

// ====================================
// PERMISSION DENIED
// ====================================
if (
  lowerLogs.includes("permission denied")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Permission Denied",
    message:
      "Container lacks permission to access a file or directory.",
    suggestion:
      "Verify mounted volume permissions and container user settings.",
 });
}

// ====================================
// HEALTHCHECK FAILURE
// ====================================
if (
  lowerLogs.includes("health check failed") ||
  lowerLogs.includes("unhealthy")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Healthcheck Failure",
    message:
      "Container healthcheck is failing.",
    suggestion:
      "Verify service availability and healthcheck configuration.",
 });
}

// ====================================
// NODE.JS CRASH
// ====================================
if (
  lowerLogs.includes("uncaught exception") ||
  lowerLogs.includes("node.js v")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Node.js Runtime Crash",
    message:
      "Unhandled exception detected in Node.js application.",
    suggestion:
      "Inspect stack trace and add proper exception handling.",
 });
}

// ====================================
// PYTHON EXCEPTION
// ====================================
if (
  lowerLogs.includes("traceback") ||
  lowerLogs.includes("exception")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Python Exception",
    message:
      "Unhandled Python exception detected.",
    suggestion:
      "Inspect traceback details to identify the failing module.",
 });
}

// ====================================
// JAVA OUT OF MEMORY
// ====================================
if (
  lowerLogs.includes("java.lang.outofmemoryerror")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Java Out Of Memory",
    message:
      "JVM memory limit exceeded.",
    suggestion:
      "Increase JVM heap size using -Xmx.",
 });
}

// ====================================
// REDIS CONNECTION FAILURE
// ====================================
if (
  lowerLogs.includes("redis connection") &&
  lowerLogs.includes("refused")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Redis Connection Failure",
    message:
      "Application could not connect to Redis.",
    suggestion:
      "Verify Redis container status and network configuration.",
 });
}

// ====================================
// SSL CERTIFICATE ERROR
// ====================================
if (
  lowerLogs.includes("certificate") &&
  lowerLogs.includes("failed")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "SSL Certificate Failure",
    message:
      "SSL/TLS certificate validation failed.",
    suggestion:
      "Verify certificate validity and CA configuration.",
 });
}

// ====================================
// SEGMENTATION FAULT
// ====================================
if (
  lowerLogs.includes("segmentation fault")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Segmentation Fault",
    message:
      "Application crashed due to invalid memory access.",
    suggestion:
      "Inspect native libraries or binaries.",
 });
}

// ====================================
// CONTAINER HEALTHY
// ====================================
if (
  lowerLogs.includes("ready for start up") ||
  lowerLogs.includes("ready to accept connections")
) {

  issues.push({
    emoji: "🟢",
    severity: "info",
    title: "Container Healthy",
    message:
      "Application started successfully and is accepting connections.",
    suggestion:
      "No action required.",
 });
}

// ====================================
// NGINX HEALTHY
// ====================================
if (
  lowerLogs.includes("start worker processes")
) {

  issues.push({
    emoji: "🟢",
    severity: "info",
    title: "Nginx Running",
    message:
      "Nginx initialized successfully.",
    suggestion:
      "No action required.",
 });
}

// ====================================
// CONTAINER STOPPED
// ====================================
if (
  lowerLogs.includes(
    "container finished execution"
  )
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Container Stopped",
    message:
      "Container finished execution and stopped normally.",
    suggestion:
      "Restart the container if it should remain running continuously.",
 });
}

// ====================================
// EMPTY LOGS
// ====================================
if (
  lowerLogs.trim() === ""
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Container Failed Before Startup",
    message:
      "The container exited before generating logs.",
    suggestion:
      "Check for port conflicts, invalid environment variables, or startup command issues.",
 });
}

// ====================================
// POSTGRES PASSWORD MISSING
// ====================================
if (
  lowerLogs.includes("postgres_password")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Missing PostgreSQL Password",
    message:
      "POSTGRES_PASSWORD environment variable is missing.",
    suggestion:
      "Define POSTGRES_PASSWORD in your Docker Compose or .env file.",
 });
}

// ====================================
// IMAGE NOT FOUND
// ====================================
if (
  lowerLogs.includes("pull access denied") ||
  lowerLogs.includes("image not found")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Docker Image Not Found",
    message:
      "Docker failed to pull the container image.",
    suggestion:
      "Verify image name, tag, and Docker registry access.",
 });
}

// ====================================
// MODULE NOT FOUND
// ====================================
if (
  lowerLogs.includes("module not found")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Missing Dependency",
    message:
      "Application dependency could not be found.",
    suggestion:
      "Run npm install, pip install, or verify build artifacts.",
 });
}

// ====================================
// TIMEOUT
// ====================================
if (
  lowerLogs.includes("timeout") ||
  lowerLogs.includes("timed out")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Operation Timeout",
    message:
      "A service or dependency took too long to respond.",
    suggestion:
      "Verify network latency and dependency availability.",
 });
}

// ====================================
// READ-ONLY FILESYSTEM
// ====================================
if (
  lowerLogs.includes("read-only file system")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Read-Only Filesystem",
    message:
      "Container attempted to write to a read-only filesystem.",
    suggestion:
      "Verify Docker volume mount permissions.",
 });
}

// ====================================
// TOO MANY OPEN FILES
// ====================================
if (
  lowerLogs.includes("too many open files")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Too Many Open Files",
    message:
      "The application exceeded file descriptor limits.",
    suggestion:
      "Increase ulimit settings or optimize resource handling.",
 });
}

// ====================================
// KILLED PROCESS
// ====================================
if (
  lowerLogs.includes("killed")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "Process Killed",
    message:
      "The operating system terminated the container process.",
    suggestion:
      "Check memory, CPU usage, and kernel logs.",
 });
}

// ====================================
// INVALID CONFIGURATION
// ====================================
if (
  lowerLogs.includes("invalid configuration") ||
  lowerLogs.includes("configuration error")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Invalid Configuration",
    message:
      "Application configuration contains invalid values.",
    suggestion:
      "Review configuration files and environment variables.",
 });
}

// ====================================
// API RATE LIMIT
// ====================================
if (
  lowerLogs.includes("rate limit exceeded")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "API Rate Limit Exceeded",
    message:
      "External API usage limit reached.",
    suggestion:
      "Reduce request frequency or upgrade API plan.",
 });
}

// ====================================
// SSL HANDSHAKE FAILURE
// ====================================
if (
  lowerLogs.includes("ssl handshake failed")
) {

  issues.push({
    emoji: "🔴",
    severity: "critical",
    title: "SSL Handshake Failure",
    message:
      "TLS connection negotiation failed.",
    suggestion:
      "Verify SSL certificates and supported TLS versions.",
 });
}

// ====================================
// SERVICE UNAVAILABLE
// ====================================
if (
  lowerLogs.includes("503 service unavailable")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Service Unavailable",
    message:
      "The target service is temporarily unavailable.",
    suggestion:
      "Verify upstream services and reverse proxy configuration.",
 });
}

// ====================================
// BAD GATEWAY
// ====================================
if (
  lowerLogs.includes("502 bad gateway")
) {

  issues.push({
    emoji: "🟡",
    severity: "warning",
    title: "Bad Gateway",
    message:
      "Reverse proxy received an invalid response from upstream.",
    suggestion:
      "Verify backend service availability.",
    });
  }

  // ====================================
  // GENERIC ERROR DETECTION
  // ====================================
  if (
    issues.length === 0 &&
    (lowerLogs.includes("error:") || 
     lowerLogs.includes("fatal:") ||
     lowerLogs.includes("failed to"))
  ) {

    issues.push({
      emoji: "🔴",
      severity: "critical",
      title: "Application Error Detected",
      message:
        "Container logs contain error messages.",
      suggestion:
        "Review the container logs for more details.",
    });
  }

  return issues;
}