const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateProjectData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Título deve ter pelo menos 5 caracteres');
  }
  
  if (!data.description || data.description.trim().length < 20) {
    errors.push('Descrição deve ter pelo menos 20 caracteres');
  }
  
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Categoria é obrigatória');
  }
  
  if (!data.budget || isNaN(parseFloat(data.budget)) || parseFloat(data.budget) <= 0) {
    errors.push('Orçamento deve ser um valor válido maior que zero');
  }
  
  if (data.deadline) {
    const deadline = new Date(data.deadline);
    const now = new Date();
    
    if (deadline < now) {
      errors.push('Prazo não pode ser no passado');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateBidData = (data) => {
  const errors = [];
  
  if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
    errors.push('Valor da proposta deve ser um número válido maior que zero');
  }
  
  if (!data.proposal || data.proposal.trim().length < 1) {
    errors.push('Proposta é obrigatória');
  }
  
  if (data.delivery_time && (isNaN(parseInt(data.delivery_time)) || parseInt(data.delivery_time) <= 0)) {
    errors.push('Tempo de entrega deve ser um número válido maior que zero');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .substring(0, 10000); // Limit length
};

const validatePhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  
  // Brazilian phone number format
  const phoneRegex = /^(\+55\s?)?\(?[1-9]{2}\)?\s?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProjectData,
  validateBidData,
  sanitizeInput,
  validatePhoneNumber
};
