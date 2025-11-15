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
   * Get project bids
   */
  async getProjectBids(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}/bids`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching project bids:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar propostas'
      }
    }
  },

  /**
   * Upload project attachment
   */
  async uploadAttachment(projectId, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post(
        `/api/projects/${projectId}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error uploading attachment:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer upload do arquivo'
      }
    }
  },

  /**
   * Get my projects (as client)
   */
  async getMyProjects(params = {}) {
    try {
      const response = await api.get('/api/projects/my-projects', { params })
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
   * Get featured projects
   */
  async getFeaturedProjects() {
    try {
      const response = await api.get('/api/projects', {
        params: { featured: true, limit: 6 }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar projetos em destaque'
      }
    }
  },

  /**
   * Get available project categories
   */
  getCategories() {
    return [
      { value: 'web', label: 'Desenvolvimento Web' },
      { value: 'mobile', label: 'Desenvolvimento Mobile' },
      { value: 'design', label: 'Design Gráfico' },
      { value: 'marketing', label: 'Marketing Digital' },
      { value: 'writing', label: 'Redação e Conteúdo' },
      { value: 'video', label: 'Vídeo e Animação' },
      { value: 'audio', label: 'Áudio e Música' },
      { value: 'translation', label: 'Tradução' },
      { value: 'data', label: 'Análise de Dados' },
      { value: 'consulting', label: 'Consultoria' },
      { value: 'other', label: 'Outros' }
    ]
  }
}

export default projectService
