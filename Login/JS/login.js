class Particle {
  constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.5 ? '#BB86FC' : '#a21fa2';
  }

  update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce nas bordas
      if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

      // Manter dentro dos limites
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
  }

  draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
  }
}

class ParticleSystem {
  constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouseX = 0;
      this.mouseY = 0;

      // Configurar canvas
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

      // Criar partículas iniciais
      this.createParticles(50);

      // Iniciar animação
      this.animate();
  }

  resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  }

  createParticles(count) {
      for (let i = 0; i < count; i++) {
          this.particles.push(new Particle(this.canvas));
      }
  }

  handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Criar partículas extras ao mover o mouse
      if (Math.random() > 0.8) {
          const particle = new Particle(this.canvas);
          particle.x = this.mouseX;
          particle.y = this.mouseY;
          particle.speedX = (Math.random() - 0.5) * 2;
          particle.speedY = (Math.random() - 0.5) * 2;
          this.particles.push(particle);

          // Limitar número de partículas
          if (this.particles.length > 150) {
              this.particles.shift();
          }
      }
  }

  animate() {
      // Limpar canvas
      this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Atualizar e desenhar partículas
      this.particles.forEach((particle, index) => {
          particle.update();
          particle.draw(this.ctx);

          // Desenhar linhas entre partículas próximas
          this.particles.forEach((otherParticle, otherIndex) => {
              if (index < otherIndex) {
                  const dx = particle.x - otherParticle.x;
                  const dy = particle.y - otherParticle.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < 100) {
                      this.ctx.strokeStyle = `rgba(187, 134, 252, ${0.2 * (1 - distance / 100)})`;
                      this.ctx.lineWidth = 0.5;
                      this.ctx.beginPath();
                      this.ctx.moveTo(particle.x, particle.y);
                      this.ctx.lineTo(otherParticle.x, otherParticle.y);
                      this.ctx.stroke();
                  }
              }
          });
      });

      requestAnimationFrame(() => this.animate());
  }
}

/* ============================================
 FUNCIONALIDADE DO FORMULÁRIO
 ============================================ */

class LoginForm {
  constructor() {
      this.form = document.getElementById('loginForm');
      this.emailInput = document.getElementById('email');
      this.passwordInput = document.getElementById('password');
      this.loginBtn = document.getElementById('loginBtn');

      this.setupEventListeners();
  }

  setupEventListeners() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.loginBtn.addEventListener('click', (e) => this.handleLoginClick(e));
  }

  handleSubmit(e) {
      e.preventDefault();
      this.handleLogin();
  }

  handleLoginClick(e) {
      e.preventDefault();
      this.handleLogin();
  }

  handleLogin() {
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value.trim();

      // Validação básica
      if (!email || !password) {
          this.showError('Por favor, preencha todos os campos');
          return;
      }

      if (!this.isValidEmail(email)) {
          this.showError('Por favor, insira um e-mail válido');
          return;
      }

      if (password.length < 6) {
          this.showError('A senha deve ter pelo menos 6 caracteres');
          return;
      }

      // Mostrar estado de carregamento
      this.setLoadingState(true);

      // Simular delay de autenticação
      setTimeout(() => {
          this.setLoadingState(false);
          this.showSuccess();

          // Redirecionar após sucesso
          setTimeout(() => {
              window.location.href = 'home-Estudex.html';
          }, 1500);
      }, 1500);
  }

  isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  setLoadingState(isLoading) {
      if (isLoading) {
          this.loginBtn.classList.add('loading');
          this.loginBtn.disabled = true;
          this.loginBtn.querySelector('.button-text').textContent = 'Autenticando...';
      } else {
          this.loginBtn.classList.remove('loading');
          this.loginBtn.disabled = false;
          this.loginBtn.querySelector('.button-text').textContent = 'Entrar';
      }
  }

  showSuccess() {
      this.loginBtn.classList.add('success');
      this.loginBtn.querySelector('.button-text').textContent = 'Bem-vindo!';
  }

  showError(message) {
      // Adicionar classe de erro ao botão
      this.loginBtn.style.animation = 'shake 0.5s ease-in-out';

      // Remover animação após terminar
      setTimeout(() => {
          this.loginBtn.style.animation = '';
      }, 500);

      // Mostrar mensagem de erro (pode ser substituída por um toast)
      console.warn(message);
      alert(message);
  }
}

/* ============================================
 EFEITO PARALLAX COM MOUSE
 ============================================ */

class ParallaxEffect {
  constructor() {
      this.card = document.querySelector('.login-card');
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  handleMouseMove(e) {
      const x = (e.clientX / window.innerWidth) * 20 - 10;
      const y = (e.clientY / window.innerHeight) * 20 - 10;

      this.card.style.transform = `perspective(1000px) rotateX(${y * 0.5}deg) rotateY(${x * 0.5}deg)`;
  }
}

/* ============================================
 ANIMAÇÃO DE SHAKE (para erros)
 ============================================ */

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

/* ============================================
 INICIALIZAÇÃO
 ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistema de partículas
  const particleSystem = new ParticleSystem('particleCanvas');

  // Inicializar formulário de login
  const loginForm = new LoginForm();

  // Inicializar efeito parallax
  const parallaxEffect = new ParallaxEffect();

  // Adicionar animação de entrada aos elementos
  const elements = document.querySelectorAll('.form-group, .login-links');
  elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.animation = `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s forwards`;
  });

  // Adicionar animação fadeInUp ao CSS
  const fadeInStyle = document.createElement('style');
  fadeInStyle.textContent = `
      @keyframes fadeInUp {
          from {
              opacity: 0;
              transform: translateY(20px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }
  `;
  document.head.appendChild(fadeInStyle);

  // Log de inicialização
  console.log('✨ EstudeX Login - Sistema inicializado com sucesso!');
  console.log('🎨 Tema: Dark Futurista com Neon Roxo');
  console.log('🚀 Efeitos: Partículas, Parallax e Glassmorphism');
});

/* ============================================
 UTILITÁRIOS
 ============================================ */

// Função para detectar suporte a backdrop-filter
function supportsBackdropFilter() {
  const el = document.createElement('div');
  el.style.backdropFilter = 'blur(10px)';
  return el.style.backdropFilter !== '';
}

// Log de compatibilidade
console.log('🔧 Backdrop Filter:', supportsBackdropFilter() ? '✓ Suportado' : '✗ Não suportado');