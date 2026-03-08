'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { APIStatusCard } from '@/components/api-status'
import { checkAPIHealth, checkEndpoint, pingAPI, type APIStatus } from '@/lib/api-health'

export default function APIHealthTestPage() {
  const [pingResult, setPingResult] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<{
    timestamp: Date
    results: any[]
  } | null>(null)

  const API_BASE_URL = 'https://api.skillio.live'

  const runQuickPing = async () => {
    setLoading(true)
    try {
      const result = await pingAPI()
      setPingResult(result)
    } catch (error) {
      console.error('Ping failed:', error)
      setPingResult(false)
    } finally {
      setLoading(false)
    }
  }

  const runFullTest = async () => {
    setLoading(true)
    try {
      // Test different endpoints
      const endpoints = [
        { name: 'Base API', url: `${API_BASE_URL}/` },
        { name: 'Activities List', url: `${API_BASE_URL}/api/activities` },
        { name: 'Neighborhoods', url: `${API_BASE_URL}/api/neighborhoods` },
        { name: 'Schools', url: `${API_BASE_URL}/api/schools` }
      ]

      const results = await Promise.all(
        endpoints.map(async (endpoint) => ({
          ...endpoint,
          result: await checkEndpoint(endpoint.url)
        }))
      )

      setTestResults({
        timestamp: new Date(),
        results
      })
    } catch (error) {
      console.error('Full test failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-ping on page load
  useEffect(() => {
    runQuickPing()
  }, [])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const formatLatency = (latency?: number) => {
    if (!latency) return 'N/A'
    return `${latency}ms`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">API Health Check</h1>
          <p className="text-gray-600">
            Тестване на връзката между Vercel frontend и api.skillio.live
          </p>
        </div>

        {/* Quick status card */}
        <APIStatusCard showDetails={true} />

        {/* Configuration info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Конфигурация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Base URL:</span>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {API_BASE_URL}
                </code>
                <a 
                  href={API_BASE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Environment:</span>
              <Badge variant="outline">
                {process.env.NODE_ENV || 'development'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick ping test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Бързи тест (Ping)</CardTitle>
              <Button 
                onClick={runQuickPing}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Ping
              </Button>
            </div>
            <CardDescription>
              Основна проверка за достъпност на API-то
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pingResult !== null && (
              <div className="flex items-center space-x-2">
                {pingResult ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">✅ API e достъпно</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">❌ API не отговаря</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Пълен тест</CardTitle>
              <Button 
                onClick={runFullTest}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Започни тест
              </Button>
            </div>
            <CardDescription>
              Детайлна проверка на всички endpoint-и
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Последен тест: {testResults.timestamp.toLocaleString('bg-BG')}
                </div>
                
                <div className="space-y-2">
                  {testResults.results.map((test, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center space-x-3">
                        {test.result.status === 'ok' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-500">{test.url}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-medium ${getStatusColor(test.result.status)}`}>
                          {test.result.status === 'ok' ? 'OK' : 'ГРЕШКА'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatLatency(test.result.latency)}
                        </div>
                        {test.result.error && (
                          <div className="text-xs text-red-600 max-w-48 truncate" title={test.result.error}>
                            {test.result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Ако API не е достъпно:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Проверете дали api.skillio.live работи в браузъра</li>
                <li>• Проверете CORS настройките на backend-а</li>
                <li>• Проверете NEXT_PUBLIC_API_URL в Vercel env vars</li>
                <li>• Проверете SSL сертификатите</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Ако има бавни отговори:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Cold start на backend сървъра (първо заявка)</li>
                <li>• Мрежови проблеми</li>
                <li>• Database connection issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}