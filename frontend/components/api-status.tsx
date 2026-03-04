'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { checkAPIHealth, formatHealthStatus, type APIStatus } from '@/lib/api-health'

interface APIStatusProps {
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function APIStatusCard({ 
  showDetails = true, 
  autoRefresh = true,
  refreshInterval = 30000 
}: APIStatusProps) {
  const [status, setStatus] = useState<APIStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const health = await checkAPIHealth()
      setStatus(health)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh effect
  React.useEffect(() => {
    checkHealth() // Initial check
    
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(checkHealth, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusIcon = (healthy: boolean) => {
    if (loading) return <RefreshCw className="w-4 h-4 animate-spin" />
    return healthy ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />
  }

  const getStatusBadge = (healthy: boolean) => {
    if (loading) return <Badge variant="secondary">Проверява...</Badge>
    return healthy ? 
      <Badge className="bg-green-100 text-green-800">Работи</Badge> : 
      <Badge className="bg-red-100 text-red-800">Проблем</Badge>
  }

  const formatLatency = (latency?: number) => {
    if (!latency) return 'N/A'
    if (latency < 100) return `${latency}ms`
    if (latency < 1000) return `${latency}ms`
    return `${(latency / 1000).toFixed(1)}s`
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status?.isHealthy ?? false)}
            <CardTitle className="text-lg">API Статус</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(status?.isHealthy ?? false)}
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkHealth}
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Провери
            </Button>
          </div>
        </div>
        <CardDescription>
          {status ? formatHealthStatus(status) : 'Още не е проверявано'}
        </CardDescription>
      </CardHeader>

      {showDetails && status && (
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Детайли на endpoint-ите</h4>
            
            {Object.entries(status.endpoints).map(([name, result]) => (
              <div key={name} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  {result?.status === 'ok' ? 
                    <CheckCircle className="w-3 h-3 text-green-600" /> : 
                    <XCircle className="w-3 h-3 text-red-600" />
                  }
                  <span className="text-sm font-mono">/{name}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {result?.latency && (
                    <>
                      <Clock className="w-3 h-3" />
                      {formatLatency(result.latency)}
                    </>
                  )}
                  {result?.status === 'error' && result.error && (
                    <span className="text-red-600 max-w-40 truncate" title={result.error}>
                      {result.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {lastChecked && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              Последна проверка: {lastChecked.toLocaleTimeString('bg-BG')}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}