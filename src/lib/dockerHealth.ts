// src/lib/dockerHealth.ts

import { execSync } from 'child_process';

interface DockerService {
  name: string;
  port: number;
  required: boolean;
}

const REQUIRED_SERVICES: DockerService[] = [
  { name: 'r3-postgres', port: 5432, required: true },
  { name: 'r3-redis', port: 6379, required: true }
];

export class DockerHealthCheck {
  static isDockerRunning(): boolean {
    try {
      execSync('docker info', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  static getRunningContainers(): string[] {
    try {
      const output = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf-8' });
      return output.split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  static checkService(service: DockerService): boolean {
    const running = this.getRunningContainers();
    return running.includes(service.name);
  }

  static async checkAllServices(): Promise<{ 
    ok: boolean;
    message: string;
    missingServices: string[];
  }> {
    if (!this.isDockerRunning()) {
      return {
        ok: false,
        message: 'Docker is not running. Please start Docker Desktop first.',
        missingServices: REQUIRED_SERVICES.map(s => s.name)
      };
    }

    const missingServices = REQUIRED_SERVICES.filter(
      service => !this.checkService(service)
    );

    if (missingServices.length > 0) {
      const requiredMissing = missingServices.filter(s => 
        REQUIRED_SERVICES.find(rs => rs.name === s.name)?.required
      );

      if (requiredMissing.length > 0) {
        return {
          ok: false,
          message: `Required Docker services are not running. Please run 'docker compose up -d'`,
          missingServices: requiredMissing.map(s => s.name)
        };
      }
    }

    return {
      ok: true,
      message: 'All required Docker services are running.',
      missingServices: []
    };
  }
}