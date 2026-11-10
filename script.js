// ============================================================
// 5G & IoT Nexus - Interactive Scripts
// Pesquisa & Síntese por Luiz e Yan
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Data & Pillar Explorer
  // ============================================================
  const PILLARS_INFO = {
    urllc: {
      id: 'urllc',
      abbr: 'URLLC',
      title: 'Ultrabaixa Latência (Ultra-Reliable Low-Latency Communication)',
      color: '#00f0ff',
      lead: 'Tempo de resposta da rede reduzido para menos de 1 milissegundo (comparado a ~30-50 ms no 4G), viabilizando controle remoto crítico sem atrasos perceptíveis.',
      description: 'Fundamental para missões onde atrasos de frações de segundo podem causar acidentes graves ou falhas operacionais. Permite reação em tempo real para automação robótica e comandos médicos remotos.',
      specs: [
        'Latência extrema: < 1 milissegundo',
        'Confiabilidade garantida: 99.999% de entrega de pacotes',
        'Casos-chave: Cirurgias robóticas à distância e carros autônomos (V2X)'
      ]
    },
    embb: {
      id: 'embb',
      abbr: 'eMBB',
      title: 'Velocidade Extrema (Enhanced Mobile Broadband)',
      color: '#8b5cf6',
      lead: 'Taxas de download teóricas que podem alcançar até 10 Gbps operando em ondas milimétricas (mmWave 24 GHz+).',
      description: 'Entrega largura de banda absurda para aplicações ricas em dados visuais. Permite que centenas de câmeras de alta definição transmitam fluxos de vídeo 4K/8K sem compressão destrutiva.',
      specs: [
        'Taxas de pico: até 10 Gbps (10x a 100x superior ao 4G)',
        'Espectro estendido: Faixas Sub-6 GHz e ondas mmWave (24 GHz+)',
        'Casos-chave: Visão computacional no chão de fábrica e inspeções por drones'
      ]
    },
    mmtc: {
      id: 'mmtc',
      abbr: 'mMTC',
      title: 'Massiva Conectividade de Dispositivos (Massive Machine-Type Communications)',
      color: '#10b981',
      lead: 'Capacidade de conectar até 1 milhão de dispositivos por quilômetro quadrado, essencial para alta densidade urbana e industrial.',
      description: 'Supera o estrangulamento do 4G (que suportava apenas ~100 mil nós/km²). Permite que cidades inteiras tenham milhões de sensores simultâneos transmitindo leituras sem congestionamento.',
      specs: [
        'Densidade massiva: ~1.000.000 dispositivos/km²',
        'Integração nativa: eMTC e NB-IoT nativos no ecossistema 5G',
        'Casos-chave: Hidrômetros inteligentes, semáforos e iluminação pública'
      ]
    },
    slicing: {
      id: 'slicing',
      abbr: 'Network Slicing',
      title: 'Fatiamento de Rede (Redes Virtuais Definidas por Software - SDN)',
      color: '#f59e0b',
      lead: 'Capacidade de dividir uma única infraestrutura física de rede em múltiplas redes virtuais independentes com qualidade de serviço (QoS) garantida.',
      description: 'A rede 5G deixa de ser "tamanho único". É possível criar uma fatia com latência zero para ambulâncias, outra com altíssima banda para câmeras de segurança e outra econômica para sensores de temperatura, tudo na mesma antena.',
      specs: [
        'Arquitetura 100% virtualizada por software (SDN / NFV)',
        'Isolamento completo: o tráfego de uma fatia não afeta a outra',
        'Casos-chave: Fatias prioritárias para hospitais, polícia e indústrias críticas'
      ]
    }
  };

  const pillarButtons = document.querySelectorAll('.pillar-btn');
  const pillarDisplayCard = document.getElementById('pillarDisplayCard');

  function renderPillarCard(pillarKey) {
    const item = PILLARS_INFO[pillarKey];
    if (!item || !pillarDisplayCard) return;

    pillarDisplayCard.style.setProperty('--card-accent', item.color);
    pillarDisplayCard.innerHTML = `
      <div class="pillar-detail-grid">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: ${item.color}; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block; margin-bottom: 0.5rem;">
            Pilar 5G • ${item.abbr}
          </span>
          <h3 style="font-size: 1.6rem; margin-bottom: 0.75rem;">${item.title}</h3>
          <p class="pillar-lead">${item.lead}</p>
          <p class="pillar-desc">${item.description}</p>
        </div>
        <div>
          <div class="pillar-specs-box" style="border-left-color: ${item.color};">
            <h5 style="color: ${item.color};">Especificações & Relevância</h5>
            <ul>
              ${item.specs.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  pillarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillarButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pillarKey = btn.getAttribute('data-pillar');
      renderPillarCard(pillarKey);
    });
  });

  // Render initial pillar
  renderPillarCard('urllc');

  // ============================================================
  // 2. Ping & Latency Simulator (4G vs 5G)
  // ============================================================
  const btnRunPing = document.getElementById('btnRunPing');
  const valPing4G = document.getElementById('valPing4G');
  const valPing5G = document.getElementById('valPing5G');
  const dotPing4G = document.getElementById('dotPing4G');
  const dotPing5G = document.getElementById('dotPing5G');
  const statusPing4G = document.getElementById('statusPing4G');
  const statusPing5G = document.getElementById('statusPing5G');

  if (btnRunPing) {
    btnRunPing.addEventListener('click', () => {
      btnRunPing.disabled = true;
      btnRunPing.textContent = 'Enviando pacotes...';

      // Reset states
      valPing4G.textContent = '...';
      valPing5G.textContent = '...';
      statusPing4G.textContent = 'Calculando rota...';
      statusPing5G.textContent = 'Transmitindo via URLLC...';
      dotPing4G.className = 'ping-dot';
      dotPing5G.className = 'ping-dot';

      // 5G response: virtually instantaneous (1 to 4 ms simulated fast timer)
      setTimeout(() => {
        const rand5G = Math.floor(Math.random() * 3) + 1; // 1 to 3 ms
        valPing5G.textContent = `${rand5G} ms`;
        dotPing5G.className = 'ping-dot ping-active-5g';
        statusPing5G.textContent = '✓ Resposta instantânea (Tempo Real)';
      }, 180);

      // 4G response: noticeable lag (38 to 48 ms simulated timer)
      setTimeout(() => {
        const rand4G = Math.floor(Math.random() * 11) + 38; // 38 to 48 ms
        valPing4G.textContent = `${rand4G} ms`;
        dotPing4G.className = 'ping-dot ping-active-4g';
        statusPing4G.textContent = '⚠ Atraso perceptível para robótica';

        btnRunPing.disabled = false;
        btnRunPing.textContent = 'Disparar Novo Pulso ⚡';
      }, 750);
    });
  }

  // ============================================================
  // 3. Applications Tabs & Panels (Página 4 do PDF)
  // ============================================================
  const APPS_DATA = {
    industria: {
      title: 'Indústria 4.0 / Fábricas Inteligentes',
      subtitle: 'Automação industrial sem cabos com a velocidade e confiabilidade de Ethernet cabeada.',
      cases: [
        {
          icon: '🤖',
          title: 'Linhas de Montagem Flexíveis',
          desc: 'Layouts fabris modulares onde robôs móveis (AMRs) e células de trabalho são reconfigurados em minutos sem necessidade de recabeamento físico.'
        },
        {
          icon: '👁️',
          title: 'Controle de Qualidade por Visão Computacional',
          desc: 'Câmeras de altíssima resolução filmam peças na esteira e enviam fluxos de dados para servidores de borda para detectar falhas microscópicas em tempo real.'
        },
        {
          icon: '⚙️',
          title: 'Manutenção Preditiva em Maquinário Pesado',
          desc: 'Centenas de sensores de vibração, temperatura e pressão em motores antecipam quebras e desgastes com meses de antecedência.'
        }
      ]
    },
    cidades: {
      title: 'Cidades Inteligentes (Smart Cities)',
      subtitle: 'Conexão massiva de milhões de sensores urbanos sem saturação da rede celular.',
      cases: [
        {
          icon: '🚦',
          title: 'Gestão Integrada de Tráfego Urbano',
          desc: 'Semáforos inteligentes sincronizados em tempo real que abrem corredores rápidos para ambulâncias e adaptam o fluxo conforme o trânsito.'
        },
        {
          icon: '🛡️',
          title: 'Segurança Pública com Reconhecimento Facial',
          desc: 'Redes de câmeras de alta definição conectadas por 5G processando fluxos de segurança pública de forma descentralizada em tempo real.'
        },
        {
          icon: '🚰',
          title: 'Telemetria Avançada de Utilidades',
          desc: 'Medição automática e contínua de água, energia elétrica e lixeiras inteligentes com sensores subterrâneos de alta penetração.'
        }
      ]
    },
    saude: {
      title: 'Saúde Conectada (IoMT - Internet of Medical Things)',
      subtitle: 'Confiabilidade crítica onde cada milissegundo de resposta salva vidas.',
      cases: [
        {
          icon: '🩺',
          title: 'Cirurgias Robóticas à Distância',
          desc: 'Cirurgiões especialistas operam braços robóticos remotamente a centenas de quilômetros de distância graças à latência menor que 1 milissegundo.'
        },
        {
          icon: '❤️',
          title: 'Monitoramento de Pacientes Críticos em Tempo Real',
          desc: 'Dispositivos biomédicos conectados à beira do leito ou em home care transmitindo sinais vitais para alertar a equipe médica instantaneamente.'
        },
        {
          icon: '🚑',
          title: 'Ambulâncias Conectadas em Trânsito',
          desc: 'Transmissão de exames de tomografia, ultrassom e dados vitais diretamente ao hospital durante o percurso para preparação da sala cirúrgica.'
        }
      ]
    },
    veiculos: {
      title: 'Veículos Autônomos e Logística Inteligente',
      subtitle: 'Comunicação ultraveloz entre veículos e com as rodovias conectadas.',
      cases: [
        {
          icon: '🚗',
          title: 'Comunicação Veículo-a-Tudo (V2X)',
          desc: 'Carros autônomos comunicando-se instantaneamente entre si e com semáforos, placas e sensores da pista para prevenir colisões.'
        },
        {
          icon: '🚚',
          title: 'Frotas em Comboio Automatizado (Platooning)',
          desc: 'Caminhões trafegando com frenagem sincronizada em frações de milissegundo, reduzindo a resistência do ar e o consumo de combustível.'
        },
        {
          icon: '📦',
          title: 'Rastreamento Milimétrico de Cadeias de Suprimento',
          desc: 'Monitoramento detalhado de localização, temperatura de medicamentos e integridade de cargas valiosas em trânsito logístico nacional.'
        }
      ]
    }
  };

  const appTabs = document.querySelectorAll('.app-tab');
  const appPanels = document.getElementById('appPanels');

  function renderAppPanel(appKey) {
    const data = APPS_DATA[appKey];
    if (!data || !appPanels) return;

    appPanels.innerHTML = `
      <div class="app-panel">
        <div class="app-panel-header">
          <h3>${data.title}</h3>
          <p>${data.subtitle}</p>
        </div>
        <div class="app-usecases-grid">
          ${data.cases.map(c => `
            <div class="usecase-box">
              <div class="usecase-icon">${c.icon}</div>
              <h4>${c.title}</h4>
              <p>${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  appTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      appTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const appKey = tab.getAttribute('data-app');
      renderAppPanel(appKey);
    });
  });

  // Initial app render
  renderAppPanel('industria');

  // ============================================================
  // 4. Interactive Quiz
  // ============================================================
  const QUIZ_QUESTIONS = [
    {
      question: 'Qual é a principal diferença de propósito arquitetural entre o 4G e o 5G?',
      options: [
        { text: 'O 4G focou em banda larga móvel para humanos (streaming e redes), enquanto o 5G foi projetado para confiabilidade industrial e ultrabaixa latência de máquinas.', correct: true },
        { text: 'O 5G serve exclusivamente para chamadas de voz e eliminou os dados de internet.', correct: false },
        { text: 'O 4G foi feito para robôs e o 5G foi feito para celulares simples.', correct: false },
        { text: 'Não há diferença técnica, apenas uma mudança comercial de nome.', correct: false }
      ],
      explanation: 'Exatamente! O 5G prioriza a ultrabaixa latência (URLLC), conexão de 1 milhão de dispositivos/km² (mMTC) e fatiamento virtual de rede para transformar a indústria e a IoT.'
    },
    {
      question: 'Qual dos pilares técnicos do 5G reduz a latência para menos de 1 ms, permitindo cirurgias robóticas e carros autônomos?',
      options: [
        { text: 'URLLC (Ultra-Reliable Low-Latency Communication)', correct: true },
        { text: 'eMBB (Enhanced Mobile Broadband)', correct: false },
        { text: 'Sub-6 GHz tradicional', correct: false },
        { text: 'DSL cabeado', correct: false }
      ],
      explanation: 'Correto! O pilar URLLC é o responsável pela resposta em frações de milissegundo com 99.999% de confiabilidade.'
    },
    {
      question: 'Na relação simbiótica entre 5G e Inteligência Artificial, qual metáfora representa corretamente essa união?',
      options: [
        { text: 'A IA representa o "cérebro" das máquinas autônomas e o 5G atua como o "sistema nervoso" veloz que transmite dados e comandos em tempo real.', correct: true },
        { text: 'O 5G substitui completamente a IA para que os computadores não precisem de algoritmos.', correct: false },
        { text: 'A IA é usada apenas para gerar imagens e o 5G apenas para carregar vídeos no YouTube.', correct: false },
        { text: 'O 5G impede o uso de servidores de borda (Edge Computing).', correct: false }
      ],
      explanation: 'Perfeito! Se a IA pensa e toma decisões (cérebro), o 5G conduz os terabytes de telemetria e devolve as ordens de atuação em frações de milissegundo (sistema nervoso).'
    }
  ];

  let currentQuestion = 0;
  let userScore = 0;
  const quizContainer = document.getElementById('quizContainer');

  function renderQuiz() {
    if (!quizContainer) return;

    if (currentQuestion >= QUIZ_QUESTIONS.length) {
      // Quiz finished
      quizContainer.innerHTML = `
        <div class="quiz-summary">
          <span style="font-size: 2.2rem;">🏆</span>
          <h3>Parabéns por concluir o Teste!</h3>
          <p>Você compreendeu os pilares e impactos da revolução do 5G na IoT.</p>
          <div class="quiz-score-badge">${userScore} / ${QUIZ_QUESTIONS.length} Acertos</div>
          <button class="btn-pulse" style="margin-top: 1rem;" onclick="resetQuiz()">Refazer Teste ↺</button>
        </div>
      `;
      return;
    }

    const q = QUIZ_QUESTIONS[currentQuestion];
    quizContainer.innerHTML = `
      <div class="quiz-question-box">
        <span class="quiz-progress">Pergunta ${currentQuestion + 1} de ${QUIZ_QUESTIONS.length}</span>
        <h3 class="quiz-q-title">${q.question}</h3>
        <div class="quiz-answers" id="quizAnswers">
          ${q.options.map((opt, idx) => `
            <button class="quiz-opt-btn" data-idx="${idx}">${opt.text}</button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <button class="quiz-nav-btn" id="btnNextQuiz">Próxima Pergunta →</button>
      </div>
    `;

    const answerButtons = quizContainer.querySelectorAll('.quiz-opt-btn');
    const feedbackBox = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('btnNextQuiz');

    answerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-idx'));
        const opt = q.options[selectedIdx];

        // Disable all buttons after answering
        answerButtons.forEach(b => b.disabled = true);

        if (opt.correct) {
          btn.classList.add('correct');
          userScore++;
          feedbackBox.className = 'quiz-feedback show success';
          feedbackBox.innerHTML = `<strong>✓ Correto!</strong> ${q.explanation}`;
        } else {
          btn.classList.add('wrong');
          // highlight correct one
          q.options.forEach((o, i) => {
            if (o.correct) answerButtons[i].classList.add('correct');
          });
          feedbackBox.className = 'quiz-feedback show error';
          feedbackBox.innerHTML = `<strong>✕ Incorreto.</strong> ${q.explanation}`;
        }

        nextBtn.classList.add('show');
      });
    });

    nextBtn.addEventListener('click', () => {
      currentQuestion++;
      renderQuiz();
    });
  }

  window.resetQuiz = function() {
    currentQuestion = 0;
    userScore = 0;
    renderQuiz();
  };

  // Render initial quiz
  renderQuiz();

});
