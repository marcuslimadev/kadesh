import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { toast } from 'vue-toastification'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([])
  const currentProject = ref(null)
  const userProjects = ref([])
  const isLoading = ref(false)
  const pagination = ref({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  })

  // Getters
  const featuredProjects = computed(() => 
    projects.value.filter(project => project.featured)
  )

  const openProjects = computed(() => 
    projects.value.filter(project => project.status === 'open')
  )

  // Actions
  const fetchProjects = async (filters = {}) => {
    isLoading.value = true
    try {
      const params = {
        limit: pagination.value.limit,
        offset: pagination.value.offset,
        ...filters
      }

      const response = await api.get('/api/projects', { params })
      
      if (pagination.value.offset === 0) {
        projects.value = response.data.projects
      } else {
        projects.value.push(...response.data.projects)
      }

      pagination.value = {
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
        hasMore: response.data.projects.length === response.data.limit
      }

      return { success: true }
    } catch (error) {
      console.error('Fetch projects error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao carregar projetos'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchProject = async (id) => {
    isLoading.value = true
    try {
      const response = await api.get(`/api/projects/${id}`)
      currentProject.value = response.data.project
      return { success: true, project: response.data.project }
    } catch (error) {
      console.error('Fetch project error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao carregar projeto'
      }
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async (projectData) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/projects', projectData)
      
      const newProject = response.data.project
      projects.value.unshift(newProject)
      userProjects.value.unshift(newProject)

      toast.success('Projeto criado com sucesso!')
      return { success: true, project: newProject }
    } catch (error) {
      console.error('Create project error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar projeto'
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateProject = async (id, projectData) => {
    isLoading.value = true
    try {
      const response = await api.put(`/api/projects/${id}`, projectData)
      
      const updatedProject = response.data.project

      // Update in lists
      const projectIndex = projects.value.findIndex(p => p.id === id)
      if (projectIndex !== -1) {
        projects.value[projectIndex] = updatedProject
      }

      const userProjectIndex = userProjects.value.findIndex(p => p.id === id)
      if (userProjectIndex !== -1) {
        userProjects.value[userProjectIndex] = updatedProject
      }

      if (currentProject.value?.id === id) {
        currentProject.value = updatedProject
      }

      toast.success('Projeto atualizado com sucesso!')
      return { success: true, project: updatedProject }
    } catch (error) {
      console.error('Update project error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar projeto'
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteProject = async (id) => {
    isLoading.value = true
    try {
      await api.delete(`/api/projects/${id}`)
      
      // Remove from lists
      projects.value = projects.value.filter(p => p.id !== id)
      userProjects.value = userProjects.value.filter(p => p.id !== id)
      
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }

      toast.success('Projeto deletado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('Delete project error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao deletar projeto'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserProjects = async (status = 'all') => {
    isLoading.value = true
    try {
      const params = { status, limit: 50 }
      const response = await api.get('/api/projects/user/my-projects', { params })
      
      userProjects.value = response.data.projects
      return { success: true }
    } catch (error) {
      console.error('Fetch user projects error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao carregar seus projetos'
      }
    } finally {
      isLoading.value = false
    }
  }

  const searchProjects = async (query, filters = {}) => {
    return fetchProjects({ search: query, ...filters })
  }

  const loadMoreProjects = async (filters = {}) => {
    if (!pagination.value.hasMore || isLoading.value) return

    pagination.value.offset += pagination.value.limit
    return fetchProjects(filters)
  }

  const resetPagination = () => {
    pagination.value.offset = 0
    pagination.value.hasMore = false
  }

  const clearCurrentProject = () => {
    currentProject.value = null
  }

  return {
    // State
    projects,
    currentProject,
    userProjects,
    isLoading,
    pagination,
    
    // Getters
    featuredProjects,
    openProjects,
    
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchUserProjects,
    searchProjects,
    loadMoreProjects,
    resetPagination,
    clearCurrentProject
  }
})