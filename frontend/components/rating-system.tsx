'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, User, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  reviews, 
  averageRating, 
  canAddReview = false,
  onReviewAdded 
}: RatingSystemProps) {
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [newReview, setNewReview] = useState<NewReview>({ rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }))
  }

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) return
    
    setSubmitting(true)
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('User not authenticated')
        return
      }

      // Insert review into Supabase
      const { error } = await supabase
        .from('reviews')
        .insert({
          school_id: schoolId,
          parent_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment || null
        })

      if (!error) {
        setNewReview({ rating: 0, comment: '' })
        setIsAddingReview(false)
        if (onReviewAdded) onReviewAdded()
      } else {
        console.error('Failed to submit review:', error)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => handleStarClick(i + 1) : undefined}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG')
  }

  const getEmailName = (email: string) => {
    return email.split('@')[0]
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Отзиви и рейтинг</CardTitle>
          
          {averageRating && reviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviews.length})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* Add review section */}
        {canAddReview && (
          <div className="border-b pb-4">
            {!isAddingReview ? (
              <Button 
                onClick={() => setIsAddingReview(true)}
                className="w-full"
              >
                <Star className="w-4 h-4 mr-2" />
                Добави отзив
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Оценка:</label>
                  <div className="flex items-center space-x-1">
                    {renderStars(newReview.rating, true, 'w-6 h-6')}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Коментар (опционално):</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Споделете опита си..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={newReview.rating === 0 || submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Изпраща...' : 'Публикувай отзив'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingReview(false)
                      setNewReview({ rating: 0, comment: '' })
                    }}
                    disabled={submitting}
                  >
                    Отказ
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews list */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Отзиви ({reviews.length})
            </h4>
            
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {getEmailName(review.parent.email)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Все още няма отзиви</p>
            <p className="text-xs">Бъдете първите да споделите мнение</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}