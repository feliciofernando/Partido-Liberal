'use client'

// CSS para ReactQuill - deve ser importado primeiro
import 'react-quill-new/dist/quill.snow.css'

// Admin Panel - Partido Liberal de Angola
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  ArrowPathIcon,
  XMarkIcon,
  Bars3Icon,
  DocumentTextIcon,
  BellAlertIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  HandRaisedIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  HomeIcon,
  StarIcon,
  Cog6ToothIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

// Carregar ReactQuill dinamicamente (sem SSR)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />
})

// Types
interface Post { id: string; title: string; slug: string; content: string; summary: string; image: string | null; category: string; published: boolean; featured: boolean; author: string | null; views: number; createdAt: string; updatedAt: string }
interface Alert { id: string; title: string; message: string; type: string; active: boolean; createdAt: string; updatedAt: string }
interface Leader { id: string; name: string; slug: string; role: string; province: string | null; bio: string | null; photo: string | null; proposals: string | null; socialFacebook: string | null; socialTwitter: string | null; socialInstagram: string | null; socialLinkedin: string | null; order: number; active: boolean; createdAt: string; updatedAt: string }
interface Event { id: string; title: string; slug: string; description: string | null; location: string | null; province: string | null; date: string; time: string | null; image: string | null; type: string; status: string; attendees: number; createdAt: string; updatedAt: string }
interface Program { id: string; title: string; slug: string; area: string | null; summary: string | null; content: string | null; icon: string | null; order: number; active: boolean; createdAt: string; updatedAt: string }
interface KitItem { id: string; title: string; description: string | null; type: string; fileUrl: string | null; thumbnail: string | null; downloads: number; active: boolean; createdAt: string; updatedAt: string }
interface Volunteer { id: string; name: string; email: string; phone: string | null; province: string | null; message: string | null; status: string; isFiscal: boolean; createdAt: string; updatedAt: string }
interface Complaint { id: string; type: string; subject: string | null; message: string; email: string | null; phone: string | null; province: string | null; status: string; response: string | null; createdAt: string; updatedAt: string }
interface Subscriber { id: string; email: string; name: string | null; active: boolean; createdAt: string; updatedAt: string }

type Section = 'posts' | 'alerts' | 'leaders' | 'events' | 'programs' | 'kit' | 'volunteers' | 'complaints' | 'subscribers' | 'settings'

const sections: { id: Section; name: string; icon: any }[] = [
  { id: 'posts', name: 'Posts', icon: DocumentTextIcon },
  { id: 'alerts', name: 'Alertas', icon: BellAlertIcon },
  { id: 'leaders', name: 'Líderes', icon: UserGroupIcon },
  { id: 'events', name: 'Eventos', icon: CalendarDaysIcon },
  { id: 'programs', name: 'Programas', icon: ClipboardDocumentListIcon },
  { id: 'kit', name: 'Kit Digital', icon: DocumentDuplicateIcon },
  { id: 'volunteers', name: 'Voluntários', icon: HandRaisedIcon },
  { id: 'complaints', name: 'Ouvidoria', icon: ChatBubbleLeftRightIcon },
  { id: 'subscribers', name: 'Newsletter', icon: EnvelopeIcon },
  { id: 'settings', name: 'Configurações', icon: Cog6ToothIcon },
]

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile: closed by default

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Section state
  const [activeSection, setActiveSection] = useState<Section>('posts')
  const [loading, setLoading] = useState(false)

  // Data states
  const [posts, setPosts] = useState<Post[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [kitItems, setKitItems] = useState<KitItem[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [siteConfig, setSiteConfig] = useState<any>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth()
  }, [])

  // Carregar dados quando logado e mudar seção
  useEffect(() => {
    if (isLoggedIn) {
      if (activeSection === 'settings') {
        loadSiteConfig()
      } else {
        loadData()
      }
    }
  }, [isLoggedIn, activeSection])

  const checkAuth = async () => {
    setCheckingAuth(true)
    try {
      const res = await fetch('/api/admin/auth')
      const data = await res.json()

      if (data.authenticated) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    } catch {
      setIsLoggedIn(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.success) {
        setIsLoggedIn(true)
        toast.success('Login realizado com sucesso!')
      } else {
        setLoginError(data.message || 'Credenciais inválidas')
      }
    } catch {
      setLoginError('Erro ao conectar. Tente novamente.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      setIsLoggedIn(false)
      toast.success('Sessão terminada')
    } catch {
      toast.error('Erro ao sair')
    }
  }

  const loadSiteConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-config')
      const data = await res.json()
      setSiteConfig(data.config || null)
    } catch {
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSiteConfig = async (configToSave?: any) => {
    const config = configToSave || siteConfig
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Configurações salvas com sucesso!')
        setHasUnsavedChanges(false)
      } else {
        toast.error(data.error || 'Erro ao salvar configurações')
      }
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageChange = async (url: string) => {
    const newConfig = { ...siteConfig, heroImage: url }
    setSiteConfig(newConfig)
    setHasUnsavedChanges(true)
    setTimeout(() => {
      handleSaveSiteConfig(newConfig)
    }, 500)
  }

  const handleConfigImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, onSuccess?: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG, GIF ou WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ficheiro muito grande. Máximo 5MB.')
      return
    }

    setUploadingImage(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      })
      const data = await res.json()

      if (data.success && data.url) {
        if (onSuccess) {
          onSuccess(data.url)
        } else {
          const newConfig = { ...siteConfig, [field]: data.url }
          setSiteConfig(newConfig)
          setHasUnsavedChanges(true)
        }
        toast.success('Imagem carregada!')
      } else {
        toast.error(data.error || 'Erro ao carregar imagem')
      }
    } catch {
      toast.error('Erro ao carregar imagem')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const endpoints: Record<Section, string> = {
        posts: '/api/admin/posts',
        alerts: '/api/admin/alerts',
        leaders: '/api/admin/leaders',
        events: '/api/admin/events',
        programs: '/api/admin/programs',
        kit: '/api/admin/kit',
        volunteers: '/api/admin/volunteers',
        complaints: '/api/admin/complaints',
        subscribers: '/api/admin/subscribers'
      }

      const res = await fetch(endpoints[activeSection])
      const data = await res.json()

      // Verificar se não está autorizado
      if (data.error === 'Não autorizado') {
        setIsLoggedIn(false)
        return
      }

      switch (activeSection) {
        case 'posts': setPosts(data.posts || []); break
        case 'alerts': setAlerts(data.alerts || []); break
        case 'leaders': setLeaders(data.leaders || []); break
        case 'events': setEvents(data.events || []); break
        case 'programs': setPrograms(data.programs || []); break
        case 'kit': setKitItems(data.items || []); break
        case 'volunteers': setVolunteers(data.volunteers || []); break
        case 'complaints': setComplaints(data.complaints || []); break
        case 'subscribers': setSubscribers(data.subscribers || []); break
      }
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const openNewItem = () => {
    setEditingItem(null)
    switch (activeSection) {
      case 'posts':
        setFormData({ title: '', content: '', summary: '', image: '', category: 'politica', published: true, featured: false, author: '' })
        break
      case 'alerts':
        setFormData({ title: '', message: '', type: 'info', active: true })
        break
      case 'leaders':
        setFormData({ name: '', role: 'Membro', province: '', bio: '', photo: '', proposals: '', socialFacebook: '', socialTwitter: '', socialInstagram: '', socialLinkedin: '', order: 0, active: true })
        break
      case 'events':
        setFormData({ title: '', description: '', location: '', province: '', date: '', time: '', image: '', type: 'outro', status: 'agendado' })
        break
      case 'programs':
        setFormData({ title: '', area: '', summary: '', content: '', icon: '', order: 0, active: true })
        break
      case 'kit':
        setFormData({ title: '', description: '', type: 'documento', fileUrl: '', thumbnail: '', active: true })
        break
      default:
        setFormData({})
    }
    setShowForm(true)
  }

  const openEditItem = (item: any) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG, GIF ou WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ficheiro muito grande. Máximo 5MB.')
      return
    }

    setUploadingImage(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      })
      const data = await res.json()

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url, photo: data.url, thumbnail: data.url }))
        toast.success('Imagem carregada!')
      } else {
        toast.error(data.error || 'Erro ao carregar imagem')
      }
    } catch {
      toast.error('Erro ao carregar imagem')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const endpoints: Record<Section, string> = {
        posts: '/api/admin/posts',
        alerts: '/api/admin/alerts',
        leaders: '/api/admin/leaders',
        events: '/api/admin/events',
        programs: '/api/admin/programs',
        kit: '/api/admin/kit',
        volunteers: '/api/admin/volunteers',
        complaints: '/api/admin/complaints',
        subscribers: '/api/admin/subscribers'
      }

      const isEditing = !!editingItem
      const method = isEditing ? 'PUT' : 'POST'
      const bodyData = isEditing ? { ...formData, id: editingItem.id } : formData

      const res = await fetch(endpoints[activeSection], {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      })
      const data = await res.json()

      if (data.success) {
        toast.success(isEditing ? 'Atualizado!' : 'Criado!')
        setShowForm(false)
        loadData()
      } else {
        toast.error(data.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este item?')) return

    try {
      const endpoints: Record<Section, string> = {
        posts: '/api/admin/posts',
        alerts: '/api/admin/alerts',
        leaders: '/api/admin/leaders',
        events: '/api/admin/events',
        programs: '/api/admin/programs',
        kit: '/api/admin/kit',
        volunteers: '/api/admin/volunteers',
        complaints: '/api/admin/complaints',
        subscribers: '/api/admin/subscribers'
      }

      const res = await fetch(`${endpoints[activeSection]}?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        toast.success('Eliminado!')
        loadData()
      } else {
        toast.error(data.error || 'Erro ao eliminar')
      }
    } catch {
      toast.error('Erro ao eliminar')
    }
  }

  const handleToggleFeatured = async (post: Post) => {
    try {
      const newFeatured = !post.featured

      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          featured: newFeatured
        })
      })
      const data = await res.json()

      if (data.success) {
        toast.success(newFeatured ? 'Post destacado!' : 'Destaque removido!')
        loadData()
      } else {
        toast.error(data.error || 'Erro ao atualizar destaque')
      }
    } catch {
      toast.error('Erro ao atualizar destaque')
    }
  }

  // Selecionar seção e fechar sidebar no mobile
  const handleSelectSection = (section: Section) => {
    setActiveSection(section)
    setSidebarOpen(false) // Fechar sidebar no mobile
  }

  // Loading screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <ArrowPathIcon className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-500">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">PL</span>
            </div>
            <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
            <p className="text-slate-500 text-sm mt-1">Partido Liberal de Angola</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@partidoliberal.ao"
                  required
                  className="mt-1"
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <><ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" /> Entrando...</>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form screen (modal em tela cheia)
  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" onClick={() => setShowForm(false)} type="button" size="sm" className="md:size-default">
                ← Voltar
              </Button>
              <h1 className="text-sm md:text-lg font-semibold truncate">
                {editingItem ? 'Editar' : 'Novo'} {sections.find(s => s.id === activeSection)?.name}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700" type="button" size="sm">
              {saving ? (
                <><ArrowPathIcon className="w-4 h-4 mr-1 md:mr-2 animate-spin" /> Salvando...</>
              ) : (
                <><CheckCircleIcon className="w-4 h-4 mr-1 md:mr-2" /> Salvar</>
              )}
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-3 md:p-4 space-y-4 md:space-y-6 pb-8">
          {renderForm()}
        </div>
      </div>
    )
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white transform transition-transform duration-300 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 flex items-center gap-3 border-b border-slate-700">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-slate-800 font-bold">PL</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold truncate">Painel Admin</h1>
            <p className="text-xs text-slate-400">Partido Liberal</p>
          </div>
          {/* Botão fechar no mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg ml-auto"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <HomeIcon className="w-5 h-5 flex-shrink-0" />
            <span>Ver Site</span>
          </button>

          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => handleSelectSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  activeSection === section.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{section.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-2 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h1 className="text-base md:text-xl font-semibold text-slate-800 truncate">
              {sections.find(s => s.id === activeSection)?.name}
            </h1>
          </div>

          {['posts', 'alerts', 'leaders', 'events', 'programs', 'kit'].includes(activeSection) && (
            <Button onClick={openNewItem} className="bg-emerald-600 hover:bg-emerald-700" type="button" size="sm">
              <PlusIcon className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Novo</span>
            </Button>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 p-3 md:p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            renderList()
          )}
        </div>
      </main>
    </div>
  )

  // Render list based on section
  function renderList() {
    switch (activeSection) {
      case 'posts':
        return <PostsList posts={posts} onEdit={openEditItem} onDelete={handleDelete} onToggleFeatured={handleToggleFeatured} />
      case 'alerts':
        return <AlertsList alerts={alerts} onEdit={openEditItem} onDelete={handleDelete} />
      case 'leaders':
        return <LeadersList leaders={leaders} onEdit={openEditItem} onDelete={handleDelete} />
      case 'events':
        return <EventsList events={events} onEdit={openEditItem} onDelete={handleDelete} />
      case 'programs':
        return <ProgramsList programs={programs} onEdit={openEditItem} onDelete={handleDelete} />
      case 'kit':
        return <KitList items={kitItems} onEdit={openEditItem} onDelete={handleDelete} />
      case 'volunteers':
        return <VolunteersList volunteers={volunteers} onEdit={openEditItem} onDelete={handleDelete} />
      case 'complaints':
        return <ComplaintsList complaints={complaints} onEdit={openEditItem} onDelete={handleDelete} />
      case 'subscribers':
        return <SubscribersList subscribers={subscribers} onDelete={handleDelete} />
      case 'settings':
        return <SettingsForm siteConfig={siteConfig} setSiteConfig={setSiteConfig} saving={saving} onSave={handleSaveSiteConfig} uploadingImage={uploadingImage} handleImageUpload={handleImageUpload} handleConfigImageUpload={handleConfigImageUpload} fileInputRef={fileInputRef} onHeroImageChange={handleHeroImageChange} hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} />
      default:
        return null
    }
  }

  // Render form based on section
  function renderForm() {
    switch (activeSection) {
      case 'posts':
        return <PostsForm formData={formData} setFormData={setFormData} uploadingImage={uploadingImage} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} />
      case 'alerts':
        return <AlertsForm formData={formData} setFormData={setFormData} />
      case 'leaders':
        return <LeadersForm formData={formData} setFormData={setFormData} uploadingImage={uploadingImage} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} />
      case 'events':
        return <EventsForm formData={formData} setFormData={setFormData} uploadingImage={uploadingImage} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} />
      case 'programs':
        return <ProgramsForm formData={formData} setFormData={setFormData} />
      case 'kit':
        return <KitForm formData={formData} setFormData={setFormData} uploadingImage={uploadingImage} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} />
      default:
        return null
    }
  }
}

// ============================================
// LIST COMPONENTS
// ============================================

function PostsList({ posts, onEdit, onDelete, onToggleFeatured }: { posts: Post[]; onEdit: (item: Post) => void; onDelete: (id: string) => void; onToggleFeatured: (post: Post) => void }) {
  if (posts.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum post</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para criar o primeiro post</p>
        </CardContent>
      </Card>
    )
  }

  const featuredCount = posts.filter(p => p.featured).length

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card><CardContent className="pt-3 md:pt-4"><p className="text-xs md:text-sm text-slate-500">Total</p><p className="text-xl md:text-2xl font-bold">{posts.length}</p></CardContent></Card>
        <Card><CardContent className="pt-3 md:pt-4"><p className="text-xs md:text-sm text-slate-500">Publicados</p><p className="text-xl md:text-2xl font-bold text-emerald-600">{posts.filter(p => p.published).length}</p></CardContent></Card>
        <Card><CardContent className="pt-3 md:pt-4"><p className="text-xs md:text-sm text-slate-500">Rascunhos</p><p className="text-xl md:text-2xl font-bold text-amber-600">{posts.filter(p => !p.published).length}</p></CardContent></Card>
        <Card><CardContent className="pt-3 md:pt-4"><p className="text-xs md:text-sm text-slate-500">Destaques</p><p className="text-xl md:text-2xl font-bold text-amber-500">{featuredCount}/1</p></CardContent></Card>
      </div>

      {featuredCount === 0 && posts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4 flex items-center gap-3">
          <StarIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">Nenhum post está destacado. Clique na estrela para destacar um post.</p>
        </div>
      )}

      <Card>
        <CardContent className="p-0 divide-y">
          {posts.map((post) => (
            <div key={post.id} className={`p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:bg-slate-50 ${post.featured ? 'bg-amber-50' : ''}`}>
              <button
                onClick={() => onToggleFeatured(post)}
                className={`p-2 rounded-lg transition-all flex-shrink-0 ${post.featured ? 'text-amber-500 bg-amber-100 hover:bg-amber-200' : 'text-slate-300 hover:text-amber-400 hover:bg-amber-50'}`}
                title={post.featured ? 'Remover destaque' : 'Destacar este post'}
                type="button"
              >
                {post.featured ? <StarIconSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
              </button>

              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {post.image ? <img src={post.image} alt="" className="w-full h-full object-cover" /> : <PhotoIcon className="w-5 h-5 md:w-6 md:h-6 m-auto text-slate-400 mt-3 md:mt-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-slate-900 truncate text-sm md:text-base">{post.title}</h3>
                  {post.featured && <Badge className="bg-amber-100 text-amber-700 text-xs">★ Destaque</Badge>}
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-500 flex-wrap">
                  <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs">{post.published ? 'Publicado' : 'Rascunho'}</Badge>
                  <span className="hidden sm:inline">{post.category}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('pt-AO')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onEdit(post)} type="button" className="h-8 w-8 md:h-10 md:w-10"><PencilIcon className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 md:h-10 md:w-10" type="button"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AlertsList({ alerts, onEdit, onDelete }: { alerts: Alert[]; onEdit: (item: Alert) => void; onDelete: (id: string) => void }) {
  if (alerts.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellAlertIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum alerta</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para criar um alerta</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0 divide-y">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-slate-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${alert.active ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                <BellAlertIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-slate-900 text-sm md:text-base">{alert.title}</h3>
                  {alert.active && <Badge className="bg-red-100 text-red-600 text-xs">Ativo</Badge>}
                </div>
                <p className="text-xs md:text-sm text-slate-500 truncate">{alert.message || 'Sem mensagem'}</p>
              </div>
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onEdit(alert)} type="button" className="h-8 w-8 md:h-10 md:w-10"><PencilIcon className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 md:h-10 md:w-10" type="button"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function LeadersList({ leaders, onEdit, onDelete }: { leaders: Leader[]; onEdit: (item: Leader) => void; onDelete: (id: string) => void }) {
  if (leaders.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum líder</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para adicionar um líder</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {leaders.map((leader) => (
        <Card key={leader.id} className="overflow-hidden">
          <div className="h-24 md:h-32 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
            {leader.photo ? (
              <img src={leader.photo} alt={leader.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-500 text-white text-xl md:text-2xl font-bold flex items-center justify-center border-4 border-white shadow-lg">
                {leader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            {!leader.active && <Badge className="absolute top-2 right-2 bg-slate-500 text-xs">Inativo</Badge>}
          </div>
          <CardContent className="pt-3 md:pt-4">
            <Badge variant="outline" className="mb-1 text-xs">{leader.role}</Badge>
            <h3 className="font-semibold text-sm md:text-base">{leader.name}</h3>
            {leader.province && <p className="text-xs md:text-sm text-slate-500">{leader.province}</p>}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => onEdit(leader)} type="button" className="text-xs md:text-sm"><PencilIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Editar</Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(leader.id)} className="text-red-500 text-xs md:text-sm" type="button"><TrashIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Eliminar</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EventsList({ events, onEdit, onDelete }: { events: Event[]; onEdit: (item: Event) => void; onDelete: (id: string) => void }) {
  if (events.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDaysIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum evento</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para criar um evento</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-3 md:p-4 flex items-start gap-3 md:gap-4">
            <div className="text-center bg-slate-100 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[70px] flex-shrink-0">
              <p className="text-xs text-slate-500 uppercase">{new Date(event.date).toLocaleDateString('pt-AO', { month: 'short' })}</p>
              <p className="text-xl md:text-2xl font-bold">{new Date(event.date).getDate()}</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-slate-900 text-sm md:text-base">{event.title}</h3>
                <Badge variant="outline" className="text-xs">{event.type}</Badge>
                <Badge className={`${event.status === 'agendado' ? 'bg-blue-100 text-blue-700' : event.status === 'em_andamento' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'} text-xs`}>
                  {event.status?.replace('_', ' ')}
                </Badge>
              </div>
              {event.location && <p className="text-xs md:text-sm text-slate-500">{event.location}</p>}
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => onEdit(event)} type="button" className="h-8 w-8 md:h-10 md:w-10"><PencilIcon className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 md:h-10 md:w-10" type="button"><TrashIcon className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProgramsList({ programs, onEdit, onDelete }: { programs: Program[]; onEdit: (item: Program) => void; onDelete: (id: string) => void }) {
  if (programs.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardDocumentListIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum programa</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para criar um programa</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {programs.map((program) => (
        <Card key={program.id}>
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-slate-50">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardDocumentListIcon className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-slate-900 text-sm md:text-base">{program.title}</h3>
                {program.area && <Badge variant="outline" className="text-xs">{program.area}</Badge>}
                {!program.active && <Badge className="bg-slate-500 text-xs">Inativo</Badge>}
              </div>
              {program.summary && <p className="text-xs md:text-sm text-slate-500 truncate">{program.summary}</p>}
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => onEdit(program)} type="button" className="h-8 w-8 md:h-10 md:w-10"><PencilIcon className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(program.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 md:h-10 md:w-10" type="button"><TrashIcon className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KitList({ items, onEdit, onDelete }: { items: KitItem[]; onEdit: (item: KitItem) => void; onDelete: (id: string) => void }) {
  if (items.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentDuplicateIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum item</h2>
          <p className="text-slate-500 text-sm md:text-base">Clique em "Novo" para adicionar um item</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-3 md:p-4">
            <div className="aspect-video bg-slate-100 rounded-lg mb-3 overflow-hidden">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DocumentDuplicateIcon className="w-10 h-10 text-slate-400" />
                </div>
              )}
            </div>
            <Badge variant="outline" className="mb-1 text-xs">{item.type}</Badge>
            <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
            {item.description && <p className="text-xs md:text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
            <p className="text-xs text-slate-400 mt-2">{item.downloads || 0} downloads</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => onEdit(item)} type="button" className="text-xs"><PencilIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Editar</Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(item.id)} className="text-red-500 text-xs" type="button"><TrashIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Eliminar</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function VolunteersList({ volunteers, onEdit, onDelete }: { volunteers: Volunteer[]; onEdit: (item: Volunteer) => void; onDelete: (id: string) => void }) {
  if (volunteers.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandRaisedIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum voluntário</h2>
          <p className="text-slate-500 text-sm md:text-base">Os voluntários inscritos aparecerão aqui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {volunteers.map((volunteer) => (
        <Card key={volunteer.id}>
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
              {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-slate-900 text-sm md:text-base">{volunteer.name}</h3>
                {volunteer.isFiscal && <Badge className="bg-purple-100 text-purple-700 text-xs">Fiscal</Badge>}
              </div>
              <p className="text-xs md:text-sm text-slate-500">{volunteer.email}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={`${volunteer.status === 'aprovado' ? 'bg-green-100 text-green-700' : volunteer.status === 'rejeitado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'} text-xs`}>
                  {volunteer.status}
                </Badge>
                {volunteer.province && <span className="text-xs text-slate-400">{volunteer.province}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => onEdit({ ...volunteer, status: 'aprovado' })} type="button" className="text-xs text-green-600">Aprovar</Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(volunteer.id)} className="text-red-500 h-8 w-8 md:h-10 md:w-10" type="button"><TrashIcon className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ComplaintsList({ complaints, onEdit, onDelete }: { complaints: Complaint[]; onEdit: (item: Complaint) => void; onDelete: (id: string) => void }) {
  if (complaints.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhuma denúncia</h2>
          <p className="text-slate-500 text-sm md:text-base">As denúncias recebidas aparecerão aqui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {complaints.map((complaint) => (
        <Card key={complaint.id}>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">{complaint.type}</Badge>
                  <Badge className={`${complaint.status === 'resolvido' ? 'bg-green-100 text-green-700' : complaint.status === 'em_analise' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'} text-xs`}>
                    {complaint.status?.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="font-medium text-slate-900 text-sm md:text-base">{complaint.subject || 'Sem assunto'}</h3>
                <p className="text-xs md:text-sm text-slate-500 mt-1 line-clamp-2">{complaint.message}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(complaint.createdAt).toLocaleDateString('pt-AO')}</p>
              </div>
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => onEdit({ ...complaint, status: 'resolvido' })} type="button" className="text-xs text-green-600">Resolver</Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(complaint.id)} className="text-red-500 h-8 w-8" type="button"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SubscribersList({ subscribers, onDelete }: { subscribers: Subscriber[]; onDelete: (id: string) => void }) {
  if (subscribers.length === 0) {
    return (
      <Card className="text-center py-12 md:py-20">
        <CardContent>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Nenhum subscritor</h2>
          <p className="text-slate-500 text-sm md:text-base">Os subscritores da newsletter aparecerão aqui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="p-0 divide-y">
          {subscribers.map((sub) => (
            <div key={sub.id} className="p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-slate-50">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                {sub.name ? sub.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm md:text-base">{sub.name || 'Sem nome'}</h3>
                <p className="text-xs md:text-sm text-slate-500">{sub.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {sub.active ? (
                  <Badge className="bg-green-100 text-green-700 text-xs">Ativo</Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-700 text-xs">Inativo</Badge>
                )}
                <Button variant="ghost" size="icon" onClick={() => onDelete(sub.id)} className="text-red-500 h-8 w-8" type="button"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsForm({ siteConfig, setSiteConfig, saving, onSave, uploadingImage, handleImageUpload, handleConfigImageUpload, fileInputRef, onHeroImageChange, hasUnsavedChanges, setHasUnsavedChanges }: any) {
  
  const updateConfig = (field: string, value: any) => {
    setSiteConfig({ ...siteConfig, [field]: value })
    setHasUnsavedChanges(true)
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-8">
      {/* Botão Salvar Flutuante */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={() => onSave()} 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
          >
            {saving ? (
              <><ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              <><CheckCircleIcon className="w-4 h-4 mr-2" /> Salvar Alterações</>
            )}
          </Button>
        </div>
      )}

      {/* Seção Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <PhotoIcon className="w-5 h-5" />
            Seção Hero (Início)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Imagem do Hero */}
          <div>
            <Label className="text-sm">Imagem de Fundo</Label>
            <p className="text-xs text-slate-500 mb-2">Imagem principal que aparece no topo da página</p>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden">
                {siteConfig?.heroImage ? (
                  <img src={siteConfig.heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleConfigImageUpload(e, 'heroImage', onHeroImageChange)}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                size="sm"
                type="button"
              >
                {uploadingImage ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'Carregar'}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm">Badge (Etiqueta)</Label>
            <Input
              value={siteConfig?.heroBadge || ''}
              onChange={(e) => updateConfig('heroBadge', e.target.value)}
              placeholder="Eleições 2025 - Juntos pelo Futuro de Angola"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm">Título Principal</Label>
            <Input
              value={siteConfig?.heroTitle || ''}
              onChange={(e) => updateConfig('heroTitle', e.target.value)}
              placeholder="Construindo um Angola Melhor para Todos"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm">Subtítulo</Label>
            <textarea
              value={siteConfig?.heroSubtitle || ''}
              onChange={(e) => updateConfig('heroSubtitle', e.target.value)}
              placeholder="Descrição curta sobre o partido..."
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Texto do Botão 1</Label>
              <Input
                value={siteConfig?.heroButtonText1 || ''}
                onChange={(e) => updateConfig('heroButtonText1', e.target.value)}
                placeholder="Seja Voluntário"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Link do Botão 1</Label>
              <Input
                value={siteConfig?.heroButtonLink1 || ''}
                onChange={(e) => updateConfig('heroButtonLink1', e.target.value)}
                placeholder="#voluntarios"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Texto do Botão 2</Label>
              <Input
                value={siteConfig?.heroButtonText2 || ''}
                onChange={(e) => updateConfig('heroButtonText2', e.target.value)}
                placeholder="Conheça Nosso Programa"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Link do Botão 2</Label>
              <Input
                value={siteConfig?.heroButtonLink2 || ''}
                onChange={(e) => updateConfig('heroButtonLink2', e.target.value)}
                placeholder="#programa"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Estatísticas do Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm">Valor Stat 1</Label>
              <Input
                value={siteConfig?.stat1Value || ''}
                onChange={(e) => updateConfig('stat1Value', e.target.value)}
                placeholder="15K+"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Label Stat 1</Label>
              <Input
                value={siteConfig?.stat1Label || ''}
                onChange={(e) => updateConfig('stat1Label', e.target.value)}
                placeholder="Voluntários Ativos"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Valor Stat 2</Label>
              <Input
                value={siteConfig?.stat2Value || ''}
                onChange={(e) => updateConfig('stat2Value', e.target.value)}
                placeholder="18"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Label Stat 2</Label>
              <Input
                value={siteConfig?.stat2Label || ''}
                onChange={(e) => updateConfig('stat2Label', e.target.value)}
                placeholder="Províncias"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm">Valor Stat 3</Label>
              <Input
                value={siteConfig?.stat3Value || ''}
                onChange={(e) => updateConfig('stat3Value', e.target.value)}
                placeholder="50+"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Label Stat 3</Label>
              <Input
                value={siteConfig?.stat3Label || ''}
                onChange={(e) => updateConfig('stat3Label', e.target.value)}
                placeholder="Eventos"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Valor Stat 4</Label>
              <Input
                value={siteConfig?.stat4Value || ''}
                onChange={(e) => updateConfig('stat4Value', e.target.value)}
                placeholder="100K+"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Label Stat 4</Label>
              <Input
                value={siteConfig?.stat4Label || ''}
                onChange={(e) => updateConfig('stat4Label', e.target.value)}
                placeholder="Apoiantes"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção Partido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Seção "O Partido"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Subtítulo</Label>
            <Input
              value={siteConfig?.partySubtitle || ''}
              onChange={(e) => updateConfig('partySubtitle', e.target.value)}
              placeholder="O Partido"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Título</Label>
            <Input
              value={siteConfig?.partyTitle || ''}
              onChange={(e) => updateConfig('partyTitle', e.target.value)}
              placeholder="Conheça o Partido Liberal"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Descrição</Label>
            <textarea
              value={siteConfig?.partyDescription || ''}
              onChange={(e) => updateConfig('partyDescription', e.target.value)}
              placeholder="Descrição sobre o partido..."
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção Vídeo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Vídeo Institucional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Título do Vídeo</Label>
            <Input
              value={siteConfig?.videoTitle || ''}
              onChange={(e) => updateConfig('videoTitle', e.target.value)}
              placeholder="Vídeo Institucional"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">URL do Vídeo (YouTube/Vimeo)</Label>
            <Input
              value={siteConfig?.videoUrl || ''}
              onChange={(e) => updateConfig('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={() => onSave()} 
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? (
            <><ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
          ) : (
            <><CheckCircleIcon className="w-4 h-4 mr-2" /> Salvar Configurações</>
          )}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// FORM COMPONENTS
// ============================================

function PostsForm({ formData, setFormData, uploadingImage, handleImageUpload, fileInputRef }: any) {
  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardContent className="pt-4 md:pt-6 space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">Título *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título do post"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="summary" className="text-sm">Resumo</Label>
            <Input
              id="summary"
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Breve resumo do post"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm">Conteúdo</Label>
            <div className="mt-1">
              <ReactQuill
                value={formData.content || ''}
                onChange={(content) => setFormData({ ...formData, content })}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Imagem de Capa</Label>
            <div className="mt-2 flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-8 h-8 m-auto text-slate-400 mt-6 md:mt-8" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  size="sm"
                  type="button"
                >
                  {uploadingImage ? <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" /> : <PhotoIcon className="w-4 h-4 mr-2" />}
                  Carregar Imagem
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm">Categoria</Label>
              <select
                id="category"
                value={formData.category || 'politica'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="politica">Política</option>
                <option value="economia">Economia</option>
                <option value="sociedade">Sociedade</option>
                <option value="comunicado">Comunicado</option>
                <option value="imprensa">Imprensa</option>
                <option value="nota_oficial">Nota Oficial</option>
              </select>
            </div>

            <div>
              <Label htmlFor="author" className="text-sm">Autor</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nome do autor"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published || false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Publicado</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Destaque (máx: 1)</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AlertsForm({ formData, setFormData }: any) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm">Título *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título do alerta"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm">Mensagem</Label>
          <Input
            id="message"
            value={formData.message || ''}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Mensagem do alerta"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-sm">Tipo</Label>
          <select
            id="type"
            value={formData.type || 'info'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="info">Informação</option>
            <option value="urgente">Urgente</option>
            <option value="alerta">Alerta</option>
            <option value="sucesso">Sucesso</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.active || false}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Ativo (só um alerta pode estar ativo)</span>
        </label>
      </CardContent>
    </Card>
  )
}

function LeadersForm({ formData, setFormData, uploadingImage, handleImageUpload, fileInputRef }: any) {
  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardContent className="pt-4 md:pt-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">Nome *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role" className="text-sm">Cargo</Label>
              <Input
                id="role"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Presidente, Vice-Presidente"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="province" className="text-sm">Província</Label>
              <Input
                id="province"
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="Província de origem"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm">Biografia</Label>
            <textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Biografia do líder"
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Foto</Label>
            <div className="mt-2 flex items-start gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl text-slate-400">
                      {formData.name ? formData.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  size="sm"
                  type="button"
                >
                  {uploadingImage ? <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" /> : <PhotoIcon className="w-4 h-4 mr-2" />}
                  Carregar Foto
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="socialFacebook" className="text-sm">Facebook</Label>
            <Input
              id="socialFacebook"
              value={formData.socialFacebook || ''}
              onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
              placeholder="URL do Facebook"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="socialInstagram" className="text-sm">Instagram</Label>
            <Input
              id="socialInstagram"
              value={formData.socialInstagram || ''}
              onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
              placeholder="URL do Instagram"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="socialTwitter" className="text-sm">Twitter/X</Label>
            <Input
              id="socialTwitter"
              value={formData.socialTwitter || ''}
              onChange={(e) => setFormData({ ...formData, socialTwitter: e.target.value })}
              placeholder="URL do Twitter/X"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="socialLinkedin" className="text-sm">LinkedIn</Label>
            <Input
              id="socialLinkedin"
              value={formData.socialLinkedin || ''}
              onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
              placeholder="URL do LinkedIn"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="proposals" className="text-sm">Propostas</Label>
            <textarea
              id="proposals"
              value={formData.proposals || ''}
              onChange={(e) => setFormData({ ...formData, proposals: e.target.value })}
              placeholder="Propostas do líder (uma por linha)"
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order" className="text-sm">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Ativo</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EventsForm({ formData, setFormData, uploadingImage, handleImageUpload, fileInputRef }: any) {
  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardContent className="pt-4 md:pt-6 space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">Título *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título do evento"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Descrição</Label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do evento"
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date ? formData.date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-sm">Hora</Label>
              <Input
                id="time"
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm">Local</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Local do evento"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="province" className="text-sm">Província</Label>
              <Input
                id="province"
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="Província"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="text-sm">Tipo</Label>
              <select
                id="type"
                value={formData.type || 'outro'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="comicio">Comício</option>
                <option value="encontro">Encontro</option>
                <option value="passeata">Passeata</option>
                <option value="reuniao">Reunião</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status" className="text-sm">Status</Label>
              <select
                id="status"
                value={formData.status || 'agendado'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="agendado">Agendado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-sm">Imagem</Label>
            <div className="mt-2 flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-8 h-8 m-auto text-slate-400 mt-6 md:mt-8" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  size="sm"
                  type="button"
                >
                  {uploadingImage ? <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" /> : <PhotoIcon className="w-4 h-4 mr-2" />}
                  Carregar Imagem
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProgramsForm({ formData, setFormData }: any) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm">Título *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título do programa"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="area" className="text-sm">Área</Label>
            <Input
              id="area"
              value={formData.area || ''}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="Ex: Saúde, Educação"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="icon" className="text-sm">Ícone</Label>
            <Input
              id="icon"
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Nome do ícone"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="summary" className="text-sm">Resumo</Label>
          <Input
            id="summary"
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Breve resumo do programa"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="content" className="text-sm">Conteúdo (JSON)</Label>
          <textarea
            id="content"
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder='["Item 1", "Item 2", "Item 3"]'
            rows={4}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="order" className="text-sm">Ordem</Label>
            <Input
              id="order"
              type="number"
              value={formData.order || 0}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active || false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Ativo</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function KitForm({ formData, setFormData, uploadingImage, handleImageUpload, fileInputRef }: any) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm">Título *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título do item"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm">Descrição</Label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição do item"
            rows={2}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-sm">Tipo</Label>
            <select
              id="type"
              value={formData.type || 'documento'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="documento">Documento</option>
              <option value="avatar">Avatar</option>
              <option value="banner">Banner</option>
              <option value="sticker">Sticker</option>
              <option value="video">Vídeo</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <Label htmlFor="fileUrl" className="text-sm">URL do Ficheiro</Label>
            <Input
              id="fileUrl"
              value={formData.fileUrl || ''}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm">Thumbnail</Label>
          <div className="mt-2 flex items-start gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
              {formData.thumbnail ? (
                <img src={formData.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <PhotoIcon className="w-8 h-8 m-auto text-slate-400 mt-6" />
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                size="sm"
                type="button"
              >
                {uploadingImage ? <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" /> : <PhotoIcon className="w-4 h-4 mr-2" />}
                Carregar Thumbnail
              </Button>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.active || false}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Ativo</span>
        </label>
      </CardContent>
    </Card>
  )
}
