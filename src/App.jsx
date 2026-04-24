import React, { useState, useEffect, useRef } from 'react';
import { Instagram, MessageCircle, ShoppingBag, X, ChevronRight, Info } from 'lucide-react';
import Catalogo from './Catalogo';

// --- ESTILOS GLOBALES DE ANIMACIÓN ---
const estilosGlobales = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes panelSlideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  * { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(188,193,195,0.3); border-radius: 2px; }

  .btn-hover {
    transition: opacity 0.2s, transform 0.2s !important;
  }
  .btn-hover:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  .icono-footer:hover {
    opacity: 1 !important;
    transform: translateY(-2px);
  }
  .icono-footer {
    transition: opacity 0.2s, transform 0.2s;
  }
  .bloque-catalogo:hover .overlay-texto {
    background-color: rgba(0,0,0,0.65) !important;
  }
  .bloque-catalogo {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .bloque-catalogo:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
  }
`;

// --- CONSTANTES ---
const WHATSAPP_NUMBER = '5491100000000';
const INSTAGRAM_USER = 'caucecueros';

const TALLES_CINTO = [
  { label: 'XS', detalle: '90cm' },
  { label: 'S',  detalle: '95cm' },
  { label: 'M',  detalle: '100cm / jean 38' },
  { label: 'L',  detalle: '105cm' },
  { label: 'XL', detalle: '110cm' },
];

const TALLES_BRAZALETE = [
  { label: 'S', detalle: 'hasta 15cm' },
  { label: 'M', detalle: '15cm - 17cm' },
  { label: 'L', detalle: 'más de 17cm' },
];

function esBrazalete(nombre = '') {
  return nombre.toLowerCase().includes('brazalete') || nombre.toLowerCase().includes('muñequera');
}

// --- COMPONENTE GUÍA DE TALLES ---
function GuiaTalles({ onCerrar }) {
  return (
    <div style={estiloOverlayGuia} onClick={onCerrar}>
      <div
        style={estiloModalGuia}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onCerrar} style={estiloBotonCerrarGuia}>
          <X size={20} />
        </button>
        <h3 style={{ letterSpacing: '3px', marginBottom: '6px', fontSize: '1rem' }}>GUÍA DE TALLES</h3>
        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '24px', fontFamily: 'sans-serif' }}>
          Medí tu cintura con una cinta métrica y elegí tu talle.
        </p>

        {/* Cinturones */}
        <h4 style={estiloSubtituloGuia}>CINTURONES</h4>
        <table style={estiloTabla}>
          <thead>
            <tr>
              <th style={estiloCeldaHeader}>Talle</th>
              <th style={estiloCeldaHeader}>Largo total</th>
              <th style={estiloCeldaHeader}>Jean equiv.</th>
            </tr>
          </thead>
          <tbody>
            {[
              { talle: 'XS', largo: '90cm', jean: '34 / 36' },
              { talle: 'S',  largo: '95cm', jean: '36 / 38' },
              { talle: 'M',  largo: '100cm', jean: '38 / 40' },
              { talle: 'L',  largo: '105cm', jean: '40 / 42' },
              { talle: 'XL', largo: '110cm', jean: '42 / 44' },
            ].map((row, i) => (
              <tr key={row.talle} style={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <td style={estiloCelda}><strong>{row.talle}</strong></td>
                <td style={estiloCelda}>{row.largo}</td>
                <td style={estiloCelda}>{row.jean}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: '10px 0 20px', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
          ¿No sabés tu talle? Medí tu cintura y sumale 10-15cm.
        </p>

        {/* Brazaletes */}
        <h4 style={estiloSubtituloGuia}>BRAZALETES</h4>
        <table style={estiloTabla}>
          <thead>
            <tr>
              <th style={estiloCeldaHeader}>Talle</th>
              <th style={estiloCeldaHeader}>Medida de muñeca</th>
            </tr>
          </thead>
          <tbody>
            {TALLES_BRAZALETE.map((t, i) => (
              <tr key={t.label} style={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <td style={estiloCelda}><strong>{t.label}</strong></td>
                <td style={estiloCelda}>{t.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: '10px 0 0', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
          Medí con una cinta la parte más ancha de tu muñeca.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [verCatalogo, setVerCatalogo] = useState(false);
  const [seccionCatalogo, setSeccionCatalogo] = useState('menu');
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAnimKey(k => k + 1);
  }, [verCatalogo, seccionCatalogo]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => [...prev, { ...producto, talle: null, medidaMuneca: '' }]);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarTalle = (index, talle) => {
    setCarrito(prev => prev.map((item, i) => i === index ? { ...item, talle } : item));
  };

  const actualizarMedida = (index, medidaMuneca) => {
    setCarrito(prev => prev.map((item, i) => i === index ? { ...item, medidaMuneca } : item));
  };

  const enviarPorWhatsApp = () => {
    const lineas = carrito.map(item => {
      if (esBrazalete(item.nombre)) {
        const medida = item.medidaMuneca ? `Muñeca: ${item.medidaMuneca}cm` : 'Medida de muñeca: (pendiente)';
        return `• ${item.nombre} | ${medida}`;
      }
      const talleInfo = item.talle
        ? `Talle ${item.talle.label} (${item.talle.detalle})`
        : 'Talle: (pendiente)';
      return `• ${item.nombre} | ${talleInfo}`;
    }).join('\n');

    const mensaje =
      `Hola! Quiero hacer un pedido en Cauce Cueros 🤎\n\n` +
      `📦 *Mi pedido:*\n${lineas}\n\n` +
      `Quedo esperando confirmación, gracias!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const colores = {
    marronOscuro: '#41251c',
    marronCrema: '#724734',
    blancoCrema: '#a88464',
    fondoClaro: '#c6a584',
    plataletra: '#bcc1c3',
    blanco: '#ffffff',
  };

  const etiquetasSecciones = {
    menu: 'CATÁLOGO',
    armados: 'CINTURONES',
    brazaletes: 'BRAZALETES',
    personalizarCinto: 'ARMÁ TU CINTO',
    personalizarBrazalete: 'ARMÁ TU BRAZALETE',
  };

  return (
    <>
      <style>{estilosGlobales}</style>
      <div style={{ minHeight: '100vh', fontFamily: 'serif', backgroundColor: '#1a0f0b' }}>

        {/* NAVBAR */}
        <nav style={estiloNavbar(colores)}>
          <div style={estiloContenedorLogo}>
            <img
              src="/logo1.png"
              alt="Cauce"
              style={{ ...estiloImagenLogo, cursor: verCatalogo ? 'pointer' : 'default' }}
              onClick={() => { setVerCatalogo(false); setSeccionCatalogo('menu'); }}
            />
          </div>

          {verCatalogo && (
            <div style={estiloBreadcrumb}>
              <span style={estiloMigaInactiva} onClick={() => { setVerCatalogo(false); setSeccionCatalogo('menu'); }}>
                INICIO
              </span>
              <ChevronRight size={12} style={{ opacity: 0.4 }} />
              {seccionCatalogo === 'menu' ? (
                <span style={estiloMigaActiva}>CATÁLOGO</span>
              ) : (
                <>
                  <span style={estiloMigaInactiva} onClick={() => setSeccionCatalogo('menu')}>
                    CATÁLOGO
                  </span>
                  <ChevronRight size={12} style={{ opacity: 0.4 }} />
                  <span style={estiloMigaActiva}>{etiquetasSecciones[seccionCatalogo]}</span>
                </>
              )}
            </div>
          )}

          <div style={estiloContenedorCarrito}>
            <div onClick={() => setCarritoAbierto(true)} style={{ position: 'relative', cursor: 'pointer', padding: '4px' }}>
              <ShoppingBag size={26} color="#fff" />
              {carrito.length > 0 && <span style={estiloContador}>{carrito.length}</span>}
            </div>
          </div>
        </nav>

        {/* CONTENIDO CON ANIMACIÓN */}
        <div key={animKey} style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
          {verCatalogo ? (
            <div style={{ backgroundImage: "url('/pantalla5.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
            <Catalogo
              volver={() => { setVerCatalogo(false); setSeccionCatalogo('menu'); }}
              onAgregar={agregarAlCarrito}
              seccionActiva={seccionCatalogo}
              setSeccionActiva={setSeccionCatalogo}
            />
            </div>
          ) : (
            <>
              <header style={estiloHero}>
                <p style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)', letterSpacing: '5px', color: colores.blanco, marginBottom: '20px', fontWeight: 'bold', animation: 'fadeSlideUp 0.6s 0.1s ease both', opacity: 0 }}>
                  HECHO A MANO
                </p>
                <h2 style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', lineHeight: '1.1', marginBottom: '30px', color: colores.blanco, animation: 'fadeSlideUp 0.6s 0.2s ease both', opacity: 0 }}>
                  Piezas que cuentan una historia.
                </h2>
                <div style={{ width: '80px', height: '2px', backgroundColor: colores.blanco, margin: '0 auto 30px', animation: 'fadeSlideUp 0.6s 0.3s ease both', opacity: 0 }} />
                <p style={{ fontFamily: 'sans-serif', color: colores.blanco, lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 40px', fontSize: 'clamp(0.85rem, 2vw, 1rem)', animation: 'fadeSlideUp 0.6s 0.4s ease both', opacity: 0 }}>
                  Trabajamos el cuero con la paciencia del artesano y la precisión del diseño contemporáneo en Corrientes, Argentina.
                </p>
                <button
                  className="btn-hover"
                  onClick={() => setVerCatalogo(true)}
                  style={{ ...estiloBotonHero(colores), animation: 'fadeSlideUp 0.6s 0.5s ease both', opacity: 0 }}
                >
                  VER CATÁLOGO
                </button>
              </header>

              <section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 40px)', backgroundColor: '#F4F1EE' }}>
                <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
                  <h3 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '16px', letterSpacing: '3px', color: colores.marronOscuro }}>
                    MATERIA PRIMA
                  </h3>
                  <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px', color: colores.marronCrema, fontFamily: 'sans-serif', opacity: 0.8, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    Conocé los elementos que dan vida a nuestras piezas antes de elegir tu diseño.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px, 3vw, 40px)', marginBottom: '50px' }}>
                    {[
                      { img: '/tachas.png',  titulo: 'Tachas',  desc: 'Selección de tachas metálicas para personalización.' },
                      { img: '/Cuero.png',   titulo: 'Cueros',  desc: 'Vaqueta curtida vegetal y cueros engrasados de alta densidad.' },
                      { img: '/hebillas.jpg', titulo: 'Hebillas', desc: 'Bronce macizo y metales fundidos con detalles de diseño.' },
                    ].map(mat => (
                      <div key={mat.titulo} style={estiloCajaMaterial}>
                        <div style={{ ...estiloImagenMaterial, backgroundImage: `url('${mat.img}')` }} />
                        <div style={{ padding: 'clamp(16px, 3vw, 30px)' }}>
                          <h4 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', marginBottom: '12px' }}>{mat.titulo}</h4>
                          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#555' }}>{mat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn-hover" onClick={() => setVerCatalogo(true)} style={estiloBotonSeccion(colores)}>
                      IR AL CATÁLOGO DE PIEZAS
                    </button>
                  </div>
                </div>
              </section>

              <footer style={{ padding: 'clamp(40px, 8vw, 60px) 20px', textAlign: 'center', backgroundColor: colores.marronOscuro, color: colores.fondoClaro }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '36px', marginBottom: '16px' }}>
                  <div className="icono-footer" onClick={() => window.open(`https://instagram.com/${INSTAGRAM_USER}`, '_blank')} style={{ cursor: 'pointer', opacity: 0.8 }} title="Instagram">
                    <Instagram size={26} color={colores.blancoCrema} />
                  </div>
                  <div className="icono-footer" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quería consultar sobre sus productos 😊')}`, '_blank')} style={{ cursor: 'pointer', opacity: 0.8 }} title="WhatsApp">
                    <MessageCircle size={26} color={colores.blancoCrema} />
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.6, marginBottom: '6px', fontFamily: 'sans-serif' }}>@{INSTAGRAM_USER}</p>
                <p style={{ fontSize: '0.65rem', letterSpacing: '2px', opacity: 0.4 }}>© 2026 CAUCE CUEROS. HECHO A MANO.</p>
              </footer>
            </>
          )}
        </div>

        {/* PANEL CARRITO */}
        {carritoAbierto && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, animation: 'fadeIn 0.3s ease' }} onClick={() => setCarritoAbierto(false)} />
            <div style={{ ...estiloPanelCarrito, animation: 'panelSlideIn 0.35s ease both' }}>
              <div style={estiloHeaderCarrito}>
                <h2 style={{ margin: 0, letterSpacing: '2px', fontSize: '1.1rem' }}>MI BOLSA</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {carrito.length > 0 && (
                    <button
                      onClick={() => setGuiaAbierta(true)}
                      style={{ background: 'none', border: 'none', color: colores.plataletra, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', letterSpacing: '1px' }}
                      title="Guía de talles"
                    >
                      <Info size={14} /> GUÍA DE TALLES
                    </button>
                  )}
                  <X onClick={() => setCarritoAbierto(false)} style={{ cursor: 'pointer' }} size={22} />
                </div>
              </div>

              {carrito.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.5, animation: 'fadeIn 0.4s ease' }}>
                  <ShoppingBag size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
                  <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem' }}>Tu bolsa está vacía.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                  {carrito.map((item, index) => {
                    const esBraz = esBrazalete(item.nombre);
                    const talles = esBraz ? TALLES_BRAZALETE : TALLES_CINTO;
                    return (
                      <div key={index} style={{ ...estiloItemCarrito, animation: `fadeSlideUp 0.4s ${index * 0.07}s ease both`, opacity: 0 }}>
                        <img src={item.img} alt={item.nombre} style={estiloImagenCarrito} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.nombre}</h4>

                          {!esBraz ? (
                            <div>
                              <p style={{ margin: '0 0 6px', fontSize: '0.6rem', opacity: 0.55, letterSpacing: '1px', fontFamily: 'sans-serif' }}>TALLE:</p>
                              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                {talles.map(t => (
                                  <button
                                    key={t.label}
                                    onClick={() => actualizarTalle(index, t)}
                                    title={t.detalle}
                                    style={{
                                      ...estiloBotonTalle,
                                      backgroundColor: item.talle?.label === t.label ? '#bcc1c3' : 'transparent',
                                      color: item.talle?.label === t.label ? '#41251c' : '#bcc1c3',
                                    }}
                                  >
                                    {t.label}
                                  </button>
                                ))}
                              </div>
                              {item.talle && (
                                <p style={{ margin: '5px 0 0', fontSize: '0.58rem', opacity: 0.45, fontFamily: 'sans-serif' }}>{item.talle.detalle}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p style={{ margin: '0 0 5px', fontSize: '0.6rem', opacity: 0.55, letterSpacing: '1px', fontFamily: 'sans-serif' }}>MEDIDA DE MUÑECA (cm):</p>
                              <input
                                type="number" min="12" max="25" placeholder="ej: 17"
                                value={item.medidaMuneca}
                                onChange={e => actualizarMedida(index, e.target.value)}
                                style={estiloInputMedida}
                              />
                            </div>
                          )}
                        </div>
                        <button onClick={() => eliminarDelCarrito(index)} style={estiloBotonEliminar}>✕</button>
                      </div>
                    );
                  })}

                  <button className="btn-hover" onClick={enviarPorWhatsApp} style={estiloBotonFinalizar}>
                    FINALIZAR PEDIDO 💬
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* GUÍA DE TALLES */}
        {guiaAbierta && <GuiaTalles onCerrar={() => setGuiaAbierta(false)} />}

      </div>
    </>
  );
}

// --- ESTILOS ---

const estiloNavbar = (c) => ({
  padding: '12px clamp(16px, 5vw, 70px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/banne.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderBottom: `1px solid rgba(255,255,255,0.08)`,
  color: '#fff',
  backgroundColor: c.marronOscuro,
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '0px 6px 24px rgba(0,0,0,0.5)'
});

const estiloContenedorLogo = { flex: '0 0 auto', display: 'flex', alignItems: 'center' };
const estiloImagenLogo = { width: 'clamp(60px, 9vw, 95px)', height: 'auto' };

const estiloBreadcrumb = {
  flex: '1 1 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  color: '#fff',
  fontSize: 'clamp(0.55rem, 1.5vw, 0.72rem)',
  letterSpacing: '1.5px',
  fontFamily: 'sans-serif',
  flexWrap: 'wrap',
};

const estiloMigaInactiva = { opacity: 0.45, cursor: 'pointer', transition: 'opacity 0.2s' };
const estiloMigaActiva = { opacity: 1, fontWeight: 'bold' };
const estiloContenedorCarrito = { flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', minWidth: '60px' };

const estiloDegradadoTransicion = {
  width: '100%', height: '50px',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
  pointerEvents: 'none'
};

const estiloHero = {
  padding: 'clamp(60px, 12vh, 140px) clamp(16px, 5vw, 40px)',
  textAlign: 'center',
  maxWidth: '100%',
  backgroundImage: "url('/pantalla5.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const estiloBotonHero = (c) => ({
  padding: 'clamp(14px, 2vw, 18px) clamp(28px, 5vw, 45px)',
  backgroundColor: c.marronOscuro,
  color: 'white',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
  letterSpacing: '2px',
  fontWeight: 'bold',
});

const estiloBotonSeccion = (c) => ({
  padding: 'clamp(14px, 2vw, 22px) clamp(28px, 5vw, 50px)',
  backgroundColor: c.marronOscuro,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
  letterSpacing: '3px',
  fontWeight: 'bold',
  boxShadow: '0 10px 20px rgba(65, 37, 28, 0.3)',
});

const estiloContador = {
  position: 'absolute', top: '-4px', right: '-4px',
  backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%',
  padding: '1px 5px', fontSize: '0.6rem', fontWeight: 'bold', border: '1px solid #fff'
};

const estiloPanelCarrito = {
  position: 'fixed', top: 0, right: 0,
  width: 'min(420px, 100vw)', height: '100%',
  backgroundColor: '#41251c', color: 'white',
  padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 30px)',
  boxShadow: '-5px 0 20px rgba(0,0,0,0.5)', fontFamily: 'serif',
  display: 'flex', flexDirection: 'column', gap: '0',
  zIndex: 200, overflowY: 'auto',
};

const estiloHeaderCarrito = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: '24px', borderBottom: '1px solid rgba(188, 193, 195, 0.2)', paddingBottom: '18px',
  flexShrink: 0,
};

const estiloItemCarrito = {
  display: 'flex', alignItems: 'flex-start', gap: '12px',
  borderBottom: '1px solid rgba(188, 193, 195, 0.08)', paddingBottom: '16px'
};

const estiloImagenCarrito = {
  width: 'clamp(50px, 10vw, 65px)', height: 'clamp(50px, 10vw, 65px)',
  objectFit: 'cover', borderRadius: '4px', flexShrink: 0
};

const estiloBotonTalle = {
  padding: '4px 9px',
  border: '1px solid rgba(188,193,195,0.4)',
  borderRadius: '3px', cursor: 'pointer',
  fontSize: '0.62rem', fontWeight: 'bold', letterSpacing: '0.5px',
  transition: 'all 0.15s',
};

const estiloInputMedida = {
  width: '72px', padding: '5px 8px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(188,193,195,0.35)',
  borderRadius: '4px', color: '#fff',
  fontSize: '0.8rem', outline: 'none',
};

const estiloBotonEliminar = {
  background: 'none', border: 'none', color: 'rgba(231,76,60,0.8)',
  cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0, paddingTop: '2px',
  transition: 'color 0.15s',
};

const estiloBotonFinalizar = {
  marginTop: '16px', padding: '16px',
  backgroundColor: '#bcc1c3', color: '#41251c',
  border: 'none', borderRadius: '4px', fontWeight: 'bold',
  letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase',
  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', flexShrink: 0,
};

const estiloCajaMaterial = {
  backgroundColor: 'white', borderRadius: '4px', overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'left',
};

const estiloImagenMaterial = {
  height: 'clamp(180px, 25vw, 300px)', backgroundSize: 'cover', backgroundPosition: 'center'
};

// Guía de talles
const estiloOverlayGuia = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 500,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  animation: 'fadeIn 0.25s ease', padding: '20px',
};

const estiloModalGuia = {
  backgroundColor: '#2a1a14', color: '#fff', borderRadius: '8px',
  padding: 'clamp(24px, 5vw, 40px)', maxWidth: '460px', width: '100%',
  position: 'relative', border: '1px solid rgba(255,255,255,0.12)',
  animation: 'fadeSlideUp 0.3s ease both', maxHeight: '90vh', overflowY: 'auto',
};

const estiloBotonCerrarGuia = {
  position: 'absolute', top: '14px', right: '14px',
  background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6,
};

const estiloSubtituloGuia = {
  fontSize: '0.72rem', letterSpacing: '2px', opacity: 0.6,
  marginBottom: '10px', fontFamily: 'sans-serif',
};

const estiloTabla = {
  width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '0.82rem',
};

const estiloCeldaHeader = {
  textAlign: 'left', padding: '8px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  fontSize: '0.65rem', letterSpacing: '1px', opacity: 0.55, fontWeight: 'bold',
};

const estiloCelda = {
  padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)',
};

export default App;