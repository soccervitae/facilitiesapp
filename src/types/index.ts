export interface Boleto {
  id: string;
  referencia: string;
  vencimento: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  codigoBarras: string;
}

export interface Booking {
  id: string;
  area: string;
  data: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite' | 'Integral';
  status: 'Confirmado' | 'Pendente';
}

export interface Assembly {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  pauta: string;
  votacaoAtiva?: boolean;
  perguntaVotacao?: string;
  votosFavor?: number;
  votosContra?: number;
  votoUsuario?: 'Favor' | 'Contra';
}

export interface Ticket {
  id: string;
  categoria: 'Manutenção' | 'Limpeza' | 'Barulho' | 'Financeiro' | 'Outros';
  titulo: string;
  descricao: string;
  dataCriacao: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  prioridade?: 'Baixa' | 'Média' | 'Alta';
  unidade?: string;
}

export interface QuoteRequest {
  id: string;
  condominioNome: string;
  endereco: string;
  unidades: number;
  contatoNome: string;
  contatoEmail: string;
  contatoTelefone: string;
  cargo: 'Síndico' | 'Conselheiro' | 'Morador' | 'Administradora';
}

export interface ContactMessage {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  data: string;
}

export interface TipoPerfil {
  id: string;
  nome: string;
  descricao?: string;
  nivel: number;
}

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  nome: string;
  email: string;
  tipo: string;
  tipo_perfil_id?: string;
  tipo_perfil?: TipoPerfil;
  cpf?: string;
  unidade?: string;
  ativo?: boolean;
  perfil?: string;
  condominio_id?: string;
  telefone?: string;
  foto_url?: string;
}

export interface Condominio {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  bairro: string;
  unidades: number;
  sindico?: string;
  inadimplencia: number;
  status: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export interface Morador {
  id: string;
  nome: string;
  unidade: string;
  email: string;
  telefone: string;
  tipo: 'Proprietário' | 'Inquilino';
  status: 'Ativo' | 'Inativo' | 'Inadimplente';
  condominio_id: string;
}

export interface Visitante {
  id: string;
  nome: string;
  documento: string;
  unidadeDestino: string;
  entrada: string;
  saida?: string;
  status: 'Dentro' | 'Saiu';
}

export interface Encomenda {
  id: string;
  destinatario: string;
  unidade: string;
  descricao: string;
  dataRecebimento: string;
  dataRetirada?: string;
  status: 'Aguardando' | 'Retirado';
}

export interface AuditLog {
  id: string;
  usuario: string;
  acao: string;
  entidade: string;
  detalhes: string;
  data: string;
  ip?: string;
}
