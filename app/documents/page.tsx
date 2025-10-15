'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Search,
  Calendar,
  User
} from 'lucide-react'
import { useState } from 'react'

export default function DocumentsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <DocumentsContent />
    </>
  )
}

function DocumentsContent() {
  const documents = useQuery(api.documents.getDocuments)
  
  // Mock veriler
  const mockDocuments = [
    {
      _id: 'mock-1',
      title: 'İnsan Kaynakları Politikaları',
      driveFileId: 'mock-drive-1',
      accessLevel: 'all',
      createdAt: Date.now() - 86400000 * 7
    },
    {
      _id: 'mock-2', 
      title: 'Güvenlik Prosedürleri',
      driveFileId: 'mock-drive-2',
      accessLevel: 'admin',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      _id: 'mock-3',
      title: 'Çalışan El Kitabı',
      driveFileId: 'mock-drive-3', 
      accessLevel: 'all',
      createdAt: Date.now() - 86400000 * 14
    },
    {
      _id: 'mock-4',
      title: 'IT Güvenlik Rehberi',
      driveFileId: 'mock-drive-4',
      accessLevel: 'admin',
      createdAt: Date.now() - 86400000 * 5
    },
    {
      _id: 'mock-5',
      title: 'Yeni Çalışan Oryantasyonu',
      driveFileId: 'mock-drive-5',
      accessLevel: 'all', 
      createdAt: Date.now() - 86400000 * 10
    }
  ]
  
  // Gerçek veriler yoksa mock verileri kullan
  const displayDocuments = documents && documents.length > 0 ? documents : mockDocuments
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDocuments = displayDocuments?.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Şirket Dökümanları</h1>
          <p className="text-gray-600">Tüm şirket dökümanlarına buradan erişebilirsiniz</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Döküman ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments && filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz döküman bulunmuyor</h3>
                  <p className="text-gray-600">Yöneticiler döküman eklediğinde burada görünecek</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: { _id: string; title: string; driveFileId: string; accessLevel: string; createdAt: number } }) {
  const getFileIcon = (title: string) => {
    const extension = title.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'ppt':
      case 'pptx':
        return '📈'
      case 'txt':
        return '📃'
      default:
        return '📄'
    }
  }

  const getFileType = (title: string) => {
    const extension = title.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'PDF'
      case 'doc':
      case 'docx':
        return 'Word'
      case 'xls':
      case 'xlsx':
        return 'Excel'
      case 'ppt':
      case 'pptx':
        return 'PowerPoint'
      case 'txt':
        return 'Metin'
      default:
        return 'Dosya'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-medex-light rounded-lg flex items-center justify-center text-2xl">
            {getFileIcon(document.title)}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{document.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {getFileType(document.title)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(document.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://drive.google.com/file/d/${document.driveFileId}/view`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Aç
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://drive.google.com/uc?export=download&id=${document.driveFileId}`, '_blank')}
            >
              <Download className="w-4 h-4 mr-1" />
              İndir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
