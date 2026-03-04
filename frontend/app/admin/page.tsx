'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  School, 
  Activity, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  AlertTriangle
} from 'lucide-react'

interface AdminStats {
  users: {
    total: number
    parents: number
    schools: number
    new_this_week: number
  }
  schools: {
    total: number
    pending: number
    approved: number
    rejected: number
    new_this_week: number
  }
  activities: {
    total: number
    verified: number
    new_this_week: number
  }
  leads: {
    total: number
    new: number
  }
}

interface PendingSchool {
  id: string
  name: string
  description: string
  phone?: string
  email?: string
  website?: string
  city: string
  address?: string
  status: string
  created_at: string
  created_by_user: {
    email: string
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pendingSchools, setPendingSchools] = useState<PendingSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`)
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Няма достъп. Нужни са админ права.')
    }
  }

  const fetchPendingSchools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/schools/pending`)
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setPendingSchools(data)
    } catch (error) {
      console.error('Error fetching pending schools:', error)
    }
  }

  const handleSchoolApproval = async (schoolId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/schools/${schoolId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Failed to update')
      
      // Refresh data
      await fetchPendingSchools()
      await fetchStats()
    } catch (error) {
      console.error('Error updating school status:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchPendingSchools()])
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Грешка в достъпа
            </h2>
            <p className="text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Админ панел</h1>
          <p className="text-gray-600">Управление на потребители и агенции</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            
            {/* Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Потребители</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.users.parents} родители, {stats.users.schools} агенции
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.users.new_this_week} тази седмица
                </p>
              </CardContent>
            </Card>

            {/* Schools Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Агенции</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.schools.approved}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.schools.pending} чакащи одобрение
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.schools.new_this_week} тази седмица
                </p>
              </CardContent>
            </Card>

            {/* Activities Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Дейности</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activities.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activities.verified} верифицирани
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.activities.new_this_week} тази седмица
                </p>
              </CardContent>
            </Card>

            {/* Leads Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заявки</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.leads.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.leads.new} нови заявки
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Чакащи одобрение ({pendingSchools.length})</TabsTrigger>
            <TabsTrigger value="users">Потребители</TabsTrigger>
            <TabsTrigger value="activities">Дейности</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Pending Schools Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Агенции чакащи одобрение</CardTitle>
                <CardDescription>
                  Нови регистрации на учители/треньори/агенции за одобрение
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingSchools.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Няма агенции чакащи одобрение
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingSchools.map((school) => (
                      <div key={school.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{school.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{school.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Град:</span> {school.city}
                              </div>
                              {school.phone && (
                                <div>
                                  <span className="font-medium">Телефон:</span> {school.phone}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Email:</span> {school.created_by_user.email}
                              </div>
                              {school.website && (
                                <div>
                                  <span className="font-medium">Сайт:</span> 
                                  <a href={school.website} target="_blank" rel="noopener noreferrer" 
                                     className="text-blue-600 hover:underline ml-1">
                                    {school.website}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                              Подадена: {new Date(school.created_at).toLocaleDateString('bg-BG')}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSchoolApproval(school.id, 'APPROVED')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Одобри
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSchoolApproval(school.id, 'REJECTED')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Отхвърли
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs - placeholder for now */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление на потребители</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Ще бъде добавено скоро...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Управление на дейности</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Ще бъде добавено скоро...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Аналитика</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Ще бъде добавено скоро...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}