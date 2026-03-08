/**
 * API Health Check utilities for Skillio
 * Verifies that api.skillio.live is accessible from Vercel frontend
 */

import React from 'react'

interface HealthCheckResult {
  status: 'ok' | 'error'
  latency?: number
  error?: string
  timestamp: number
  endpoint?: string
}

interface APIStatus {
  isHealthy: boolean
  lastCheck: HealthCheckResult | null
  endpoints: {
    base: HealthCheckResult | null
    activities: HealthCheckResult | null
    neighborhoods: HealthCheckResult | null
  }
}

const API_BASE_URL = 'https://api.skillio.live'

/**
 * Check if a single endpoint is accessible
 */
export async function checkEndpoint(
  endpoint: string, 
  timeout: number = 5000
): Promise<HealthCheckResult> {
  const startTime = Date.now()
  const timestamp = startTime
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Skillio-Frontend-Health-Check'
      }
    })
    
    clearTimeout(timeoutId)
    const latency = Date.now() - startTime
    
    if (response.ok) {
      return {
        status: 'ok',
        latency,
        timestamp,
        endpoint
      }
    } else {
      return {
        status: 'error',
        error: `HTTP ${response.status}: ${response.statusText}`,
        timestamp,
        endpoint
      }
    }
  } catch (error) {
    const latency = Date.now() - startTime
    
    if (error instanceof Error) {
      return {
        status: 'error',
        error: error.name === 'AbortError' 
          ? `Timeout after ${timeout}ms`
          : error.message,
        latency,
        timestamp,
        endpoint
      }
    }
    
    return {
      status: 'error',
      error: 'Unknown error occurred',
      latency,
      timestamp,
      endpoint
    }
  }
}

/**
 * Comprehensive API health check
 */
export async function checkAPIHealth(): Promise<APIStatus> {
  const endpoints = [
    { key: 'base', url: `${API_BASE_URL}/` },
    { key: 'activities', url: `${API_BASE_URL}/api/activities?limit=1` },
    { key: 'neighborhoods', url: `${API_BASE_URL}/api/neighborhoods` }
  ]
  
  const results = await Promise.all(
    endpoints.map(async ({ key, url }) => ({
      key,
      result: await checkEndpoint(url)
    }))
  )
  
  const status: APIStatus = {
    isHealthy: results.every(r => r.result.status === 'ok'),
    lastCheck: results[0]?.result || null,
    endpoints: {
      base: results.find(r => r.key === 'base')?.result || null,
      activities: results.find(r => r.key === 'activities')?.result || null,
      neighborhoods: results.find(r => r.key === 'neighborhoods')?.result || null
    }
  }
  
  return status
}

/**
 * Quick ping check for basic connectivity
 */
export async function pingAPI(): Promise<boolean> {
  try {
    const result = await checkEndpoint(`${API_BASE_URL}/`, 3000)
    return result.status === 'ok'
  } catch {
    return false
  }
}

/**
 * Format health check results for display
 */
export function formatHealthStatus(status: APIStatus): string {
  if (status.isHealthy) {
    const avgLatency = Object.values(status.endpoints)
      .filter(r => r && r.latency)
      .reduce((sum, r) => sum + (r?.latency || 0), 0) / 3
    
    return `✅ API здравословно (${Math.round(avgLatency)}ms)`
  }
  
  const errors = Object.entries(status.endpoints)
    .filter(([_, result]) => result?.status === 'error')
    .map(([key, result]) => `${key}: ${result?.error}`)
    .join(', ')
  
  return `❌ API проблеми: ${errors}`
}

/**
 * React hook for monitoring API health
 */
export function useAPIHealth(checkInterval: number = 30000) {
  const [status, setStatus] = React.useState<APIStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  const checkHealth = React.useCallback(async () => {
    try {
      const health = await checkAPIHealth()
      setStatus(health)
    } catch (error) {
      console.error('Health check failed:', error)
      setStatus({
        isHealthy: false,
        lastCheck: {
          status: 'error',
          error: 'Health check failed',
          timestamp: Date.now()
        },
        endpoints: {
          base: null,
          activities: null,
          neighborhoods: null
        }
      })
    } finally {
      setLoading(false)
    }
  }, [])
  
  React.useEffect(() => {
    checkHealth()
    
    if (checkInterval > 0) {
      const interval = setInterval(checkHealth, checkInterval)
      return () => clearInterval(interval)
    }
  }, [checkHealth, checkInterval])
  
  return { status, loading, checkHealth }
}