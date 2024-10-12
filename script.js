document.addEventListener('DOMContentLoaded', function () {
    // Seleção de elementos do DOM
    const resultadoIcon = document.getElementById('resultadoIcon');
    const palpiteIcon = document.getElementById('palpiteIcon');
    const jogarIcon = document.getElementById('jogarIcon');
    const compartilharIcon = document.getElementById('compartilharIcon');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const expandMenu = document.getElementById('expandMenu');
    const contatoLink = document.getElementById('contatoLink');
    const instalarAppLink = document.getElementById('instalarAppLink');

    const selecionarNomeSection = document.getElementById('selecionarNome');
    const exibirResultadoSection = document.getElementById('exibirResultado');
    const modoPalpiteSection = document.getElementById('modoPalpite');
    const modoJogarSection = document.getElementById('modoJogar');
    const fecharIframeBtn = document.getElementById('fecharIframe'); // Novo botão de fechar

    const menuLoteriasDiv = document.getElementById('menuLoterias');
    const nomeSelecionadoHeader = document.getElementById('nomeSelecionado');
    const dropdownTitulos = document.getElementById('dropdownTitulos');
    const resultadosDiv = document.getElementById('resultados');
    const mostrarPalpiteBtn = document.getElementById('mostrarPalpiteBtn');
    const dropdownPalpite = document.getElementById('dropdownPalpite');
    const palpiteConteudoDiv = document.getElementById('palpiteConteudo');
    const frasesPalpitesDiv = document.getElementById('frasesPalpites');
    const selecionarLoteriaLink = document.getElementById('selecionarLoteriaLink');

    // Novas Seções de Conteúdo
    const comoFuncionaSection = document.getElementById('comoFunciona');
    const politicasPrivacidadeSection = document.getElementById('politicasPrivacidade');
    const termosServicoSection = document.getElementById('termosServico');
    const sobreSection = document.getElementById('sobre');

    // Chaves do localStorage
    const localStorageModeKey = 'appMode';
    const localStorageNameKey = 'lastSelectedName';
    const localStorageTitleKey = 'lastSelectedTitle';
    const localStorageSharedKey = 'hasShared'; // Nova chave para status de compartilhamento

    // Estado atual
    let currentMode = 'Resultado'; // Modo padrão
    let deferredPrompt; // Para armazenar o evento beforeinstallprompt

    // Função para esconder todas as seções
    function hideAllSections() {
        selecionarNomeSection.classList.add('hidden');
        exibirResultadoSection.classList.add('hidden');
        modoPalpiteSection.classList.add('hidden');
        modoJogarSection.classList.add('hidden');
        comoFuncionaSection.classList.add('hidden');
        politicasPrivacidadeSection.classList.add('hidden');
        termosServicoSection.classList.add('hidden');
        sobreSection.classList.add('hidden');
        fecharIframeBtn.classList.add('hidden'); // Esconde o botão de fechar
    }

    // Função para exibir a seção selecionada
    function showSection(section) {
        hideAllSections();
        section.classList.remove('hidden');
    }

    // Função para popular o menu vertical de loterias na seção 'Selecionar Loteria'
    function populateMenuLoterias() {
        menuLoteriasDiv.innerHTML = ''; // Limpa o menu existente

        if (!resultado) {
            menuLoteriasDiv.textContent = 'Dados indisponíveis.';
            return;
        }

        Object.keys(resultado).forEach(nome => {
            const btn = document.createElement('button');
            btn.classList.add('menu-loteria-item');
            btn.textContent = nome;
            btn.addEventListener('click', function () {
                selecionarLoteria(nome);
            });
            menuLoteriasDiv.appendChild(btn);
        });
    }

    // Função para selecionar uma loteria e exibir resultados
    function selecionarLoteria(nome) {
        if (!nome || !resultado[nome]) {
            alert('Loteria selecionada inválida.');
            return;
        }

        // Atualiza o localStorage
        localStorage.setItem(localStorageNameKey, nome);
        // Limpa o último título selecionado
        localStorage.removeItem(localStorageTitleKey);

        // Atualiza o header com o nome selecionado
        nomeSelecionadoHeader.textContent = nome;

        // Popula o dropdown de títulos
        populateDropdownTitulos(nome);

        // Seleciona o último título se existir
        setLastSelectedTitle(nome);

        // Exibe a seção de resultados
        showSection(exibirResultadoSection);
    }

    // Função para popular o dropdown de títulos
    function populateDropdownTitulos(nome) {
        dropdownTitulos.innerHTML = '<option value="" disabled selected>Selecione um título</option>'; // Inicialmente com uma opção
        dropdownTitulos.classList.add('hidden'); // Esconde o dropdown até que um título seja selecionado

        const titulos = resultado[nome].map(item => item.titulo);

        titulos.forEach(titulo => {
            const option = document.createElement('option');
            option.value = titulo;
            option.textContent = titulo;
            dropdownTitulos.appendChild(option);
        });
    }

    // Função para definir o último título selecionado
    function setLastSelectedTitle(nome) {
        const lastTitle = localStorage.getItem(localStorageTitleKey);
        if (lastTitle && resultado[nome].some(item => item.titulo === lastTitle)) {
            dropdownTitulos.value = lastTitle;
            displayResultado(nome, lastTitle);
            dropdownTitulos.classList.remove('hidden'); // Mostra o dropdown de títulos
        } else {
            // Seleciona o primeiro título
            if (resultado[nome].length > 0) {
                const primeiroTitulo = resultado[nome][0].titulo;
                dropdownTitulos.value = primeiroTitulo;
                displayResultado(nome, primeiroTitulo);
                dropdownTitulos.classList.remove('hidden'); // Mostra o dropdown de títulos
            }
        }
    }

    // Função para exibir o resultado baseado no nome e título
    function displayResultado(nome, titulo) {
        resultadosDiv.innerHTML = ''; // Limpa resultados anteriores

        const tituloObj = resultado[nome].find(item => item.titulo === titulo);
        if (!tituloObj) {
            resultadosDiv.textContent = 'Título não encontrado.';
            return;
        }

        const tabela = criarTabela(tituloObj.conteudo);
        resultadosDiv.appendChild(tabela);

        // Atualiza o localStorage com o título selecionado
        localStorage.setItem(localStorageTitleKey, titulo);

        // Mostra o dropdown de títulos
        dropdownTitulos.classList.remove('hidden');
    }

    // Função para criar uma tabela a partir do conteúdo
    function criarTabela(conteudo) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cabeçalho da tabela
        const headerRow = document.createElement('tr');
        conteudo[0].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Corpo da tabela
        conteudo.slice(1).forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    // Função para lidar com a mudança de título no dropdown
    dropdownTitulos.addEventListener('change', function () {
        const selectedTitulo = this.value;
        const selectedNome = nomeSelecionadoHeader.textContent;
        if (selectedNome && selectedTitulo) {
            displayResultado(selectedNome, selectedTitulo);
        }
    });

    // Função para lidar com o clique no ícone 'Resultado'
    resultadoIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Resultado';
        localStorage.setItem(localStorageModeKey, 'Resultado');
        setActiveIcon(resultadoIcon);
        const lastSelectedName = localStorage.getItem(localStorageNameKey);
        if (lastSelectedName && resultado[lastSelectedName]) {
            selecionarLoteria(lastSelectedName);
        } else {
            showSection(selecionarNomeSection);
        }
    });

    // Função para lidar com o clique no ícone 'Palpite'
    palpiteIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Palpite';
        localStorage.setItem(localStorageModeKey, 'Palpite');
        setActiveIcon(palpiteIcon);
        showSection(modoPalpiteSection);
        populateDropdownPalpite();
    });

    // Função para lidar com o clique no ícone 'Jogar'
    jogarIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Jogar';
        setActiveIcon(jogarIcon);

        // Define o src da iframe para carregar o site externo e exibe em tela cheia
        jogarIframe.src = 'https://app.acertos.club/pr/fC7hpda9';
        modoJogarSection.style.display = 'block'; // Exibe a seção com a iframe em tela cheia
        fecharIframeBtn.classList.remove('hidden'); // Mostra o botão de fechar
    });

    // Função para lidar com o clique no botão 'X' (fechar iframe)
    fecharIframeBtn.addEventListener('click', function () {
        window.location.reload(); // Recarrega a página completamente
    });

    // Função para lidar com o clique no ícone 'Compartilhar'
    compartilharIcon.addEventListener('click', function (event) {
        event.preventDefault();
        abrirOpcoesCompartilhamento();
    });

    // Função para definir o ícone ativo
    function setActiveIcon(activeIcon) {
        [resultadoIcon, palpiteIcon, jogarIcon].forEach(icon => {
            icon.classList.remove('active');
        });
        activeIcon.classList.add('active');
    }

    // Função para abrir opções de compartilhamento
    function abrirOpcoesCompartilhamento() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Confira esta página incrível de resultados e palpites de loteria!',
                url: window.location.href
            }).then(() => {
                console.log('Compartilhamento bem-sucedido');
                // Define o status de compartilhamento no localStorage somente após sucesso
                localStorage.setItem(localStorageSharedKey, 'true');
            }).catch((error) => {
                console.log('Compartilhamento cancelado ou erro:', error);
                // Não define o status de compartilhamento se o compartilhamento foi cancelado ou falhou
            });
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    }

    // Função para popular o dropdown de palpite
    function populateDropdownPalpite() {
        dropdownPalpite.innerHTML = '<option value="" disabled selected>Escolha uma loteria</option>';

        if (!palpites) {
            dropdownPalpite.innerHTML += '<option value="" disabled>Dados indisponíveis.</option>';
            return;
        }

        Object.keys(palpites).forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            option.textContent = nome;
            dropdownPalpite.appendChild(option);
        });

        const lastSelectedName = localStorage.getItem(localStorageNameKey);
        if (lastSelectedName && palpites[lastSelectedName]) {
            dropdownPalpite.value = lastSelectedName;
            exibirFrasesPalpite(lastSelectedName);
        }
    }

    // Evento para quando a seleção do dropdown de palpite mudar
    dropdownPalpite.addEventListener('change', function () {
        const selectedName = this.value;
        localStorage.setItem(localStorageNameKey, selectedName);
        exibirFrasesPalpite(selectedName);
        palpiteConteudoDiv.innerHTML = '';
    });

    // Função para exibir as frases na seção 'Palpite'
    function exibirFrasesPalpite(nome) {
        frasesPalpitesDiv.innerHTML = '';

        const dadosPalpite = palpites[nome];
        if (!dadosPalpite) {
            frasesPalpitesDiv.textContent = 'Dados indisponíveis.';
            return;
        }

        dadosPalpite.frases.forEach(frase => {
            const p = document.createElement('p');
            p.textContent = frase;
            frasesPalpitesDiv.appendChild(p);
        });
    }

    // Função para exibir os palpites com efeito de carregamento
    function exibirPalpitesComLoading(nome) {
        palpiteConteudoDiv.innerHTML = '';

        const loader = document.createElement('div');
        loader.classList.add('loader');
        palpiteConteudoDiv.appendChild(loader);

        setTimeout(() => {
            loader.remove();

            // Cria e adiciona a frase personalizada
            const fraseP = document.createElement('p');
            fraseP.textContent = `Jogue M/MC/C/D do 1º ao 10º na loteria ${nome}.`;
            fraseP.classList.add('frase-palpite'); // Alinha à direita via CSS
            palpiteConteudoDiv.appendChild(fraseP);

            const dadosPalpite = palpites[nome];
            if (!dadosPalpite) {
                palpiteConteudoDiv.textContent = 'Dados indisponíveis.';
                return;
            }

            const tabelaPalpites = criarTabelaPalpites(dadosPalpite.palpites);
            palpiteConteudoDiv.appendChild(tabelaPalpites);
        }, 2000); // 2 segundos de carregamento simulado
    }

    // Função para criar uma tabela de palpites com 5 colunas
    function criarTabelaPalpites(palpitesArray) {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        const rows = Math.ceil(palpitesArray.length / 5);
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
                const td = document.createElement('td');
                td.textContent = palpitesArray[index] || ''; // Preenche com vazio se não houver
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        return table;
    }

    // Evento para o botão 'Mostrar palpite'
    mostrarPalpiteBtn.addEventListener('click', function () {
        const selectedName = dropdownPalpite.value;
        if (!selectedName) {
            alert("Por favor, selecione uma loteria primeiro.");
            return;
        }

        if (!palpites || !palpites[selectedName]) {
            alert("Dados para a loteria selecionada não estão disponíveis.");
            return;
        }

        const dadosPalpite = palpites[selectedName];
        const palpitesList = dadosPalpite.palpites;

        if (palpitesList.length === 0) {
            alert("Não há palpites disponíveis para esta loteria.");
            return;
        }

        // Verifica se a página foi compartilhada
        const hasShared = localStorage.getItem(localStorageSharedKey) === 'true';
        if (hasShared) {
            // Exibir os palpites com efeito de carregamento
            exibirPalpitesComLoading(selectedName);
            // Resetar o status de compartilhamento
            localStorage.setItem(localStorageSharedKey, 'false');
        } else {
            alert("Por favor, compartilhe a página antes de mostrar os palpites.");
        }
    });

    // Função para lidar com o clique no botão 'Selecionar loteria' na seção Exibir Resultados
    selecionarLoteriaLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSelecaoLoteria();
    });

    // Função para mostrar a seleção de loteria
    function showSelecaoLoteria() {
        setActiveIcon(resultadoIcon);
        showSection(selecionarNomeSection);
    }

    // Função para lidar com o clique no ícone de menu hambúrguer
    hamburgerMenu.addEventListener('click', function () {
        expandMenu.classList.toggle('hidden');
        expandMenu.classList.toggle('active'); // Para animação CSS
    });

    // Função para lidar com os cliques nos itens do menu expandido
    expandMenu.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const sectionId = event.target.getAttribute('data-section');
            if (sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    showSection(section);
                }
            }
            // Fechar o menu após clicar
            expandMenu.classList.add('hidden');
            expandMenu.classList.remove('active');
        }
    });

    // Função para lidar com o clique no item 'Contato'
    contatoLink.addEventListener('click', function (event) {
        event.preventDefault();
        window.open('https://www.instagram.com/acertosonline/', '_blank');
        // Fechar o menu após clicar
        expandMenu.classList.add('hidden');
        expandMenu.classList.remove('active');
    });

    // Função para lidar com o clique no item 'Instale o App no seu celular'
    instalarAppLink.addEventListener('click', function (event) {
        event.preventDefault();
        instalarApp(); // Função para instalar o PWA
        // Fechar o menu após clicar
        expandMenu.classList.add('hidden');
        expandMenu.classList.remove('active');
    });

    // Função para instalar o App (PWA)
    function instalarApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação do App');
                } else {
                    console.log('Usuário recusou a instalação do App');
                }
                deferredPrompt = null;
            });
        } else {
            // Fallback para navegadores que não suportam o evento
            alert('A funcionalidade de instalação não está disponível no seu navegador.');
        }
    }

    // Registro do Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                })
                .catch(error => {
                    console.log('Falha ao registrar ServiceWorker:', error);
                });
        });
    }

    // Captura o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Opcional: Mostrar um botão para instalar o PWA
        // Como estamos usando o menu, a instalação será acionada pelo item do menu
    });

    // Função para abrir opções de compartilhamento
    function abrirOpcoesCompartilhamento() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Confira esta página incrível de resultados e palpites de loteria!',
                url: window.location.href
            }).then(() => {
                console.log('Compartilhamento bem-sucedido');
                // Define o status de compartilhamento no localStorage somente após sucesso
                localStorage.setItem(localStorageSharedKey, 'true');
            }).catch((error) => {
                console.log('Compartilhamento cancelado ou erro:', error);
                // Não define o status de compartilhamento se o compartilhamento foi cancelado ou falhou
            });
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    }

    // Função para definir o ícone ativo
    function setActiveIcon(activeIcon) {
        [resultadoIcon, palpiteIcon, jogarIcon].forEach(icon => {
            icon.classList.remove('active');
        });
        activeIcon.classList.add('active');
    }

    // Função de inicialização
    function initializeApp() {
        hideAllSections();
        populateMenuLoterias();
        populateDropdownPalpite();

        const lastMode = localStorage.getItem(localStorageModeKey) || 'Resultado';
        if (lastMode === 'Resultado') {
            resultadoIcon.click();
        } else if (lastMode === 'Palpite') {
            palpiteIcon.click();
        } else if (lastMode === 'Jogar') {
            jogarIcon.click();
        }
    }

    // Inicialização da aplicação
    initializeApp();
});
