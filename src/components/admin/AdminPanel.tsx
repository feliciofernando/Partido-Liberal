'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from './AdminProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  HomeIcon,
  NewspaperIcon,
  UsersIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CubeIcon,
  ChatBubbleLeftEllipsisIcon,
  BellAlertIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

// Types
interface Stats {
  news: number
  leaders: number
  events: number
  volunteers: number
  pendingVolunteers: number
  complaints: number
  pendingComplaints: number
  subscribers: number
  kitItems: number
  activeAlerts: number
}

type Section = 'dashboard' | 'settings' | 'news' | 'leaders' | 'events' | 'program' | 'kit' | 'volunteers' | 'complaints' | 'subscribers' | 'alerts'

const ANGOLAN_PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cunene', 'Cuanza Norte', 'Cuanza Sul',
  'Cuando Cubango', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul',
  'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
]

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return '-'
  }
}

function formatNumber(num: number): string {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'
}

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAdmin()
  const [section, setSection] = useState<Section>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteItemName, setDeleteItemName] = useState<string>('')
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Load stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  // Load section data when section changes
  useEffect(() => {
    if (section !== 'dashboard') {
      fetchSectionData(section)
    }
  }, [section])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const result = await res.json()
      if (result.stats) {
        setStats(result.stats)
      } else {
        setStats({ news: 0, leaders: 0, events: 0, volunteers: 0, pendingVolunteers: 0, complaints: 0, pendingComplaints: 0, subscribers: 0, kitItems: 0, activeAlerts: 0 })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      setStats({ news: 0, leaders: 0, events: 0, volunteers: 0, pendingVolunteers: 0, complaints: 0, pendingComplaints: 0, subscribers: 0, kitItems: 0, activeAlerts: 0 })
    }
  }

  const fetchSectionData = async (s: Section) => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoints: Record<Section, string> = {
        dashboard: '/api/admin/stats',
        settings: '/api/admin/site-config',
        news: '/api/admin/news',
        leaders: '/api/admin/leaders',
        events: '/api/admin/events',
        program: '/api/admin/program',
        kit: '/api/admin/kit',
        volunteers: '/api/admin/volunteers',
        complaints: '/api/admin/complaints',
        subscribers: '/api/admin/subscribers',
        alerts: '/api/admin/alerts',
      }

      const res = await fetch(endpoints[s])
      const result = await res.json()

      if (result.error === 'Não autorizado') {
        setError('Sessão expirada. Por favor, faça login novamente.')
        toast.error('Sessão expirada')
        setLoading(false)
        return
      }

      if (result.error) {
        setError(result.error)
        toast.error(result.error)
        setData([])
        setLoading(false)
        return
      }

      const dataKey = s === 'dashboard' ? 'stats' : 
                      s === 'news' ? 'news' :
                      s === 'leaders' ? 'leaders' :
                      s === 'events' ? 'events' :
                      s === 'program' ? 'programs' :
                      s === 'kit' ? 'kitItems' :
                      s === 'volunteers' ? 'volunteers' :
                      s === 'complaints' ? 'complaints' :
                      s === 'subscribers' ? 'subscribers' : 'alerts'
      
      const items = result[dataKey] || []
      setData(Array.isArray(items) ? items : [])
      
      if (items.length > 0) {
        toast.success(`${items.length} registro(s) carregado(s)`)
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados. Verifique sua conexão.')
      toast.error('Erro ao carregar dados')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  const openForm = useCallback((item?: any) => {
    setEditingItem(item || null)
    setFormData(item ? { ...item } : {})
    setIsFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setEditingItem(null)
    setFormData({})
    setIsFormOpen(false)
  }, [])

  const updateFormData = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = useCallback(async () => {
    // Validação básica
    if (section === 'news' && !formData.title?.trim()) {
      toast.error('Título é obrigatório')
      return
    }
    if (section === 'leaders' && !formData.name?.trim()) {
      toast.error('Nome é obrigatório')
      return
    }
    
    setFormLoading(true)
    
    try {
      const endpoints: Record<Section, string> = {
        dashboard: '',
        news: '/api/admin/news',
        leaders: '/api/admin/leaders',
        events: '/api/admin/events',
        program: '/api/admin/program',
        kit: '/api/admin/kit',
        volunteers: '/api/admin/volunteers',
        complaints: '/api/admin/complaints',
        subscribers: '/api/admin/subscribers',
        alerts: '/api/admin/alerts',
      }

      const isEditing = !!editingItem?.id
      const method = isEditing ? 'PUT' : 'POST'
      
      // Limpar dados undefined/null
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined && v !== null)
      )
      
      const body = isEditing 
        ? { ...cleanFormData, id: editingItem.id }
        : { ...cleanFormData }

      const res = await fetch(endpoints[section], {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      const result = await res.json()
      
      if (!res.ok || result.error) {
        toast.error(`Erro: ${result.error || result.details || 'Erro desconhecido'}`)
        return
      }
      
      toast.success(isEditing ? 'Registro atualizado com sucesso!' : 'Registro criado com sucesso!')
      await fetchSectionData(section)
      await fetchStats()
      closeForm()
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      toast.error(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setFormLoading(false)
    }
  }, [section, formData, editingItem, closeForm])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setFormLoading(true)

    try {
      const endpoints: Record<Section, string> = {
        dashboard: '',
        settings: '',
        news: `/api/admin/news?id=${deleteId}`,
        leaders: `/api/admin/leaders?id=${deleteId}`,
        events: `/api/admin/events?id=${deleteId}`,
        program: `/api/admin/program?id=${deleteId}`,
        kit: `/api/admin/kit?id=${deleteId}`,
        volunteers: `/api/admin/volunteers?id=${deleteId}`,
        complaints: `/api/admin/complaints?id=${deleteId}`,
        subscribers: `/api/admin/subscribers?id=${deleteId}`,
        alerts: `/api/admin/alerts?id=${deleteId}`,
      }

      const res = await fetch(endpoints[section], { method: 'DELETE' })
      const result = await res.json()
      
      if (result.error) {
        toast.error(`Erro ao excluir: ${result.error}`)
      } else {
        toast.success('Registro excluído com sucesso!')
        await fetchSectionData(section)
        await fetchStats()
      }
    } catch (error: any) {
      console.error('Erro ao apagar:', error)
      toast.error(`Erro ao excluir: ${error.message}`)
    } finally {
      setFormLoading(false)
      setDeleteId(null)
      setDeleteItemName('')
    }
  }, [deleteId, section])

  const handleDeleteClick = useCallback((row: any) => {
    setDeleteId(row.id)
    setDeleteItemName(row.title || row.name || row.subject || 'este registro')
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Painel Principal', icon: HomeIcon },
    { id: 'settings', label: 'Configurações do Site', icon: Cog6ToothIcon },
    { id: 'news', label: 'Notícias', icon: NewspaperIcon, count: stats?.news },
    { id: 'leaders', label: 'Liderança', icon: UsersIcon, count: stats?.leaders },
    { id: 'events', label: 'Agenda', icon: CalendarDaysIcon, count: stats?.events },
    { id: 'program', label: 'Programa de Governo', icon: DocumentTextIcon },
    { id: 'kit', label: 'Kit Digital', icon: CubeIcon, count: stats?.kitItems },
    { id: 'volunteers', label: 'Voluntariado', icon: UsersIcon, count: stats?.pendingVolunteers },
    { id: 'complaints', label: 'Ouvidoria', icon: ChatBubbleLeftEllipsisIcon, count: stats?.pendingComplaints },
    { id: 'subscribers', label: 'Newsletter', icon: EnvelopeIcon, count: stats?.subscribers },
    { id: 'alerts', label: 'Comunicados', icon: BellAlertIcon, count: stats?.activeAlerts },
  ]

  const columns: Record<Section, { key: string; label: string }[]> = {
    dashboard: [],
    news: [
      { key: 'title', label: 'Título' },
      { key: 'category', label: 'Categoria' },
      { key: 'published', label: 'Status' },
      { key: 'views', label: 'Visualizações' },
      { key: 'createdAt', label: 'Data' },
    ],
    leaders: [
      { key: 'name', label: 'Nome' },
      { key: 'role', label: 'Cargo' },
      { key: 'province', label: 'Província' },
      { key: 'active', label: 'Status' },
    ],
    events: [
      { key: 'title', label: 'Título' },
      { key: 'location', label: 'Local' },
      { key: 'date', label: 'Data' },
      { key: 'status', label: 'Status' },
    ],
    program: [
      { key: 'title', label: 'Título' },
      { key: 'area', label: 'Área' },
      { key: 'order', label: 'Ordem' },
      { key: 'active', label: 'Status' },
    ],
    kit: [
      { key: 'title', label: 'Título' },
      { key: 'type', label: 'Tipo' },
      { key: 'downloads', label: 'Downloads' },
      { key: 'active', label: 'Status' },
    ],
    volunteers: [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'province', label: 'Província' },
      { key: 'status', label: 'Status' },
    ],
    complaints: [
      { key: 'type', label: 'Tipo' },
      { key: 'subject', label: 'Assunto' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Data' },
    ],
    subscribers: [
      { key: 'email', label: 'Email' },
      { key: 'name', label: 'Nome' },
      { key: 'active', label: 'Status' },
      { key: 'createdAt', label: 'Data' },
    ],
    alerts: [
      { key: 'title', label: 'Título' },
      { key: 'type', label: 'Tipo' },
      { key: 'active', label: 'Status' },
      { key: 'createdAt', label: 'Data' },
    ],
  }

  const renderCell = (key: string, value: any) => {
    if (key === 'published') {
      return value ? (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1">
          <EyeIcon className="w-3 h-3" />
          Publicado
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1">
          <EyeSlashIcon className="w-3 h-3" />
          Rascunho
        </Badge>
      )
    }
    if (key === 'active') {
      return value ? (
        <Badge className="bg-emerald-600 hover:bg-emerald-700">Ativo</Badge>
      ) : (
        <Badge variant="secondary">Inativo</Badge>
      )
    }
    if (key === 'status') {
      const statusConfig: Record<string, { variant: 'secondary' | 'default' | 'destructive' | 'outline'; label: string }> = {
        pending: { variant: 'secondary', label: 'Pendente' },
        approved: { variant: 'default', label: 'Aprovado' },
        rejected: { variant: 'destructive', label: 'Rejeitado' },
        scheduled: { variant: 'default', label: 'Agendado' },
        ongoing: { variant: 'secondary', label: 'Em andamento' },
        completed: { variant: 'default', label: 'Concluído' },
        pendente: { variant: 'secondary', label: 'Pendente' },
        agendado: { variant: 'default', label: 'Agendado' },
        em_andamento: { variant: 'secondary', label: 'Em andamento' },
        concluido: { variant: 'default', label: 'Concluído' },
      }
      const config = statusConfig[value?.toLowerCase()] || { variant: 'default', label: value || '-' }
      return <Badge variant={config.variant}>{config.label}</Badge>
    }
    if (key === 'createdAt' || key === 'date') {
      return formatDate(value)
    }
    if (typeof value === 'number') {
      return formatNumber(value)
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...'
    }
    return value || '-'
  }

  const getSectionTitle = (s: Section): string => {
    const titles: Record<Section, string> = {
      dashboard: 'Painel Principal',
      settings: 'Configurações do Site',
      news: 'Gestão de Notícias',
      leaders: 'Liderança do Partido',
      events: 'Agenda de Atividades',
      program: 'Programa de Governo',
      kit: 'Kit Digital',
      volunteers: 'Gestão de Voluntários',
      complaints: 'Ouvidoria',
      subscribers: 'Subscritores Newsletter',
      alerts: 'Comunicados Oficiais',
    }
    return titles[s] || s
  }

  const getSectionDescription = (s: Section): string => {
    const descriptions: Record<Section, string> = {
      dashboard: 'Visão geral do sistema',
      settings: 'Configure a imagem do hero, vídeo institucional e textos principais',
      news: 'Publique e gerencie notícias e comunicados oficiais',
      leaders: 'Cadastre dirigentes e candidatos do partido',
      events: 'Agende eventos e atividades partidárias',
      program: 'Defina as propostas do programa de governo',
      kit: 'Gerencie materiais para militância',
      volunteers: 'Aprove e gerencie inscrições de voluntários',
      complaints: 'Responda denúncias, reclamações e sugestões',
      subscribers: 'Base de subscritores da newsletter',
      alerts: 'Comunicados e alertas urgentes',
    }
    return descriptions[s] || ''
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sistema de Gestão</h1>
            <p className="text-xs text-slate-400">Partido Liberal · Secretaria Nacional</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="text-white hover:bg-white/10"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Sair
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-white/10"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white flex-shrink-0 overflow-y-auto">
          <nav className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu Principal</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id as Section)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    section === item.id
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${section === item.id ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <Badge variant={section === item.id ? 'secondary' : 'default'} className="text-xs font-semibold">
                      {item.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8 bg-slate-50">
          {section === 'dashboard' ? (
            <DashboardContent stats={stats} />
          ) : section === 'settings' ? (
            <SettingsSection />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{getSectionTitle(section)}</h2>
                  <p className="text-slate-500 mt-1">{getSectionDescription(section)}</p>
                </div>
                {['news', 'leaders', 'events', 'program', 'kit', 'alerts'].includes(section) && (
                  <Button 
                    type="button"
                    onClick={() => openForm()} 
                    className="bg-slate-800 hover:bg-slate-900"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Registro
                  </Button>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">{error}</p>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      onClick={() => fetchSectionData(section)} 
                      className="mt-3"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <ArrowPathIcon className="w-10 h-10 text-slate-400 animate-spin" />
                  <p className="text-slate-500 mt-4">Carregando dados...</p>
                </div>
              ) : data.length === 0 && !error ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium text-lg">Nenhum registro encontrado</p>
                  <p className="text-slate-400 mt-2 mb-6">Comece adicionando o primeiro registro</p>
                  {['news', 'leaders', 'events', 'program', 'kit', 'alerts'].includes(section) && (
                    <Button 
                      type="button"
                      onClick={() => openForm()} 
                      className="bg-slate-800 hover:bg-slate-900"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Adicionar primeiro registro
                    </Button>
                  )}
                </div>
              ) : !error && data.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {columns[section]?.map((col) => (
                          <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {col.label}
                          </th>
                        ))}
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          {columns[section]?.map((col) => (
                            <td key={col.key} className="px-6 py-4 text-sm text-slate-700">
                              {renderCell(col.key, row[col.key])}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                onClick={() => openForm(row)} 
                                className="hover:bg-slate-100"
                                title="Editar"
                              >
                                <PencilIcon className="w-4 h-4 text-slate-500" />
                              </Button>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteClick(row)} 
                                className="hover:bg-red-50"
                                title="Excluir"
                              >
                                <TrashIcon className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </>
          )}
        </main>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {editingItem ? (
                <>
                  <PencilIcon className="w-5 h-5 text-slate-500" />
                  Editar Registro
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 text-slate-500" />
                  Novo Registro
                </>
              )}
            </DialogTitle>
            <p className="text-sm text-slate-500">{getSectionTitle(section)}</p>
          </DialogHeader>
          
          <FormContent
            section={section}
            formData={formData}
            updateFormData={updateFormData}
          />
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={closeForm}
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleSave} 
              disabled={formLoading} 
              className="bg-slate-800 hover:bg-slate-900 min-w-[120px]"
            >
              {formLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>"{deleteItemName}"</strong>?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              {formLoading ? 'Excluindo...' : 'Excluir permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Settings Section
function SettingsSection() {
  const [config, setConfig] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-config')
      const result = await res.json()
      if (result.config) {
        setConfig(result.config)
      }
    } catch {
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        toast.error(result.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ArrowPathIcon className="w-10 h-10 text-slate-400 animate-spin" />
        <p className="text-slate-500 mt-4">Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurações do Site</h2>
          <p className="text-slate-500 mt-1">Configure a imagem do hero, vídeo institucional e textos principais</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-slate-800 hover:bg-slate-900 min-w-[180px]">
          {saving ? (
            <><ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
          ) : (
            <><CheckCircleIcon className="w-4 h-4 mr-2" />Salvar Configurações</>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <HomeIcon className="w-5 h-5 text-blue-600" />
            Seção Hero (Topo do Site)
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">URL da Imagem de Fundo</Label>
              <Input value={config.heroImage || ''} onChange={(e) => updateConfig('heroImage', e.target.value)} placeholder="https://exemplo.com/hero.jpg" className="mt-1.5" />
              {config.heroImage && (
                <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
                  <img src={config.heroImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Badge</Label>
                <Input value={config.heroBadge || ''} onChange={(e) => updateConfig('heroBadge', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Título Principal</Label>
                <Input value={config.heroTitle || ''} onChange={(e) => updateConfig('heroTitle', e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Subtítulo</Label>
              <Textarea value={config.heroSubtitle || ''} onChange={(e) => updateConfig('heroSubtitle', e.target.value)} rows={3} className="mt-1.5" />
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-violet-600" />
            Vídeo Institucional
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">URL do Vídeo (YouTube ou Vimeo)</Label>
              <Input value={config.videoUrl || ''} onChange={(e) => updateConfig('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="mt-1.5" />
              {config.videoUrl && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" /> URL do vídeo configurada
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Título do Vídeo</Label>
              <Input value={config.videoTitle || ''} onChange={(e) => updateConfig('videoTitle', e.target.value)} placeholder="Vídeo Institucional" className="mt-1.5" />
            </div>
          </div>
        </div>

        {/* Party Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-emerald-600" />
            Seção O Partido
          </h3>
          <div>
            <Label className="text-sm font-medium text-slate-700">Descrição do Partido</Label>
            <Textarea value={config.partyDescription || ''} onChange={(e) => updateConfig('partyDescription', e.target.value)} rows={3} className="mt-1.5" />
          </div>
        </div>

        {/* AI Integration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            Assistente IA (Chatbot)
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Chave API OpenRouter</Label>
              <Input
                type="password"
                value={config.openrouterApiKey || ''}
                onChange={(e) => updateConfig('openrouterApiKey', e.target.value)}
                placeholder="sk-or-v1-..."
                className="mt-1.5 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Usada para o chatbot IA no site. Obtenha em <span className="text-blue-600">openrouter.ai</span>. Modelo: Gemini 2.0 Flash.
              </p>
              {config.openrouterApiKey && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" /> Chave API configurada
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard
function DashboardContent({ stats }: { stats: Stats | null }) {
  if (!stats) return <div className="text-center py-20 text-slate-500">Carregando painel...</div>

  const cards = [
    { label: 'Notícias Publicadas', value: stats.news, icon: NewspaperIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Líderes Cadastrados', value: stats.leaders, icon: UsersIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Eventos Agendados', value: stats.events, icon: CalendarDaysIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Voluntários', value: stats.volunteers, icon: UsersIcon, color: 'text-amber-600', bg: 'bg-amber-50', sub: `${stats.pendingVolunteers} pendentes` },
    { label: 'Ouvidoria', value: stats.complaints, icon: ChatBubbleLeftEllipsisIcon, color: 'text-rose-600', bg: 'bg-rose-50', sub: `${stats.pendingComplaints} pendentes` },
    { label: 'Newsletter', value: stats.subscribers, icon: EnvelopeIcon, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Kit Digital', value: stats.kitItems, icon: CubeIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Comunicados Ativos', value: stats.activeAlerts, icon: BellAlertIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Painel Principal</h2>
        <p className="text-slate-500 mt-1">Visão geral do sistema de gestão</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{formatNumber(card.value)}</p>
                {card.sub && <p className="text-xs text-slate-400 mt-1">{card.sub}</p>}
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats */}
      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-slate-400" />
          Informações do Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            <span>Conexão com banco: <strong className="text-emerald-600">Ativa</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            <span>Sistema: <strong className="text-emerald-600">Operacional</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ClockIcon className="w-4 h-4 text-slate-400" />
            <span>Última atualização: <strong>{new Date().toLocaleString('pt-AO')}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Content
function FormContent({
  section,
  formData,
  updateFormData,
}: {
  section: Section
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}) {
  // Notícias
  if (section === 'news') {
    return (
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Título da Notícia <span className="text-red-500">*</span>
          </Label>
          <Input 
            value={formData.title || ''} 
            onChange={(e) => updateFormData('title', e.target.value)} 
            placeholder="Ex: Presidente participa de encontro com jovens" 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Categoria</Label>
            <Select value={formData.category || 'politica'} onValueChange={(v) => updateFormData('category', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="politica">Política</SelectItem>
                <SelectItem value="economia">Economia</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="institucional">Institucional</SelectItem>
                <SelectItem value="comunicado">Comunicado Oficial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Autor</Label>
            <Input 
              value={formData.author || ''} 
              onChange={(e) => updateFormData('author', e.target.value)} 
              placeholder="Nome do autor" 
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Resumo</Label>
          <Textarea 
            value={formData.summary || ''} 
            onChange={(e) => updateFormData('summary', e.target.value)} 
            placeholder="Breve descrição que aparecerá na listagem (máx. 200 caracteres)"
            maxLength={200}
            rows={2}
            className="mt-1.5"
          />
          <p className="text-xs text-slate-400 mt-1">{(formData.summary || '').length}/200 caracteres</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Conteúdo Completo</Label>
          <Textarea 
            value={formData.content || ''} 
            onChange={(e) => updateFormData('content', e.target.value)} 
            placeholder="Texto completo da notícia..."
            rows={6}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">URL da Imagem</Label>
          <Input 
            value={formData.image || ''} 
            onChange={(e) => updateFormData('image', e.target.value)} 
            placeholder="https://exemplo.com/imagem.jpg" 
            className="mt-1.5"
          />
        </div>
        <div className="flex items-center gap-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Switch 
              checked={formData.published || false} 
              onCheckedChange={(v) => updateFormData('published', v)} 
            />
            <div>
              <Label className="text-sm text-slate-700 font-medium">
                {formData.published ? 'Publicado' : 'Rascunho'}
              </Label>
              <p className="text-xs text-slate-400">
                {formData.published ? 'Visível no site' : 'Não visível no site'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={formData.featured || false} 
              onCheckedChange={(v) => updateFormData('featured', v)} 
            />
            <div>
              <Label className="text-sm text-slate-700 font-medium">Destaque</Label>
              <p className="text-xs text-slate-400">Aparecer em destaque</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Líderes
  if (section === 'leaders') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input 
              value={formData.name || ''} 
              onChange={(e) => updateFormData('name', e.target.value)} 
              placeholder="Nome completo" 
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Input 
              value={formData.role || ''} 
              onChange={(e) => updateFormData('role', e.target.value)} 
              placeholder="Ex: Presidente, Secretário-Geral" 
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Província</Label>
            <Select value={formData.province || ''} onValueChange={(v) => updateFormData('province', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {ANGOLAN_PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">URL da Foto</Label>
            <Input 
              value={formData.photo || ''} 
              onChange={(e) => updateFormData('photo', e.target.value)} 
              placeholder="https://..." 
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Biografia</Label>
          <Textarea 
            rows={4} 
            value={formData.bio || ''} 
            onChange={(e) => updateFormData('bio', e.target.value)} 
            placeholder="Trajetória política e atuação..." 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Ordem de Exibição</Label>
            <Input 
              type="number"
              value={formData.order || 0} 
              onChange={(e) => updateFormData('order', parseInt(e.target.value) || 0)} 
              className="mt-1.5"
            />
          </div>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-2">
              <Switch checked={formData.active ?? true} onCheckedChange={(v) => updateFormData('active', v)} />
              <Label className="text-sm text-slate-700 font-medium">Cadastro Ativo</Label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Eventos
  if (section === 'events') {
    return (
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Título do Evento <span className="text-red-500">*</span>
          </Label>
          <Input 
            value={formData.title || ''} 
            onChange={(e) => updateFormData('title', e.target.value)} 
            placeholder="Ex: Comício na cidade de Luanda" 
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Descrição</Label>
          <Textarea 
            rows={3} 
            value={formData.description || ''} 
            onChange={(e) => updateFormData('description', e.target.value)} 
            placeholder="Detalhes do evento..." 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Data</Label>
            <Input 
              type="date" 
              value={formData.date?.split('T')[0] || ''} 
              onChange={(e) => updateFormData('date', e.target.value)} 
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Hora</Label>
            <Input 
              type="time" 
              value={formData.time || ''} 
              onChange={(e) => updateFormData('time', e.target.value)} 
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Status</Label>
            <Select value={formData.status || 'agendado'} onValueChange={(v) => updateFormData('status', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Local</Label>
            <Input 
              value={formData.location || ''} 
              onChange={(e) => updateFormData('location', e.target.value)} 
              placeholder="Local do evento" 
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Província</Label>
            <Select value={formData.province || ''} onValueChange={(v) => updateFormData('province', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {ANGOLAN_PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">URL da Imagem</Label>
          <Input 
            value={formData.image || ''} 
            onChange={(e) => updateFormData('image', e.target.value)} 
            placeholder="https://..." 
            className="mt-1.5"
          />
        </div>
      </div>
    )
  }

  // Alertas
  if (section === 'alerts') {
    return (
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Título do Comunicado <span className="text-red-500">*</span>
          </Label>
          <Input 
            value={formData.title || ''} 
            onChange={(e) => updateFormData('title', e.target.value)} 
            placeholder="Ex: Aviso importante sobre eleições" 
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Mensagem <span className="text-red-500">*</span>
          </Label>
          <Textarea 
            rows={4} 
            value={formData.message || ''} 
            onChange={(e) => updateFormData('message', e.target.value)} 
            placeholder="Conteúdo do comunicado..." 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Tipo</Label>
            <Select value={formData.type || 'info'} onValueChange={(v) => updateFormData('type', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Informação</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-2">
              <Switch checked={formData.active ?? true} onCheckedChange={(v) => updateFormData('active', v)} />
              <div>
                <Label className="text-sm text-slate-700 font-medium">Ativo</Label>
                <p className="text-xs text-slate-400">Será exibido no site</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Programa
  if (section === 'program') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input 
              value={formData.title || ''} 
              onChange={(e) => updateFormData('title', e.target.value)} 
              placeholder="Ex: Educação de Qualidade" 
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Área Temática</Label>
            <Select value={formData.area || ''} onValueChange={(v) => updateFormData('area', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Economia">Economia</SelectItem>
                <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="Segurança">Segurança</SelectItem>
                <SelectItem value="Agricultura">Agricultura</SelectItem>
                <SelectItem value="Energia">Energia</SelectItem>
                <SelectItem value="Turismo">Turismo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Resumo</Label>
          <Textarea 
            value={formData.summary || ''} 
            onChange={(e) => updateFormData('summary', e.target.value)} 
            placeholder="Síntese da proposta..." 
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Conteúdo Detalhado</Label>
          <Textarea 
            rows={6} 
            value={formData.content || ''} 
            onChange={(e) => updateFormData('content', e.target.value)} 
            placeholder="Descrição completa da proposta..." 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Ordem de Exibição</Label>
            <Input 
              type="number"
              value={formData.order || 0} 
              onChange={(e) => updateFormData('order', parseInt(e.target.value) || 0)} 
              className="mt-1.5"
            />
          </div>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-2">
              <Switch checked={formData.active ?? true} onCheckedChange={(v) => updateFormData('active', v)} />
              <Label className="text-sm text-slate-700 font-medium">Proposta Ativa</Label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Kit
  if (section === 'kit') {
    return (
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Título do Material <span className="text-red-500">*</span>
          </Label>
          <Input 
            value={formData.title || ''} 
            onChange={(e) => updateFormData('title', e.target.value)} 
            placeholder="Ex: Banner Campanha 2025" 
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Descrição</Label>
          <Textarea 
            value={formData.description || ''} 
            onChange={(e) => updateFormData('description', e.target.value)} 
            placeholder="Descrição do material..." 
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Tipo</Label>
            <Select value={formData.type || 'documento'} onValueChange={(v) => updateFormData('type', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="apresentacao">Apresentação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">
              URL do Arquivo <span className="text-red-500">*</span>
            </Label>
            <Input 
              value={formData.fileUrl || ''} 
              onChange={(e) => updateFormData('fileUrl', e.target.value)} 
              placeholder="https://..." 
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">URL da Miniatura (Thumbnail)</Label>
          <Input 
            value={formData.thumbnail || ''} 
            onChange={(e) => updateFormData('thumbnail', e.target.value)} 
            placeholder="https://..." 
            className="mt-1.5"
          />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Switch checked={formData.active ?? true} onCheckedChange={(v) => updateFormData('active', v)} />
          <Label className="text-sm text-slate-700 font-medium">Material Disponível</Label>
        </div>
      </div>
    )
  }

  // Voluntários
  if (section === 'volunteers') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Nome</Label>
            <Input value={formData.name || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Email</Label>
            <Input value={formData.email || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Telefone</Label>
            <Input value={formData.phone || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Província</Label>
            <Input value={formData.province || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Status da Inscrição</Label>
          <Select value={formData.status || 'pendente'} onValueChange={(v) => updateFormData('status', v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  // Denúncias
  if (section === 'complaints') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Tipo</Label>
            <Input value={formData.type || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Data</Label>
            <Input value={formatDate(formData.createdAt) || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Assunto</Label>
          <Input value={formData.subject || ''} disabled className="mt-1.5 bg-slate-50" />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Mensagem Original</Label>
          <Textarea rows={4} value={formData.message || ''} disabled className="mt-1.5 bg-slate-50" />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Status</Label>
          <Select value={formData.status || 'pendente'} onValueChange={(v) => updateFormData('status', v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_analise">Em análise</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Resposta Oficial</Label>
          <Textarea 
            rows={4} 
            value={formData.response || ''} 
            onChange={(e) => updateFormData('response', e.target.value)} 
            placeholder="Digite a resposta para o cidadão..." 
            className="mt-1.5"
          />
        </div>
      </div>
    )
  }

  // Subscribers
  if (section === 'subscribers') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Nome</Label>
            <Input value={formData.name || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Email</Label>
            <Input value={formData.email || ''} disabled className="mt-1.5 bg-slate-50" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Status</Label>
          <Select value={formData.active ? 'ativo' : 'inativo'} onValueChange={(v) => updateFormData('active', v === 'ativo')}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="text-center py-8 text-slate-500">
      Selecione uma seção para gerenciar
    </div>
  )
}
