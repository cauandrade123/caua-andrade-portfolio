import { projectsSchema } from "@/types";

// Os textos de `case` são rascunhos feitos a partir das descrições dos projetos e não trazem métricas.
// `results` fica vazio até haver números reais; a página de case só mostra a seção quando houver itens.
// `story` sai do código de cada repositório (rotas, middlewares, consultas e logs reais). Ids, datas e códigos
// nas telas são exemplos. O API Gateway não tem repositório público, então fica sem `story`.
export const projects = projectsSchema.parse([
  {
    slug: "clinica-medica",
    title: "Sistema de Gerenciamento de Clínica Médica",
    pitch: "Agenda, prontuário e financeiro de uma clínica num sistema só.",
    notification: { title: "Consulta confirmada", detail: "E-mail enviado ao paciente" },
    summary:
      "Sistema completo para gestão de clínicas médicas com agendamento de consultas, prontuário eletrônico, gestão de pacientes e relatórios financeiros. Integração com sistemas de pagamento e notificações automatizadas.",
    tags: ["Node.js", "MySQL", "AWS", "REST API"],
    year: 2024,
    status: "published",
    icon: "Building2",
    links: { github: "https://github.com/cauandrade123/doctors-health-api" },
    case: {
      problem: "Reunir em um só sistema a rotina de uma clínica: agenda de consultas, prontuário eletrônico, cadastro de pacientes e relatórios financeiros.",
      solution:
        "API em Node.js com MySQL que cobre agendamento de consultas, prontuário eletrônico, gestão de pacientes e relatórios financeiros, integrada a sistemas de pagamento e a notificações automatizadas.",
      stack: ["Node.js", "MySQL", "AWS", "REST API"],
      results: [],
      story: {
        title: "Do cadastro do paciente à confirmação por e-mail",
        kind: "http",
        window: "doctors-health-api",
        steps: [
          {
            id: "cpf",
            title: "O sistema confere o CPF",
            body: "Antes de cadastrar, o front pergunta à API se aquele CPF já está na base de pacientes.",
            screen: {
              command: "POST /verificar-cpf",
              lines: ['{ "cpf": "000.000.000-00" }', "", "200 OK", '{ "existe": false }'],
              chips: [{ label: "tb_auto_cadastro", tone: "neutral" }],
            },
          },
          {
            id: "horarios",
            title: "Mostra só os horários livres",
            body: "Para a data escolhida, a API devolve os horários já ocupados na agenda, e o paciente escolhe entre os que sobram.",
            screen: {
              command: "POST /horarios-ocupados",
              lines: ['{ "data": "2026-11-12" }', "", "200 OK", '{ "horariosOcupados": [', '  [{ "hora": "09:00:00" }, { "hora": "10:30:00" }]', "] }"],
              chips: [{ label: "SELECT TIME(dia_horario)", tone: "neutral" }],
            },
          },
          {
            id: "cadastro",
            title: "Cadastra e já devolve um token",
            body: "O autocadastro grava o paciente no MySQL e assina um JWT válido por 5 horas, para ele acompanhar as próprias consultas sem criar senha.",
            screen: {
              command: "POST /autocadastro",
              lines: ['{ "nome": "…", "cpf": "…", "email": "…" }', "", "200 OK", "{", '  "confirmação": "Consulta agendada!",', '  "pacienteId": 57,', '  "token": "eyJhbGciOi…"', "}"],
              chips: [{ label: "JWT · 5h", tone: "accent" }],
            },
          },
          {
            id: "email",
            title: "Envia a confirmação por e-mail",
            body: "A API monta um e-mail em HTML com a data e o horário da consulta e envia pelo Nodemailer.",
            screen: {
              command: "POST /enviar",
              lines: ['{ "nome": "…", "email": "…",', '  "data": "12/11", "horario": "14:30" }', "", "200 OK", '{ "mensagem": "Email enviado com sucesso." }'],
              chips: [{ label: "Nodemailer", tone: "neutral" }],
            },
          },
          {
            id: "consultas",
            title: "O paciente vê as próprias consultas",
            body: "Com o token no cabeçalho, a rota protegida devolve só as consultas daquele paciente.",
            screen: {
              command: "GET /MinhasConsultas",
              lines: ["Authorization: Bearer eyJhbGciOi…", "", "200 OK", '[{ "dia_horario": "2026-11-12T14:30:00" }]'],
              chips: [{ label: "JWT válido", tone: "accent" }],
            },
          },
        ],
      },
    },
  },
  {
    slug: "automacao-planilhas",
    title: "Automação de Planilhas Excel",
    pitch: "Um robô que cadastra notas a partir da planilha, sem digitação manual.",
    notification: { title: "Nota cadastrada", detail: "Nota Fiscal Paulista · próxima do lote" },
    summary:
      "Sistema de automação e validação de dados em planilhas Excel, desenvolvido para otimizar processos manuais de cadastro, com foco em redução de erros, padronização de informações e ganho de produtividade.",
    tags: ["Node.js", "Excel", "Electron", "Puppeteer"],
    year: 2025,
    status: "published",
    icon: "FileSpreadsheet",
    links: { github: "https://github.com/thiago-vieira2/electron-automation" },
    case: {
      problem: "Reduzir erros e retrabalho no cadastro manual de dados a partir de planilhas Excel.",
      solution:
        "Aplicação Electron com Puppeteer que automatiza e valida o cadastro a partir das planilhas, padronizando as informações e aumentando a produtividade.",
      stack: ["Node.js", "Excel", "Electron", "Puppeteer"],
      results: [],
      story: {
        title: "Da planilha ao cadastro na Nota Fiscal Paulista",
        kind: "terminal",
        window: "electron-automation",
        steps: [
          {
            id: "planilha",
            title: "A planilha entra no app",
            body: "A pessoa escolhe o arquivo Excel na interface do Electron, que manda o conteúdo para o processo principal por IPC.",
            screen: {
              command: "ipc › iniciar-navegador",
              lines: ['xlsx.read(buffer, { type: "buffer" })', "Aba selecionada: Planilha1"],
              chips: [{ label: "IPC", tone: "neutral" }],
            },
          },
          {
            id: "notas",
            title: "Lê as notas e tira as repetidas",
            body: "A automação lê a primeira coluna, descarta células vazias e remove códigos duplicados antes de começar.",
            screen: {
              command: "handlePrimeiraColuna()",
              lines: ["Linha 1, Coluna 1: 3525…", "Linha 2, Coluna 1: 3525…", "Linha 3, Coluna 1: 3525…", "", "Notas únicas a serem processadas: 3"],
              chips: [{ label: "sem duplicadas", tone: "accent" }],
            },
          },
          {
            id: "login",
            title: "Espera o login manual",
            body: "O Puppeteer abre o site da Nota Fiscal Paulista e espera a pessoa entrar com a própria conta. A senha nunca passa pela automação.",
            screen: {
              command: "aguardarURLCorreta()",
              lines: ["Aguardando a navegação manual para a URL:", "…/ListagemNotaEntidade.aspx", "", "Navegação para a URL esperada detectada!"],
              chips: [{ label: "sem senha salva", tone: "accent" }],
            },
          },
          {
            id: "cadastro",
            title: "Cadastra nota por nota",
            body: "Para cada código, o robô limpa o campo, cola a nota, clica em Salvar Nota e espera alguns segundos antes da próxima, para não sobrecarregar o site.",
            screen: {
              command: "executarAutomacao(codigoNota)",
              lines: ["Processando nota 1/3: 3525…", "Nota cadastrada com sucesso: 3525…", "Processando nota 2/3: 3525…"],
              chips: [{ label: "Puppeteer", tone: "neutral" }],
            },
          },
          {
            id: "duplicadas",
            title: "Pula o que já existe",
            body: "Se o site responde que a nota já foi cadastrada, a automação registra no log e segue para a próxima, sem travar o lote.",
            screen: {
              command: "#lblErro",
              lines: ['"Este pedido já existe no sistema."', "Nota 3525… já foi cadastrada. Pulando para a próxima.", "", "Automação concluída com sucesso."],
              chips: [{ label: "o lote não trava", tone: "accent" }],
            },
          },
        ],
      },
    },
  },
  {
    slug: "api-gateway",
    title: "API Gateway Escalável",
    pitch: "Um ponto único de autenticação e controle de tráfego na frente dos serviços.",
    notification: { title: "Em desenvolvimento", detail: "Rate limiting · JWT · balanceamento" },
    summary: "Gateway de API em desenvolvimento, com limite de requisições (rate limiting), autenticação JWT e balanceamento de carga.",
    tags: ["Node.js", "Docker", "AWS"],
    year: 2026,
    status: "in-progress",
    icon: "Cloud",
    links: {},
    preview: {
      kind: "http",
      window: "api-gateway",
      screen: {
        command: "em desenvolvimento",
        lines: ["rate limiting", "autenticação JWT", "balanceamento de carga", "", "Node.js · Docker · AWS"],
        chips: [{ label: "em desenvolvimento", tone: "neutral" }],
      },
    },
    case: {
      problem: "Concentrar em um ponto único a autenticação, o controle de tráfego e a distribuição de carga na frente dos serviços.",
      solution:
        "Gateway em Node.js, empacotado com Docker, com limite de requisições (rate limiting), autenticação JWT e balanceamento de carga. O projeto está em desenvolvimento.",
      stack: ["Node.js", "Docker", "AWS"],
      results: [],
    },
  },
  {
    slug: "barbearias",
    title: "Sistema para Barbearias",
    pitch: "Agendamento online em que dois clientes nunca pegam o mesmo horário.",
    notification: { title: "Horário agendado", detail: "201 Created · 14:30" },
    summary:
      "Sistema completo de gestão para barbearias com agendamento online, painel administrativo, controle de clientes e serviços. Desenvolvido em Node.js com MySQL, autenticação JWT e controle de acesso baseado em roles (RBAC).",
    tags: ["Node.js", "MySQL", "JWT", "RBAC", "REST API", "Docker", "AWS"],
    year: 2026,
    status: "published",
    icon: "Scissors",
    links: { github: "https://github.com/cauandrade123/backend-barbershop" },
    case: {
      problem: "Dar às barbearias um sistema para agendamento online e para o controle de clientes e serviços.",
      solution:
        "Back-end em Node.js com MySQL: agendamento online, painel administrativo, controle de clientes e serviços, autenticação JWT e controle de acesso por papéis (RBAC). A stack inclui Docker e AWS.",
      stack: ["Node.js", "MySQL", "JWT", "RBAC", "REST API", "Docker", "AWS"],
      results: [],
      story: {
        title: "Um horário marcado, do pedido à resposta",
        kind: "http",
        window: "backend-barbershop",
        steps: [
          {
            id: "token",
            title: "O cliente se identifica",
            body: "Toda rota de agendamento passa antes pelo middleware de autenticação. Sem um token Bearer válido, a requisição para ali com 401.",
            screen: {
              command: "POST /marcarservico",
              lines: ["Authorization: Bearer eyJhbGciOi…", "", "{", '  "servico_id": 3,', '  "data_agendamento": "2026-11-12",', '  "hora_agendamento": "14:30"', "}"],
              chips: [{ label: "JWT válido", tone: "accent" }],
            },
          },
          {
            id: "validacao",
            title: "Os dados são conferidos",
            body: "A data precisa estar no formato certo e não pode ser no passado, a hora precisa ser válida e o serviço precisa existir. Qualquer erro volta como 400, com a mensagem em português.",
            screen: {
              command: "validarNovoAgendamento(corpo)",
              lines: ["servico_id: 3  → existe em servicos", "data: 2026-11-12  → não está no passado", "hora: 14:30  → HH:MM válido"],
              chips: [{ label: "400 se inválido", tone: "neutral" }],
            },
          },
          {
            id: "bloqueio",
            title: "O horário é travado",
            body: "Para dois clientes não marcarem o mesmo horário ao mesmo tempo, o repositório pede ao MySQL um lock nomeado (GET_LOCK) para aquele serviço, dia e hora antes de olhar a agenda.",
            screen: {
              command: "SELECT GET_LOCK(?, 5)",
              lines: ["nome: barbearia:horario:3:2026-11-12:14:30", "", "bloqueado: 1"],
              chips: [
                { label: "GET_LOCK", tone: "accent" },
                { label: "503 se não travar", tone: "neutral" },
              ],
            },
          },
          {
            id: "gravacao",
            title: "A agenda é conferida e gravada",
            body: "Com o horário travado, a API procura um agendamento ativo no mesmo horário. Se houver, devolve 409. Se não, grava com status agendado e libera o lock.",
            screen: {
              command: "INSERT INTO agendamentos",
              lines: ["SELECT id FROM agendamentos", "  WHERE servico_id = 3 AND status != 'cancelado'", "→ 0 linhas", "", "INSERT … VALUES (…, 'agendado')", "SELECT RELEASE_LOCK(?)"],
              chips: [{ label: "409 se ocupado", tone: "neutral" }],
            },
          },
          {
            id: "resposta",
            title: "O cliente recebe a confirmação",
            body: "A resposta volta com 201 e o id do agendamento. Com o mesmo token o cliente lista os próprios horários, e só administradores (RBAC) veem a agenda completa.",
            screen: {
              command: "201 Created",
              lines: ["{", '  "id": 128,', '  "message": "Horário agendado!"', "}"],
              chips: [
                { label: "201 Created", tone: "accent" },
                { label: "RBAC: isAdmin", tone: "neutral" },
              ],
            },
          },
        ],
      },
    },
  },
]);
