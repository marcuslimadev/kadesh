// Logger simples em memória
class MemoryLogger {
  constructor(maxLogs = 1000) {
    this.logs = [];
    this.maxLogs = maxLogs;
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      id: Date.now() + Math.random()
    };

    this.logs.push(logEntry);

    // Manter apenas os últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Também printar no console padrão
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    if (level === 'error') {
      console.error(logMessage, data);
    } else if (level === 'warn') {
      console.warn(logMessage, data);
    } else {
      console.log(logMessage, data);
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  getLogs(options = {}) {
    const {
      level = null,
      limit = 100,
      since = null
    } = options;

    let filtered = [...this.logs];

    // Filtrar por nível
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    // Filtrar por timestamp
    if (since) {
      const sinceDate = new Date(since);
      filtered = filtered.filter(log => new Date(log.timestamp) > sinceDate);
    }

    // Ordenar do mais recente para o mais antigo
    filtered.reverse();

    // Limitar quantidade
    return filtered.slice(0, limit);
  }

  clearLogs() {
    const count = this.logs.length;
    this.logs = [];
    return count;
  }

  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {}
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    });

    return stats;
  }
}

// Instância singleton
const logger = new MemoryLogger(2000); // Mantém últimos 2000 logs

module.exports = logger;
