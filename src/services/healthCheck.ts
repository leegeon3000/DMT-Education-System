/**
 * Health Check Service
 * Monitors backend availability and notifies user if backend is down
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const HEALTH_CHECK_INTERVAL = 30000; // Check every 30 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 second timeout

interface HealthStatus {
  isHealthy: boolean;
  lastCheck: Date;
  error?: string;
  latency?: number;
}

class HealthCheckService {
  private status: HealthStatus = {
    isHealthy: true,
    lastCheck: new Date(),
  };
  
  private listeners: ((status: HealthStatus) => void)[] = [];
  private intervalId: number | null = null;
  private isChecking = false;

  /**
   * Start monitoring backend health
   */
  start() {
    if (this.intervalId) {
      console.log('🏥 Health check already running');
      return;
    }

    console.log('🏥 Starting health check service...');
    
    // Immediate check
    this.checkHealth();
    
    // Periodic checks
    this.intervalId = window.setInterval(() => {
      this.checkHealth();
    }, HEALTH_CHECK_INTERVAL);
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🏥 Health check stopped');
    }
  }

  /**
   * Perform health check
   */
  async checkHealth(): Promise<HealthStatus> {
    if (this.isChecking) {
      return this.status;
    }

    this.isChecking = true;
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      const latency = performance.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.updateStatus({
          isHealthy: true,
          lastCheck: new Date(),
          latency,
        });
        console.log(`✅ Backend healthy (${latency.toFixed(0)}ms)`);
      } else {
        this.updateStatus({
          isHealthy: false,
          lastCheck: new Date(),
          error: `HTTP ${response.status}`,
          latency,
        });
        console.warn(`⚠️ Backend unhealthy: HTTP ${response.status}`);
      }
    } catch (error: any) {
      const latency = performance.now() - startTime;
      this.updateStatus({
        isHealthy: false,
        lastCheck: new Date(),
        error: error.name === 'AbortError' ? 'Timeout' : error.message,
        latency,
      });
      console.error('❌ Backend health check failed:', error.message);
    } finally {
      this.isChecking = false;
    }

    return this.status;
  }

  /**
   * Get current status
   */
  getStatus(): HealthStatus {
    return { ...this.status };
  }

  /**
   * Subscribe to status changes
   */
  subscribe(callback: (status: HealthStatus) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Update status and notify listeners
   */
  private updateStatus(newStatus: HealthStatus) {
    const wasHealthy = this.status.isHealthy;
    this.status = newStatus;

    // Notify listeners only on status change
    if (wasHealthy !== newStatus.isHealthy) {
      this.listeners.forEach(callback => callback(newStatus));
    }
  }

  /**
   * Check if backend is ready (includes database)
   */
  async checkReady(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ready`, {
        method: 'GET',
        signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const healthCheckService = new HealthCheckService();
export default healthCheckService;
