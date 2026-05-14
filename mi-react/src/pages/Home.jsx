import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMapPin, FiPhone, FiMail, FiInstagram } from 'react-icons/fi'

export default function Home() {
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

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
        minHeight: isMobile ? '100svh' : '100vh',
        background: '#0a0a0a',
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '40px 24px' : '0 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {!isMobile && [...Array(8)].map((_, i) => (
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
          position: 'relative', zIndex: 2, width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          alignItems: 'center', gap: isMobile ? '40px' : '80px'
        }}>
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '24px', animation: 'fadeUp 0.8s ease forwards'
            }}>
              <div style={{ width: '30px', height: '1px', background: '#fff', opacity: 0.4 }} />
              <p style={{ fontSize: '10px', letterSpacing: '4px', color: '#666', textTransform: 'uppercase' }}>
                Nueva colección 2025
              </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <h1 style={{
                fontSize: isMobile ? '56px' : '88px',
                fontWeight: '900', color: '#fff',
                lineHeight: '0.9',
                letterSpacing: isMobile ? '-3px' : '-5px',
                animation: 'fadeUp 0.9s ease forwards'
              }}>
                URBAN<br />
                <span style={{ WebkitTextStroke: isMobile ? '1px #fff' : '2px #fff', color: 'transparent', display: 'block' }}>MERCH</span>
              </h1>
              {glitchActive && !isMobile && (
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
              fontSize: isMobile ? '14px' : '16px',
              color: '#666', lineHeight: '1.8',
              marginBottom: '36px', maxWidth: '380px',
              animation: 'fadeUp 1s ease forwards'
            }}>
              Streetwear • Essential • Authentic. Ropa urbana para cada momento con calidad y actitud.
            </p>

            <div style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap',
              animation: 'fadeUp 1.1s ease forwards'
            }}>
              <Link to="/catalogo" className="magnetic-btn" style={{
                background: '#fff', color: '#000',
                padding: isMobile ? '14px 32px' : '18px 48px',
                fontSize: '12px', fontWeight: '800', letterSpacing: '2px',
                textTransform: 'uppercase', borderRadius: '100px',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.4s'
              }}>
                Ver colección <FiArrowRight />
              </Link>
              <Link to="/registro" className="magnetic-btn" style={{
                background: 'transparent', color: '#fff',
                padding: isMobile ? '14px 32px' : '18px 48px',
                fontSize: '12px', fontWeight: '700', letterSpacing: '2px',
                textTransform: 'uppercase', borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.4s'
              }}>
                Registrarse
              </Link>
            </div>

            <div style={{
              display: 'flex', gap: '32px', marginTop: '48px',
              paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)',
              animation: 'fadeUp 1.2s ease forwards'
            }}>
              {[
                { num: '+500', label: 'Productos' },
                { num: '+1K', label: 'Clientes' },
                { num: '100%', label: 'Calidad' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>{s.num}</p>
                  <p style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO SIMULADO — SOLO DESKTOP */}
          {!isMobile && (
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
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'
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
          )}
        </div>

        {!isMobile && (
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#444', textTransform: 'uppercase' }}>Scroll</p>
            <div style={{
              width: '1px', height: '60px',
              background: 'linear-gradient(to bottom, #fff, transparent)',
              animation: 'float 1.5s ease-in-out infinite'
            }} />
          </div>
        )}
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        background: '#fff', borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0', padding: '16px 0', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'marquee 15s linear infinite', width: 'max-content' }}>
          {Array(8).fill(['URBANMERCH', '•', 'NUEVA COLECCIÓN', '•', 'ENVÍO GRATIS', '•', 'CALIDAD PREMIUM', '•']).flat().map((t, i) => (
            <span key={i} style={{
              fontSize: '12px', fontWeight: t === '•' ? '400' : '700',
              letterSpacing: t === '•' ? '0' : '2px',
              color: t === '•' ? '#ccc' : '#0a0a0a', whiteSpace: 'nowrap'
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIAS ── */}
      <section style={{
        padding: isMobile ? '80px 24px' : '140px 80px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div className="reveal" style={{ marginBottom: isMobile ? '48px' : '80px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>
            Colecciones
          </p>
          <h2 style={{
            fontSize: isMobile ? '40px' : '64px',
            fontWeight: '900', letterSpacing: '-2px', lineHeight: '1', color: '#fff'
          }}>
            Encuentra<br />
            <span style={{ WebkitTextStroke: isMobile ? '1px #fff' : '2px #fff', color: 'transparent' }}>tu estilo</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
          gap: '16px'
        }}>
          {categorias.map((cat, i) => (
            <Link to="/catalogo" key={i} className="reveal magnetic-btn" style={{
              background: cat.bg === '#0a0a0a' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
              borderRadius: '20px',
              padding: isMobile ? '28px 20px' : '52px 36px',
              minHeight: isMobile ? '160px' : '280px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
              border: cat.bg === '#0a0a0a' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <span style={{ fontSize: isMobile ? '32px' : '48px' }}>{cat.emoji}</span>
              <div>
                <p style={{
                  fontSize: isMobile ? '16px' : '24px',
                  fontWeight: '800', marginBottom: '4px',
                  color: cat.bg === '#0a0a0a' ? '#fff' : '#000'
                }}>{cat.nombre}</p>
                {!isMobile && (
                  <p style={{ fontSize: '13px', color: cat.bg === '#0a0a0a' ? '#666' : '#999' }}>{cat.desc} →</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: '#fff' }}>
        <div className="reveal" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'flex-end', marginBottom: '48px'
        }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase', marginBottom: '12px' }}>Lo más vendido</p>
            <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '900', letterSpacing: '-2px' }}>Destacados</h2>
          </div>
          <Link to="/catalogo" style={{
            fontSize: '12px', fontWeight: '600', color: '#000',
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', border: '1.5px solid #000',
            borderRadius: '100px', transition: 'all 0.3s', whiteSpace: 'nowrap'
          }}>
            Ver todo <FiArrowRight />
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: '20px'
        }}>
          {[
            { nombre: 'Camiseta Oversize Negra', precio: '45.000', cat: 'Camisetas', emoji: '👕', tag: 'NUEVO' },
            { nombre: 'Jogger Negro Premium', precio: '85.000', cat: 'Pantalones', emoji: '👖', tag: 'TOP' },
            { nombre: 'Gorra Urban Classic', precio: '40.000', cat: 'Accesorios', emoji: '🧢', tag: 'SALE' },
          ].map((p, i) => (
            <div key={i} className="reveal-scale" style={{
              borderRadius: '20px', overflow: 'hidden', border: '1px solid #f0f0f0',
              transition: 'all 0.4s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div style={{
                height: isMobile ? '200px' : '300px',
                background: '#f8f8f8', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: isMobile ? '60px' : '90px', position: 'relative'
              }}>
                {p.emoji}
                <span style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: '#0a0a0a', color: '#fff', fontSize: '10px',
                  fontWeight: '800', letterSpacing: '2px', padding: '5px 12px', borderRadius: '100px'
                }}>{p.tag}</span>
              </div>
              <div style={{ padding: isMobile ? '20px' : '28px' }}>
                <p style={{ fontSize: '11px', color: '#999', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{p.cat}</p>
                <p style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', marginBottom: '16px' }}>{p.nombre}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900' }}>${p.precio}</p>
                  <Link to="/catalogo" style={{
                    background: '#0a0a0a', color: '#fff',
                    padding: '10px 20px', borderRadius: '100px',
                    fontSize: '12px', fontWeight: '700'
                  }}>Agregar</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={{
        background: '#0a0a0a',
        padding: isMobile ? '80px 24px' : '160px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          alignItems: 'center', gap: isMobile ? '40px' : '80px',
          position: 'relative', zIndex: 2
        }}>
          <div className="reveal-left">
            <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#555', textTransform: 'uppercase', marginBottom: '20px' }}>
              Beneficios
            </p>
            <h2 style={{
              fontSize: isMobile ? '40px' : '68px',
              fontWeight: '900', color: '#fff',
              letterSpacing: '-2px', lineHeight: '0.95', marginBottom: '36px'
            }}>
              ENVÍO<br />GRATIS<br />
              <span style={{ WebkitTextStroke: isMobile ? '1px #fff' : '2px #fff', color: 'transparent' }}>
                PRIMER<br />PEDIDO
              </span>
            </h2>
            <Link to="/registro" style={{
              background: '#fff', color: '#000',
              padding: isMobile ? '14px 32px' : '20px 52px',
              fontSize: '12px', fontWeight: '800', letterSpacing: '2px',
              textTransform: 'uppercase', borderRadius: '100px',
              display: 'inline-flex', alignItems: 'center', gap: '10px'
            }}>
              Crear cuenta <FiArrowRight />
            </Link>
          </div>
          <div className="reveal-right" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', gap: '12px'
          }}>
            {[
              { icon: '🚚', titulo: 'Envío gratis', desc: 'En tu primer pedido' },
              { icon: '↩️', titulo: 'Devoluciones', desc: '30 días sin preguntas' },
              { icon: '🔒', titulo: 'Pago seguro', desc: 'Con Mercado Pago' },
              { icon: '⭐', titulo: 'Calidad', desc: 'Garantizada siempre' },
            ].map((b, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: isMobile ? '20px' : '32px',
                transition: 'all 0.4s'
              }}>
                <span style={{ fontSize: isMobile ? '24px' : '32px', display: 'block', marginBottom: '12px' }}>{b.icon}</span>
                <p style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? '13px' : '16px', marginBottom: '4px' }}>{b.titulo}</p>
                <p style={{ color: '#555', fontSize: '12px' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO Y MAPA ── */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: '#fff' }} id="contacto">
        <div className="reveal" style={{ marginBottom: isMobile ? '48px' : '80px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#999', textTransform: 'uppercase', marginBottom: '16px' }}>
            Encuéntranos
          </p>
          <h2 style={{ fontSize: isMobile ? '40px' : '64px', fontWeight: '900', letterSpacing: '-2px' }}>Visítanos</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
          gap: isMobile ? '48px' : '80px', alignItems: 'start'
        }}>
          <div className="reveal-left">
            {[
              { icon: <FiMapPin size={18} />, titulo: 'Dirección', desc: 'Calle Principal #00-00\nTu ciudad, Colombia' },
              { icon: <FiPhone size={18} />, titulo: 'Teléfono', desc: '+57 300 000 0000\nLunes a Sábado 9am – 7pm' },
              { icon: <FiMail size={18} />, titulo: 'Email', desc: 'info@urbanmerch.co' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '28px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', background: '#0a0a0a',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{item.titulo}</p>
                  <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Escríbenos</h3>
            <form onSubmit={e => { e.preventDefault(); alert('¡Mensaje enviado!') }}>
              {[
                { placeholder: 'Tu nombre', type: 'text' },
                { placeholder: 'Tu email', type: 'email' },
              ].map((f, i) => (
                <input key={i} type={f.type} placeholder={f.placeholder} required style={{
                  width: '100%', padding: '14px 18px', border: '1.5px solid #e8e8e8',
                  borderRadius: '12px', fontSize: '14px', outline: 'none',
                  marginBottom: '10px', fontFamily: 'inherit'
                }}
                  onFocus={e => e.target.style.borderColor = '#000'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                />
              ))}
              <textarea placeholder="Tu mensaje" required rows={4} style={{
                width: '100%', padding: '14px 18px', border: '1.5px solid #e8e8e8',
                borderRadius: '12px', fontSize: '14px', outline: 'none',
                marginBottom: '14px', resize: 'vertical', fontFamily: 'inherit'
              }}
                onFocus={e => e.target.style.borderColor = '#000'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
              <button type="submit" style={{
                width: '100%', padding: '16px', background: '#0a0a0a', color: '#fff',
                fontSize: '12px', fontWeight: '800', letterSpacing: '2px',
                textTransform: 'uppercase', borderRadius: '12px'
              }}>
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="reveal-right">
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46138266604!2d-75.66902645!3d6.2441833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8468b1a0cc7b1f07%3A0x7af19a04a0e5df80!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000"
                width="100%" height={isMobile ? '280px' : '440px'}
                style={{ border: 'none', display: 'block' }}
                allowFullScreen loading="lazy"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{
                background: '#0a0a0a', color: '#fff', padding: '14px',
                borderRadius: '12px', fontSize: '13px', fontWeight: '700',
                textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                <FiMapPin size={14} /> Cómo llegar
              </a>
              <a href="https://wa.me/573208665793" target="_blank" rel="noreferrer" style={{
                background: '#25D366', color: '#fff', padding: '14px',
                borderRadius: '12px', fontSize: '13px', fontWeight: '700',
                textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', padding: isMobile ? '60px 24px 32px' : '100px 80px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
          gap: isMobile ? '32px' : '60px', marginBottom: '48px'
        }}>
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <img src="/logo.png" alt="URBANMERCH"
              style={{ height: '48px', objectFit: 'contain', marginBottom: '16px', filter: 'brightness(10)' }} />
            <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.8', maxWidth: '280px' }}>
              Streetwear • Essential • Authentic.
            </p>
          </div>
          {[
            { titulo: 'Tienda', links: ['Catálogo', 'Novedades', 'Sale'] },
            { titulo: 'Cuenta', links: ['Iniciar sesión', 'Registrarse'] },
            { titulo: 'Info', links: ['Contacto', 'Envíos'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                {col.titulo}
              </h4>
              {col.links.map((link, j) => (
                <Link key={j} to="/" style={{ display: 'block', color: '#444', fontSize: '13px', marginBottom: '10px' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#444'}>
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'center',
          gap: '12px', textAlign: 'center'
        }}>
          <p style={{ color: '#333', fontSize: '12px' }}>© 2025 URBANMERCH. Todos los derechos reservados.</p>
          <a href="#" style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.06)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#555'
          }}>
            <FiInstagram size={18} />
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