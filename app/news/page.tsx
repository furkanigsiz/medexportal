'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Clock, 
  User,
  ArrowLeft,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function NewsPage() {
  return (
    <>
      <Authenticated>
        <Navbar />
        <NewsContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="text-center">
            <div className="w-16 h-16 bg-medex-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold text-medex-navy mb-4">Medex Portal</h1>
            <p className="text-gray-600 mb-8">Şirket içi intranet portalına hoş geldiniz</p>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-medex-navy hover:bg-medex-blue text-white">
                Giriş Yap
              </Button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}

function NewsContent() {
  const news = useQuery(api.news.getNews)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-medex-navy mb-2">Duyurular</h1>
          <p className="text-xl text-gray-600">Şirket duyuruları ve önemli bilgiler</p>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {news && news.length > 0 ? (
            news.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-medex-navy">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-medex-navy mb-2">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Yönetici</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-medex-navy text-white">
                      <FileText className="w-4 h-4 mr-1" />
                      Duyuru
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Yayınlanma: {new Date(item.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz duyuru bulunmuyor</h3>
                <p className="text-gray-600 mb-6">Yeni duyurular burada görünecek</p>
                <Link href="/">
                  <Button className="bg-medex-navy hover:bg-medex-blue text-white">
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" className="bg-white hover:bg-white text-medex-navy border-medex-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
