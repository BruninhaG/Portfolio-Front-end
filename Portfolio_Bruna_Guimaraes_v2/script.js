const GITHUB_USER = 'BruninhaG';
const REPO_COUNT = 5;
document.getElementById('year').textContent = new Date().getFullYear();

// Cache dos elementos DOM para melhor performance
const typedEl = document.getElementById('typed');
const navLinksEl = document.querySelector('.nav-links');
const menuToggleEl = document.querySelector('.menu-toggle');

// --- 1. MELHORIA NO EFEITO DE DIGITAÇÃO (TYPING EFFECT) ---

// Mensagens que vendem o seu valor, focando no Front-end
const typingText = [
    'Desenvolvedora Front-end', 
    'Interfaces de Alta Performance', 
    'UX e Acessibilidade'
];

let ti = 0, ci = 0, isDeleting = false;

function type() {
    const full = typingText[ti % typingText.length];
    
    // Altera o conteúdo (Agora com o cursor '▏' para UX visual)
    const cursor = isDeleting ? '▏' : '▏'; // Mantém o cursor visível
    typedEl.innerHTML = full.substring(0, ci) + `<span class="typing-cursor">${cursor}</span>`;

    if (!isDeleting) {
        ci++;
        // Se terminou de digitar, pausa mais antes de começar a apagar
        if (ci > full.length) { 
            isDeleting = true; 
            setTimeout(type, 1800); // Pausa de 1.8s (aumentado)
            return; 
        }
    } else {
        ci--;
        // Se terminou de apagar, muda para a próxima frase
        if (ci < 0) { 
            isDeleting = false; 
            ti++; 
            ci = 0; 
        }
    }
    
    // Velocidades ajustadas: mais rápido para digitar (60ms), mais lento para apagar (30ms)
    setTimeout(type, isDeleting ? 30 : 60);
}

// O título principal agora será a primeira frase do array, em vez de um placeholder
typedEl.textContent = typingText[0]; 
setTimeout(type, 1000); // Inicia o efeito após 1 segundo

// --- 2. ACESSIBILIDADE E UX (MENU MOBILE) ---

menuToggleEl.addEventListener('click', () => {
    const isExpanded = menuToggleEl.getAttribute('aria-expanded') === 'true' || false;
    
    // Alterna o atributo ARIA
    menuToggleEl.setAttribute('aria-expanded', !isExpanded);
    // Alterna a classe de estilo no nav-links
    navLinksEl.classList.toggle('nav-open');
});

// Fecha o menu ao clicar em um link (boa prática mobile)
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        if (navLinksEl.classList.contains('nav-open')) {
            navLinksEl.classList.remove('nav-open');
            menuToggleEl.setAttribute('aria-expanded', 'false');
        }
    });
});

// --- 3. FETCH DE REPOSITÓRIOS (APRIMORAMENTO) ---

// Mantém sua função, é robusta!
async function fetchRepos() {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=${REPO_COUNT}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro ao buscar repositórios');
        const repos = await res.json();
        // Filtra projetos sem descrição e/ou com nomes não amigáveis (ex: "repo-teste")
        return repos
            .filter(r => !r.archived && !r.fork && r.description)
            .slice(0, REPO_COUNT);
    } catch (err) {
        console.error('Erro ao buscar repositórios do GitHub:', err);
        return [];
    }
}

// Criação do card de repositório (melhorado com botão de live demo)
function makeRepoCard(repo) {
    const el = document.createElement('div');
    el.className = 'repo';
    
    // Verifica se há uma URL de demonstração (seja no `homepage` ou inferida)
    const liveDemoUrl = repo.homepage || (repo.has_pages ? `https://${GITHUB_USER}.github.io/${repo.name}` : null);
    
    const demoButton = liveDemoUrl 
        ? `<a class="btn repo-btn" href="${liveDemoUrl}" target="_blank" rel="noopener">Demo ao Vivo</a>`
        : '';

    el.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
        <p>${repo.description ? escapeHTML(repo.description) : 'Este projeto é um excelente exemplo de código.'}</p>
        <div class="repo-meta-row">
            <span class="meta-item">⭐ ${repo.stargazers_count}</span>
            <span class="meta-item">🛠️ ${repo.language ? repo.language : '—'}</span>
        </div>
        <div class="repo-actions">
            ${demoButton}
            <a class="btn ghost repo-btn" href="${repo.html_url}" target="_blank" rel="noopener">Ver Código</a>
        </div>
    `;
    return el;
}

// Sua função escapeHTML mantida por segurança
function escapeHTML(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function renderRepos(){
    const container = document.getElementById('repos-list');
    container.innerHTML = '<p class="muted">Carregando seus melhores projetos...</p>'; // Texto mais amigável
    
    const repos = await fetchRepos();
    container.innerHTML = '';
    
    if (repos.length === 0){
        container.innerHTML = '<p class="muted">Não foi possível carregar os repositórios, ou não há projetos destacados para exibição.</p>';
        return;
    }
    
    repos.forEach(r => container.appendChild(makeRepoCard(r)));
}

// --- 4. FUNÇÕES DE INICIALIZAÇÃO (INIT) ---

// Smooth scroll - Mantida, é excelente.

// Reveal on scroll - Mantida, é excelente.

// Chama as funções de inicialização
renderRepos();
// type() já é chamada no topo

