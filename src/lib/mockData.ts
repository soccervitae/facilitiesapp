import type { Condominio, Morador, Boleto, Booking, Ticket, Assembly, Visitante, Encomenda, AuditLog, UserProfile } from '@/types';

export const mockCondominios: Condominio[] = [
  { id: 'cd-1', nome: 'Edifício Atlântico', endereco: 'Av. Ana Costa, 123', cidade: 'Santos', bairro: 'Gonzaga', unidades: 48, sindico: 'Carlos Eduardo', inadimplencia: 8.5, status: 'Ativo', dataCadastro: '2022-03-15' },
  { id: 'cd-2', nome: 'Residencial Praia Grande', endereco: 'Rua das Flores, 456', cidade: 'Praia Grande', bairro: 'Guilhermina', unidades: 32, sindico: 'Marina Figueiredo', inadimplencia: 12.1, status: 'Ativo', dataCadastro: '2021-07-20' },
  { id: 'cd-3', nome: 'Condomínio Guarujá Prime', endereco: 'Av. Puglisi, 789', cidade: 'Guarujá', bairro: 'Enseada', unidades: 60, sindico: 'Roberto Almeida', inadimplencia: 5.3, status: 'Ativo', dataCadastro: '2023-01-10' },
  { id: 'cd-4', nome: 'Torres São Vicente', endereco: 'Rua XV de Novembro, 321', cidade: 'São Vicente', bairro: 'Centro', unidades: 24, inadimplencia: 15.0, status: 'Ativo', dataCadastro: '2020-11-05' },
];

export const mockMoradores: Morador[] = [
  { id: 'm-1', nome: 'João Silva', unidade: 'Apto 42-A', email: 'joao@email.com', telefone: '(13) 99999-0001', tipo: 'Proprietário', status: 'Ativo', condominio_id: 'cd-1' },
  { id: 'm-2', nome: 'Ana Souza', unidade: 'Apto 15-B', email: 'ana@email.com', telefone: '(13) 99999-0002', tipo: 'Inquilino', status: 'Ativo', condominio_id: 'cd-1' },
  { id: 'm-3', nome: 'Pedro Costa', unidade: 'Apto 31-C', email: 'pedro@email.com', telefone: '(13) 99999-0003', tipo: 'Proprietário', status: 'Inadimplente', condominio_id: 'cd-1' },
  { id: 'm-4', nome: 'Maria Lima', unidade: 'Apto 08-D', email: 'maria@email.com', telefone: '(13) 99999-0004', tipo: 'Proprietário', status: 'Ativo', condominio_id: 'cd-1' },
];

export const mockBoletos: Boleto[] = [
  { id: 'b-1', referencia: 'JUN/2026', vencimento: '2026-06-10', valor: 850.00, status: 'Pago', codigoBarras: '23793.38128 60007.260233 71000.063305 1 10060000085000' },
  { id: 'b-2', referencia: 'JUL/2026', vencimento: '2026-07-10', valor: 850.00, status: 'Pendente', codigoBarras: '23793.38128 60007.260233 71000.063305 2 10070000085000' },
  { id: 'b-3', referencia: 'MAI/2026', vencimento: '2026-05-10', valor: 850.00, status: 'Pago', codigoBarras: '23793.38128 60007.260233 71000.063305 3 10050000085000' },
  { id: 'b-4', referencia: 'ABR/2026', vencimento: '2026-04-10', valor: 850.00, status: 'Atrasado', codigoBarras: '23793.38128 60007.260233 71000.063305 4 10040000085000' },
];

export const mockBookings: Booking[] = [
  { id: 'bk-1', area: 'Salão de Festas', data: '2026-06-20', periodo: 'Tarde', status: 'Confirmado' },
  { id: 'bk-2', area: 'Churrasqueira 1', data: '2026-06-28', periodo: 'Integral', status: 'Pendente' },
];

export const mockTickets: Ticket[] = [
  { id: 't-1', categoria: 'Manutenção', titulo: 'Vazamento no corredor do 3º andar', descricao: 'Há água pingando no teto do corredor.', dataCriacao: '2026-06-10', status: 'Em Andamento', prioridade: 'Alta', unidade: 'Apto 42-A' },
  { id: 't-2', categoria: 'Barulho', titulo: 'Barulho excessivo à noite', descricao: 'Vizinho do 5º andar fazendo barulho após 22h.', dataCriacao: '2026-06-12', status: 'Aberto', prioridade: 'Média', unidade: 'Apto 42-A' },
  { id: 't-3', categoria: 'Limpeza', titulo: 'Área da piscina precisa de limpeza', descricao: 'A piscina está com algas nas bordas.', dataCriacao: '2026-06-08', status: 'Resolvido', prioridade: 'Baixa', unidade: 'Área Comum' },
];

export const mockAssemblies: Assembly[] = [
  { id: 'a-1', titulo: 'Assembleia Ordinária – 2º Semestre 2026', data: '2026-07-15', hora: '19:00', pauta: 'Aprovação de contas; Eleição do novo conselho; Obras de manutenção.', votacaoAtiva: true, perguntaVotacao: 'Aprovar a reforma da fachada por R$ 45.000?', votosFavor: 28, votosContra: 6 },
  { id: 'a-2', titulo: 'Assembleia Extraordinária – Segurança', data: '2026-06-30', hora: '18:30', pauta: 'Discussão sobre instalação de câmeras de segurança nas áreas comuns.', votacaoAtiva: false },
];

export const mockVisitantes: Visitante[] = [
  { id: 'v-1', nome: 'Carlos Pereira', documento: '123.456.789-00', unidadeDestino: 'Apto 15-B', entrada: '2026-06-15 14:30', status: 'Dentro' },
  { id: 'v-2', nome: 'Fernanda Rocha', documento: '987.654.321-00', unidadeDestino: 'Apto 42-A', entrada: '2026-06-15 10:00', saida: '2026-06-15 11:30', status: 'Saiu' },
];

export const mockEncomendas: Encomenda[] = [
  { id: 'e-1', destinatario: 'João Silva', unidade: 'Apto 42-A', descricao: 'Caixa Amazon', dataRecebimento: '2026-06-14 09:30', status: 'Aguardando' },
  { id: 'e-2', destinatario: 'Ana Souza', unidade: 'Apto 15-B', descricao: 'Envelope Correios', dataRecebimento: '2026-06-13 15:00', dataRetirada: '2026-06-14 18:00', status: 'Retirado' },
];

export const mockAuditLog: AuditLog[] = [
  { id: 'au-1', usuario: 'Admin', acao: 'CREATE', entidade: 'Morador', detalhes: 'Novo morador João Silva cadastrado na unidade 42-A', data: '2026-06-15 09:00', ip: '192.168.1.1' },
  { id: 'au-2', usuario: 'Admin', acao: 'UPDATE', entidade: 'Boleto', detalhes: 'Status do boleto JUL/2026 alterado para Pendente', data: '2026-06-14 16:30', ip: '192.168.1.1' },
  { id: 'au-3', usuario: 'Síndico Carlos', acao: 'CREATE', entidade: 'Ticket', detalhes: 'Novo chamado #t-1 aberto: Vazamento no 3º andar', data: '2026-06-10 11:00', ip: '192.168.1.5' },
];

export const mockUsers: UserProfile[] = [
  { id: '456', nome: 'Dra. Cristhiane Xavier', email: 'admin@facilities.com.br', tipo: 'administrador', cpf: '456', unidade: 'Sede Administrativa', ativo: true, condominio_id: 'cd-1' },
  { id: '789', nome: 'Carlos Eduardo', email: 'sindico@facilities.com.br', tipo: 'sindico', cpf: '789', unidade: 'Apto 01-A', ativo: true, condominio_id: 'cd-1' },
  { id: '123', nome: 'Roberto Silva', email: 'contato@facilities.com.br', tipo: 'morador', cpf: '123', unidade: 'Apto 41-B', ativo: true, condominio_id: 'cd-1' },
  { id: '101', nome: 'Lucas Ferreira', email: 'colaborador@facilities.com.br', tipo: 'colaborador', cpf: '101', unidade: 'Portaria', ativo: true, condominio_id: 'cd-1' },
  { id: '102', nome: 'Marcos Porteiro', email: 'porteiro@facilities.com.br', tipo: 'porteiro', cpf: '102', unidade: 'Guarita', ativo: true, condominio_id: 'cd-1' },
];

export const DEFAULT_USERS = [
  { cpf: '123', email: 'contato@facilities.com.br', pass: '123', name: 'Roberto Silva', unit: 'Apto 41-B', profile: 'Morador', tipo: 'morador' },
  { cpf: '456', email: 'admin@facilities.com.br', pass: '456', name: 'Dra. Cristhiane Xavier', unit: 'Sede Administrativa', profile: 'Administrador', tipo: 'administrador' },
  { cpf: '789', email: 'sindico@facilities.com.br', pass: '789', name: 'Carlos Eduardo', unit: 'Apto 01-A', profile: 'Síndico', tipo: 'sindico' },
  { cpf: '101', email: 'colaborador@facilities.com.br', pass: '101', name: 'Lucas Ferreira', unit: 'Portaria', profile: 'Colaborador', tipo: 'colaborador' },
  { cpf: '102', email: 'porteiro@facilities.com.br', pass: '102', name: 'Marcos Porteiro', unit: 'Guarita', profile: 'Porteiro', tipo: 'porteiro' },
];
