import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMapPin, FiPhone, FiMail, FiInstagram } from 'react-icons/fi'

export default function Home() {
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  // SCROLL PARALLAX
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // SCROLL REVEAL
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) el.target.classList.add('visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // GLITCH EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // MAGNETIC BUTTONS
  useEffect(() => {
    const btns = document.querySelectorAll('.magnetic-btn')
    btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)'
      })
    })
  }, [])

  const categorias = [
    { nombre: 'Camisetas', emoji: '👕', bg: '#0a0a0a', color: '#fff', desc: 'Básicas y gráficas' },
    { nombre: 'Pantalones', emoji: '👖', bg: '#f0f0f0', color: '#000', desc: 'Jeans y joggers' },
    { nombre: 'Accesorios', emoji: '🧢', bg: '#0a0a0a', color: '#fff', desc: 'Gorras y más' },
    { nombre: 'Calzado', emoji: '👟', bg: '#f0f0f0', color: '#000', desc: 'Tenis urbanos' },
  ]

  return (
    <div style={{ paddingTop: '70px' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center',
        padding: '0 80px', position: 'relative', overflow: 'hidden'
      }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${i * 14}%`, top: 0, bottom: 0,
            width: '1px', background: 'rgba(255,255,255,0.03)',
            transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`
          }} />
        ))}

        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'videoScan 3s linear infinite', pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute', right: '-200px', top: '50%',
          transform: `translateY(calc(-50% + ${scrollY * 0.2}px))`,
          width: '700px', height: '700px',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center', gap: '80px', width: '100%'
        }}>
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '32px', animation: 'fadeUp 0.8s ease forwards'
            }}>
              <div style={{ width: '40px', height: '1px', background: '#fff', opacity: 0.4 }} />
              <p style={{ fontSize: '11px', letterSpacing: '5px', color: '#666', textTransform: 'uppercase' }}>
                Nueva colección 2025
              </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '88px', fontWeight: '900', color: '#fff',
                lineHeight: '0.9', letterSpacing: '-5px',
                animation: 'fadeUp 0.9s ease forwards'
              }}>
                URBAN<br />
                <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent', display: 'block' }}>MERCH</span>
              </h1>
              {glitchActive && (
                <>
                  <h1 style={{
                    fontSize: '88px', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-5px',
                    position: 'absolute', top: 0, left: 0,
                    color: '#ff0040', opacity: 0.8, animation: 'glitch 0.3s ease', pointerEvents: 'none'
                  }}>
                    URBAN<br />
                    <span style={{ WebkitTextStroke: '2px #ff0040', color: 'transparent' }}>MERCH</span>
                  </h1>
                  <h1 style={{
                    fontSize: '88px', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-5px',
                    position: 'absolute', top: 0, left: 0,
                    color: '#00ffff', opacity: 0.8, animation: 'glitch 0.3s ease reverse', pointerEvents: 'none'
                  }}>
                    URBAN<br />
                    <span style={{ WebkitTextStroke: '2px #00ffff', color: 'transparent' }}>MERCH</span>
                  </h1>
                </>
              )}
            </div>

            <p style={{
              fontSize: '16px', color: '#666', lineHeight: '1.9',
              marginBottom: '48px', maxWidth: '380px',
              animation: 'fadeUp 1s ease forwards'
            }}>
              Streetwear • Essential • Authentic. Ropa urbana para cada momento con calidad y actitud.
            </p>

            <div style={{ display: 'flex', gap: '16px', animation: 'fadeUp 1.1s ease forwards' }}>
              <Link to="/catalogo" className="magnetic-btn" style={{
                background: '#fff', color: '#000', padding: '18px 48px',
                fontSize: '12px', fontWeight: '800', letterSpacing: '3px',
                textTransform: 'uppercase', borderRadius: '100px',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.4s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f0f0f0'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                Ver colección <FiArrowRight />
              </Link>
              <Link to="/registro" className="magnetic-btn" style={{
                background: 'transparent', color: '#fff', padding: '18px 48px',
                fontSize: '12px', fontWeight: '700', letterSpacing: '3px',
                textTransform: 'uppercase', borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.4s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.background = 'transparent'
                }}>
                Registrarse
              </Link>
            </div>

            <div style={{
              display: 'flex', gap: '40px', marginTop: '64px',
              paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)',
              animation: 'fadeUp 1.2s ease forwards'
            }}>
              {[
                { num: '+500', label: 'Productos' },
                { num: '+1K', label: 'Clientes' },
                { num: '100%', label: 'Calidad' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>{s.num}</p>
                  <p style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO SIMULADO */}
          <div style={{
            position: 'relative',
            transform: `translateY(${scrollY * -0.08}px)`,
            transition: 'transform 0.1s linear'
          }}>
            <div style={{
              width: '100%', height: '580px',
              background: 'linear-gradient(145deg, #111, #1a1a1a)',
              borderRadius: '24px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '48px',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px', zIndex: 2
              }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                  <div key={i} style={{ width: '12px', height: '12px', background: c, borderRadius: '50%' }} />
                ))}
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '12px', letterSpacing: '1px' }}>
                  URBANMERCH — SS25
                </span>
              </div>

              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '20px', padding: '80px 40px'
              }}>
                <img src="/logo.png" alt="URBANMERCH" style={{
                  width: '160px', objectFit: 'contain', opacity: 0.9,
                  filter: 'brightness(10)', animation: 'float 4s ease-in-out infinite'
                }} />
                <p style={{ color: '#444', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                  Streetwear • Essential • Authentic
                </p>
              </div>

              <div style={{
                position: 'absolute', left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                animation: 'videoScan 2s linear infinite'
              }} />

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 20px'
              }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', background: '#28c840', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>LIVE</span>
                </div>
                <div style={{ height: '3px', flex: 1, background: 'rgba(255,255,255,0.1)', margin: '0 16px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '65%', background: '#fff', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#666' }}>SS25</span>
              </div>
            </div>

            <div style={{
              position: 'absolute', top: '40px', right: '-30px',
              background: '#fff', borderRadius: '16px', padding: '16px 20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              animation: 'float 3s ease-in-out infinite', minWidth: '160px'
            }}>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px', letterSpacing: '1px' }}>Envío gratis</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: '#000' }}>Primer pedido 🚀</p>
            </div>

            <div style={{
              position: 'absolute', bottom: '80px', left: '-30px',
              background: '#0a0a0a', borderRadius: '16px', padding: '16px 20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'float 3.5s ease-in-out infinite 0.5s', minWidth: '160px'
            }}>
              <p style={{ fontSize: '11px', color: '#555', marginBottom: '4px', letterSpacing: '1px' }}>Nueva llegada</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>Colección SS25 ✨</p>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          animation: 'fadeIn 2s ease forwards'
        }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#444', textTransform: 'uppercase' }}>Scroll</p>
          <div style={{
            width: '1px', height: '60px',
            background: 'linear-gradient(to bottom, #fff, transparent)',
            animation: 'float 1.5s ease-in-out infinite'
          }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        background: '#fff', borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0', padding: '20px 0', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', gap: '60px', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {Array(8).fill(['URBANMERCH', '•', 'NUEVA COLECCIÓN', '•', 'ENVÍO GRATIS', '•', 'CALIDAD PREMIUM', '•']).flat().map((t, i) => (
            <span key={i} style={{
              fontSize: '13px', fontWeight: t === '•' ? '400' : '700',
              letterSpacing: t === '•' ? '0' : '3px',
              color: t === '•' ? '#ccc' : '#0a0a0a', whiteSpace: 'nowrap'
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIAS ── */}
      <section style={{
        padding: '140px 80px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* FONDO DECORATIVO */}
        <div style={{
          position: 'absolute', top: '-200px', right: '-200px',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="reveal" style={{ marginBottom: '80px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#666', textTransform: 'uppercase', marginBottom: '20px' }}>
            Colecciones
          </p>
          <h2 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', lineHeight: '1', color: '#fff' }}>
            Encuentra<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>tu estilo</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {categorias.map((cat, i) => (
            <Link to="/catalogo" key={i} className="reveal magnetic-btn" style={{
              background: cat.bg === '#0a0a0a' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
              borderRadius: '28px', padding: '52px 36px', minHeight: '280px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: `${i * 0.1}s`,
              border: cat.bg === '#0a0a0a' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              overflow: 'hidden', position: 'relative',
              backdropFilter: 'blur(10px)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.4)'
                e.currentTarget.style.background = cat.bg === '#0a0a0a' ? 'rgba(255,255,255,0.1)' : '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = cat.bg === '#0a0a0a' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
              }}>
              <span style={{ fontSize: '48px' }}>{cat.emoji}</span>
              <div>
                <p style={{
                  fontSize: '24px', fontWeight: '800', marginBottom: '8px',
                  color: cat.bg === '#0a0a0a' ? '#fff' : '#000'
                }}>{cat.nombre}</p>
                <p style={{
                  fontSize: '13px',
                  color: cat.bg === '#0a0a0a' ? '#666' : '#999'
                }}>{cat.desc} →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <section style={{ padding: '140px 80px', background: '#fff' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#999', textTransform: 'uppercase', marginBottom: '16px' }}>Lo más vendido</p>
            <h2 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px' }}>Destacados</h2>
          </div>
          <Link to="/catalogo" className="magnetic-btn" style={{
            fontSize: '13px', fontWeight: '600', color: '#000',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', border: '1.5px solid #000',
            borderRadius: '100px', transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000' }}>
            Ver todo <FiArrowRight />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {[
            { nombre: 'Camiseta Oversize Negra', precio: '45.000', cat: 'Camisetas', emoji: '👕', tag: 'NUEVO' },
            { nombre: 'Jogger Negro Premium', precio: '85.000', cat: 'Pantalones', emoji: '👖', tag: 'TOP' },
            { nombre: 'Gorra Urban Classic', precio: '40.000', cat: 'Accesorios', emoji: '🧢', tag: 'SALE' },
          ].map((p, i) => (
            <div key={i} className="reveal-scale" style={{
              borderRadius: '24px', overflow: 'hidden', border: '1px solid #f0f0f0',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: `${i * 0.15}s`
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px)'
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div style={{
                height: '300px', background: '#f8f8f8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '90px', position: 'relative', overflow: 'hidden'
              }}>
                {p.emoji}
                <span style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#0a0a0a', color: '#fff', fontSize: '10px',
                  fontWeight: '800', letterSpacing: '2px', padding: '6px 14px', borderRadius: '100px'
                }}>{p.tag}</span>
              </div>
              <div style={{ padding: '28px' }}>
                <p style={{ fontSize: '11px', color: '#999', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>{p.cat}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.5px' }}>{p.nombre}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>${p.precio}</p>
                  <Link to="/catalogo" className="magnetic-btn" style={{
                    background: '#0a0a0a', color: '#fff', padding: '12px 24px',
                    borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                    letterSpacing: '1px', transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                    Agregar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={{
        background: '#0a0a0a', padding: '160px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          transform: `translateX(${scrollY * 0.05}px)`
        }} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center', gap: '80px', position: 'relative', zIndex: 2
        }}>
          <div className="reveal-left">
            <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#555', textTransform: 'uppercase', marginBottom: '28px' }}>
              Beneficios
            </p>
            <h2 style={{
              fontSize: '68px', fontWeight: '900', color: '#fff',
              letterSpacing: '-3px', lineHeight: '0.95', marginBottom: '48px'
            }}>
              ENVÍO<br />GRATIS<br />
              <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>PRIMER<br />PEDIDO</span>
            </h2>
            <Link to="/registro" className="magnetic-btn" style={{
              background: '#fff', color: '#000', padding: '20px 52px',
              fontSize: '12px', fontWeight: '800', letterSpacing: '3px',
              textTransform: 'uppercase', borderRadius: '100px',
              display: 'inline-flex', alignItems: 'center', gap: '12px', transition: 'all 0.4s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(255,255,255,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              Crear cuenta <FiArrowRight />
            </Link>
          </div>
          <div className="reveal-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🚚', titulo: 'Envío gratis', desc: 'En tu primer pedido' },
              { icon: '↩️', titulo: 'Devoluciones', desc: '30 días sin preguntas' },
              { icon: '🔒', titulo: 'Pago seguro', desc: 'Con Mercado Pago' },
              { icon: '⭐', titulo: 'Calidad', desc: 'Garantizada siempre' },
            ].map((b, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '32px', transition: 'all 0.4s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}>{b.icon}</span>
                <p style={{ color: '#fff', fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>{b.titulo}</p>
                <p style={{ color: '#555', fontSize: '13px' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO Y MAPA ── */}
      <section style={{ padding: '140px 80px', background: '#fff' }} id="contacto">
        <div className="reveal" style={{ marginBottom: '80px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#999', textTransform: 'uppercase', marginBottom: '20px' }}>
            Encuéntranos
          </p>
          <h2 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-3px' }}>Visítanos</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>
          <div className="reveal-left">
            {[
              { icon: <FiMapPin size={20} />, titulo: 'Dirección', desc: 'Calle Principal #00-00\nTu ciudad, Colombia' },
              { icon: <FiPhone size={20} />, titulo: 'Teléfono', desc: '+57 300 000 0000\nLunes a Sábado 9am – 7pm' },
              { icon: <FiMail size={20} />, titulo: 'Email', desc: 'info@urbanmerch.co' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '36px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '52px', height: '52px', background: '#0a0a0a',
                  borderRadius: '16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', flexShrink: 0, transition: 'all 0.3s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#333' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#0a0a0a' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{item.titulo}</p>
                  <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.5px' }}>Escríbenos</h3>
            <form onSubmit={e => { e.preventDefault(); alert('¡Mensaje enviado! Te contactaremos pronto.') }}>
              {[
                { placeholder: 'Tu nombre', type: 'text' },
                { placeholder: 'Tu email', type: 'email' },
              ].map((f, i) => (
                <input key={i} type={f.type} placeholder={f.placeholder} required style={{
                  width: '100%', padding: '16px 20px', border: '1.5px solid #e8e8e8',
                  borderRadius: '14px', fontSize: '15px', outline: 'none',
                  marginBottom: '12px', transition: 'all 0.3s', fontFamily: 'inherit'
                }}
                  onFocus={e => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.05)' }}
                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none' }}
                />
              ))}
              <textarea placeholder="Tu mensaje" required rows={4} style={{
                width: '100%', padding: '16px 20px', border: '1.5px solid #e8e8e8',
                borderRadius: '14px', fontSize: '15px', outline: 'none',
                marginBottom: '16px', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.3s'
              }}
                onFocus={e => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.05)' }}
                onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none' }}
              />
              <button type="submit" className="magnetic-btn" style={{
                width: '100%', padding: '18px', background: '#0a0a0a', color: '#fff',
                fontSize: '12px', fontWeight: '800', letterSpacing: '3px',
                textTransform: 'uppercase', borderRadius: '14px', transition: 'all 0.4s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#333'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0a0a0a'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="reveal-right">
            <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.12)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46138266604!2d-75.66902645!3d6.2441833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8468b1a0cc7b1f07%3A0x7af19a04a0e5df80!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000"
                width="100%" height="440"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen loading="lazy"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="magnetic-btn" style={{
                background: '#0a0a0a', color: '#fff', padding: '16px', borderRadius: '14px',
                fontSize: '13px', fontWeight: '700', textAlign: 'center', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                <FiMapPin size={16} /> Cómo llegar
              </a>
              <a href="https://wa.me/573208665793" target="_blank" rel="noreferrer" className="magnetic-btn" style={{
                background: '#25D366', color: '#fff', padding: '16px', borderRadius: '14px',
                fontSize: '13px', fontWeight: '700', textAlign: 'center', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#1da851'}
                onMouseLeave={e => e.currentTarget.style.background = '#25D366'}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', padding: '100px 80px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', marginBottom: '80px' }}>
          <div>
            <img src="/logo.png" alt="URBANMERCH"
              style={{ height: '60px', objectFit: 'contain', marginBottom: '20px', filter: 'brightness(10)' }} />
            <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.9', maxWidth: '280px' }}>
              Streetwear • Essential • Authentic. Ropa urbana de calidad para cada momento.
            </p>
          </div>
          {[
            { titulo: 'Tienda', links: ['Catálogo', 'Novedades', 'Sale', 'Colecciones'] },
            { titulo: 'Cuenta', links: ['Iniciar sesión', 'Registrarse', 'Mis pedidos', 'Perfil'] },
            { titulo: 'Info', links: ['Sobre nosotros', 'Contacto', 'Envíos', 'Devoluciones'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>
                {col.titulo}
              </h4>
              {col.links.map((link, j) => (
                <Link key={j} to="/" style={{ display: 'block', color: '#444', fontSize: '14px', marginBottom: '14px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#444'}>
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ color: '#333', fontSize: '13px' }}>© 2025 URBANMERCH. Todos los derechos reservados.</p>
          <a href="#" style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#555', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#555' }}>
            <FiInstagram size={20} />
          </a>
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/573208665793" target="_blank" rel="noreferrer" className="wa-float magnetic-btn">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}