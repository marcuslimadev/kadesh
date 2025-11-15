import api from './api'

export const projectService = {
  /**
   * Get all projects with filters and pagination
   */
  async getProjects(params = {}) {
    try {
      const response = await api.get('/api/projects', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar projetos'
      }
    }
  },

  /**
   * Get project by ID
   */
  async getProject(id) {
    try {
      const response = await api.get(`/api/projects/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar projeto'
      }
    }
  },

  /**
   * Create new project
   */
  async createProject(projectData) {
    try {
      const response = await api.post('/api/projects', projectData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating project:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar projeto'
      }
    }
  },

  /**
   * Update project
   */
  async updateProject(id, projectData) {
    try {
      const response = await api.put(`/api/projects/${id}`, projectData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error updating project:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar projeto'
      }
    }
  },

  /**
   * Delete project
   */
  async deleteProject(id) {
    try {
      await api.delete(`/api/projects/${id}`)
      return {
        success: true
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao deletar projeto'
      }
    }
  },

  /**
   * Get my projects (as client or provider)
   */
  async getMyProjects(params = {}) {
    try {
      const response = await api.get('/api/projects/my', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching my projects:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar seus projetos'
      }
    }
  },

  /**
   * Get project categories
   */
  getCategories() {
    return [
      { value: 'desenvolvimento-web', label: 'Desenvolvimento Web' },
      { value: 'desenvolvimento-mobile', label: 'Desenvolvimento Mobile' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'redacao', label: 'Redação' },
      { value: 'traducao', label: 'Tradução' },
      { value: 'video', label: 'Vídeo & Animação' },
      { value: 'audio', label: 'Áudio & Música' },
      { value: 'consultoria', label: 'Consultoria' },
      { value: 'outros', label: 'Outros' }
    ]
  },

  /**
   * Get project statuses
   */
  getStatuses() {
    return [
      { value: 'open', label: 'Aberto' },
      { value: 'in_progress', label: 'Em Andamento' },
      { value: 'completed', label: 'Concluído' },
      { value: 'cancelled', label: 'Cancelado' }
    ]
  }
}

export default projectService
