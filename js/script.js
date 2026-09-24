// =============================================
// CARRINHO DE COMPRAS
// =============================================

let carrinho = [];

const btnAbrirCarrinho = document.getElementById('btnAbrirCarrinho');
const btnFecharCarrinho = document.getElementById('btnFecharCarrinho');
const carrinhoModal = document.getElementById('carrinhoModal');
const carrinhoOverlay = document.getElementById('carrinhoOverlay');
const carrinhoItens = document.getElementById('carrinhoItens');
const carrinhoContador = document.getElementById('carrinhoContador');
const carrinhoTotalPreco = document.getElementById('carrinhoTotalPreco');
const toastNotificacao = document.getElementById('toastNotificacao');
const toastMensagem = document.getElementById('toastMensagem');

// Abrir e fechar carrinho
btnAbrirCarrinho.addEventListener('click', () => abrirCarrinho());
btnFecharCarrinho.addEventListener('click', () => fecharCarrinho());
carrinhoOverlay.addEventListener('click', () => fecharCarrinho());

function abrirCarrinho() {
    carrinhoModal.classList.add('ativo');
    carrinhoOverlay.classList.add('ativo');
    renderizarCarrinho();
}

function fecharCarrinho() {
    carrinhoModal.classList.remove('ativo');
    carrinhoOverlay.classList.remove('ativo');
}

// Adicionar produto ao carrinho
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-comprar');
    if (!btn) return;

    const id = btn.dataset.id;
    const nome = btn.dataset.nome;
    const preco = parseFloat(btn.dataset.preco);
    const img = btn.dataset.img;

    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, img, quantidade: 1 });
    }

    atualizarContadorCarrinho();
    mostrarToast(`${nome} adicionado ao carrinho!`);
    animarBotaoComprar(btn);
});

function atualizarContadorCarrinho() {
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    carrinhoContador.textContent = total;
    if (total > 0) {
        carrinhoContador.classList.add('visivel');
    } else {
        carrinhoContador.classList.remove('visivel');
    }
}

function renderizarCarrinho() {
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Seu carrinho está vazio.<br>Adicione um Milton agora!</p>
            </div>
        `;
        carrinhoTotalPreco.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    carrinhoItens.innerHTML = '';

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        const itemEl = document.createElement('div');
        itemEl.classList.add('carrinho-item');
        itemEl.innerHTML = `
            <img class="carrinho-item-img" src="${item.img}" alt="${item.nome}">
            <div class="carrinho-item-info">
                <div class="carrinho-item-nome">${item.nome}</div>
                <div class="carrinho-item-preco">${formatarPreco(item.preco)}</div>
                <div class="carrinho-item-qtd">
                    <button class="btn-qtd" data-acao="diminuir" data-id="${item.id}">&#8722;</button>
                    <span class="qtd-valor">${item.quantidade}</span>
                    <button class="btn-qtd" data-acao="aumentar" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="btn-remover-item" data-id="${item.id}" title="Remover item">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        carrinhoItens.appendChild(itemEl);
    });

    carrinhoTotalPreco.textContent = formatarPreco(total);
}

// Controles de quantidade e remoção dentro do carrinho
carrinhoItens.addEventListener('click', (e) => {
    const btnQtd = e.target.closest('.btn-qtd');
    const btnRemover = e.target.closest('.btn-remover-item');

    if (btnQtd) {
        const id = btnQtd.dataset.id;
        const acao = btnQtd.dataset.acao;
        const item = carrinho.find(i => i.id === id);
        if (!item) return;

        if (acao === 'aumentar') {
            item.quantidade += 1;
        } else if (acao === 'diminuir') {
            item.quantidade -= 1;
            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(i => i.id !== id);
            }
        }

        atualizarContadorCarrinho();
        renderizarCarrinho();
    }

    if (btnRemover) {
        const id = btnRemover.dataset.id;
        carrinho = carrinho.filter(i => i.id !== id);
        atualizarContadorCarrinho();
        renderizarCarrinho();
    }
});

// Finalizar pedido
const btnFinalizar = document.getElementById('btnFinalizarPedido');
btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) return;
    fecharCarrinho();
    setTimeout(() => {
        alert('✅ Pedido realizado com sucesso! Em breve entraremos em contato para confirmar a entrega do seu Milton. 🏆');
        carrinho = [];
        atualizarContadorCarrinho();
    }, 400);
});

// =============================================
// TOAST NOTIFICAÇÃO
// =============================================

let toastTimeout;
function mostrarToast(mensagem) {
    clearTimeout(toastTimeout);
    toastMensagem.textContent = mensagem;
    toastNotificacao.classList.add('visivel');
    toastTimeout = setTimeout(() => {
        toastNotificacao.classList.remove('visivel');
    }, 3000);
}

function animarBotaoComprar(btn) {
    btn.textContent = '✔ Adicionado!';
    btn.style.background = '#1a7a3a';
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Comprar';
        btn.style.background = '';
    }, 1500);
}

// =============================================
// MENU HAMBURGUER (MOBILE)
// =============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('aberto');
    const icone = menuToggle.querySelector('i');
    icone.classList.toggle('fa-bars');
    icone.classList.toggle('fa-xmark');
});

// Fechar menu ao clicar em um link
navMenu.querySelectorAll('.nav-bar').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('aberto');
        const icone = menuToggle.querySelector('i');
        icone.classList.add('fa-bars');
        icone.classList.remove('fa-xmark');
    });
});

// =============================================
// FILTROS DE PRODUTOS
// =============================================

const filtrosBtns = document.querySelectorAll('.filtro-btn');
const cards = document.querySelectorAll('.vitrine-produtos-card');

filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filtrosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const categoria = btn.dataset.categoria;

        cards.forEach(card => {
            if (categoria === 'todos' || card.dataset.categoria === categoria) {
                card.classList.remove('oculto');
                card.style.animation = 'nenhum';
                void card.offsetWidth; // reflow para reiniciar animação
                card.style.animation = '';
            } else {
                card.classList.add('oculto');
            }
        });
    });
});

// =============================================
// ACTIVE LINK NA NAVEGAÇÃO (SCROLL SPY)
// =============================================

const secoes = document.querySelectorAll('section[id], div[id="inicio"]');
const navLinks = document.querySelectorAll('.nav-bar');

const observadorSecao = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${entry.target.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

secoes.forEach(s => observadorSecao.observe(s));

// =============================================
// FORMULÁRIO DE CONTATO
// =============================================

const formContato = document.getElementById('formContato');
formContato.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    mostrarToast(`Mensagem enviada com sucesso, ${nome}! 🎉`);
    formContato.reset();
});

// =============================================
// ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
// =============================================

const elementosAnimados = document.querySelectorAll(
    '.vitrine-produtos-card, .sobre-card, .depoimento-card, .contato-info-box'
);

// Adiciona CSS de animação inline
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in-up.visivel {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

elementosAnimados.forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const observadorAnimacao = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            observadorAnimacao.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

elementosAnimados.forEach(el => observadorAnimacao.observe(el));

// =============================================
// FORMATAÇÃO DE MOEDA
// =============================================

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
