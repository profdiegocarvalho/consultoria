Diego Marques de Carvalho — Consultoria em Inteligência Artificial
Site de portfólio single page · Estética inspirada na Apple
================================================================

ESTRUTURA
---------
index.html      Página única (hero, sobre, serviços, trajetória,
                experiência, pesquisa/publicações, contato)
css/style.css   Design system completo (frosted glass, dark/light,
                grid responsivo, animações CSS)
js/main.js      Toda a interatividade em JavaScript puro
image/          Foto de perfil (extraída do currículo Lattes)

COMO USAR
---------
Basta abrir o index.html em qualquer navegador moderno,
ou hospedar a pasta inteira em qualquer servidor estático:
GitHub Pages, Netlify, Vercel, S3, Apache, Nginx etc.
Não há dependências nem build — HTML, CSS e JS puros.

DESTAQUES TÉCNICOS
------------------
· Canvas com rede neural interativa no hero (partículas que
  seguem o mouse) com pausa automática fora da tela
· Efeito máquina de escrever rotativo
· Navegação frosted glass que encolhe e se oculta ao rolar
· Scrollspy com destaque da seção ativa
· Barra de progresso de leitura
· Animações de entrada com IntersectionObserver
· Contadores animados, tilt 3D e spotlight nos cards
· Botões magnéticos, parallax no hero
· Menu mobile em tela cheia com transição em stagger
· Carrossel arrastável de publicações
· Respeita prefers-reduced-motion (acessibilidade)

PERSONALIZAÇÃO RÁPIDA
---------------------
· Cores: edite as variáveis em :root no css/style.css
  (--blue, --gradient, --indigo, --purple)
· Textos: edite diretamente no index.html
· Frases do typewriter: array "phrases" no js/main.js
