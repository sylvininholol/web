import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Mensagens de erro globais
  'required': 'O campo {{ field }} é obrigatório',
  'string': 'O campo {{ field }} deve ser uma string',
  'email': 'O valor fornecido para {{ field }} não é um endereço de email válido',

  // Mensagem de erro específica para o campo email
  'email.required': 'Por favor, insira um endereço de email',
})
