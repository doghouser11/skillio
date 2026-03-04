'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, Users, Phone, Mail, Globe, ArrowLeft } from 'lucide-react'

interface Activity {
  id: string
  title: string
  description: string
  category: string
  age_min: number
  age_max: number
  price_monthly: number
  school: {
    id: string
    name: string
    phone?: string
    email?: string
    address?: string
    neighborhood: {
      name: string
      city: string
    }
  }
}

export default function ActivityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activityId = params.id as string

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/${activityId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setActivity(data)
      } catch (err) {
        console.error('Error fetching activity:', err)
        setError('Не можахме да заредим дейността. Моля опитайте отново.')
      } finally {
        setLoading(false)
      }
    }

    if (activityId) {
      fetchActivity()
    }
  }, [activityId])

  const handleInterestClick = () => {
    // TODO: Implement interest/contact functionality
    alert('Функционалността за контакт ще бъде добавена скоро!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Възникна грешка
            </h2>
            <p className="text-red-600 mb-4">
              {error || 'Дейността не беше намерена.'}
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Връщане към началната страница
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Activity details - main column */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {activity.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {activity.category}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {activity.age_min}-{activity.age_max} год.
                      </Badge>
                    </div>
                  </div>
                  
                  {activity.price_monthly && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {activity.price_monthly} лв.
                      </div>
                      <div className="text-sm text-gray-500">месечно</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {activity.description || 'Няма налично описание.'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Детайли</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Възраст: {activity.age_min}-{activity.age_max} години
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {activity.school.neighborhood.name}, {activity.school.neighborhood.city}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* School info - sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Предлага се от</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{activity.school.name}</h3>
                  {activity.school.address && (
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {activity.school.address}
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Контакти</h4>
                  
                  {activity.school.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`tel:${activity.school.phone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {activity.school.phone}
                      </a>
                    </div>
                  )}
                  
                  {activity.school.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`mailto:${activity.school.email}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {activity.school.email}
                      </a>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleInterestClick}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Проявявам интерес
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}