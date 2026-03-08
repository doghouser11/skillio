'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, User, MessageSquare } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  parent: {
    id: string
    email: string
  }
}

interface RatingSystemProps {
  schoolId: string
  reviews: Review[]
  averageRating?: number
  canAddReview?: boolean
  onReviewAdded?: () => void
}

interface NewReview {
  rating: number
  comment: string
}

export function RatingSystem({ 
  schoolId, 
  reviews = [], 
  averageRating, 
  canAddReview = true,
  onReviewAdded 
}: RatingSystemProps) {
  const [newReview, setNewReview] = useState<NewReview>({ rating: 0, comment: '' })
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) return
    
    setSubmitting(true)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live'
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ school_id: schoolId, rating: newReview.rating, comment: newReview.comment || undefined }),
      })
      if (!res.ok) throw new Error('Failed to submit review')
      setNewReview({ rating: 0, comment: '' })
      setIsAddingReview(false)
      onReviewAdded?.()
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateAverageRating = () => {
    if (averageRating) return averageRating
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const avgRating = calculateAverageRating()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Отзиви и оценки</span>
          </span>
          {avgRating > 0 && (
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(avgRating))}
              <span className="font-bold text-lg">{avgRating}</span>
              <span className="text-gray-500">({reviews.length})</span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Вижте какво казват другите родители за тази организация
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Review Section */}
        {canAddReview && (
          <div className="border-t pt-4">
            {!isAddingReview ? (
              <Button 
                onClick={() => setIsAddingReview(true)}
                className="w-full"
                variant="outline"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Добавете отзив
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Вашата оценка</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Коментар (незадължително)</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Споделете вашето мнение за организацията..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={newReview.rating === 0 || submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Изпращане...' : 'Изпрати отзив'}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingReview(false)
                      setNewReview({ rating: 0, comment: '' })
                    }}
                    variant="outline"
                  >
                    Отказ
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Reviews */}
        {reviews.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">Отзиви от родители</h4>
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {review.parent.email.split('@')[0]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating, 'sm')}
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Все още няма отзиви за тази организация</p>
            <p className="text-sm">Бъдете първите, които ще споделят мнение!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}