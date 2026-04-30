import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';

const TarjetaProductoTerminado = ({ item, onVerZoom, coloresUI }) => {
  const tieneVariantes = item.variantes && item.variantes.length > 0;
  const [seleccionado, setSeleccionado] = useState(tieneVariantes ? item.variantes[0] : item);

  return (
    <div style={estiloTarjetaProducto}>
      <div
        style={{ ...estiloFotoTarjetaProducto, backgroundImage: `url(${seleccionado.img})` }}
        onClick={() => onVerZoom(seleccionado)}
      />
      <div style={estiloInfoTarjetaProducto}>
        <h3 style={{ margin: '0', textTransform: 'uppercase', fontSize: 'clamp(0.85rem, 2vw, 1rem)', letterSpacing: '1px' }}>
          {item.nombre}
        </h3>
        {tieneVariantes && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '14px 0' }}>
            {item.variantes.map(v => (
              <div
                key={v.id}
                onClick={e => { e.stopPropagation(); setSeleccionado(v); }}
                title={v.nombre}
                style={{
                  width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer',
                  backgroundColor: v.material === 'Bronce' ? coloresUI.bronce : coloresUI.plata,
                  border: seleccionado.id === v.id ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                  boxShadow: seleccionado.id === v.id ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}
        <p style={{ fontSize: '0.68rem', opacity: 0.45, margin: '8px 0 0', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
          Tocá la imagen para agregar
        </p>
      </div>
    </div>
  );
};

export default function Catalogo({ volver, onAgregar, seccionActiva, setSeccionActiva }) {
  const [itemEnZoom, setItemEnZoom] = useState(null);
  const [customItem, setCustomItem] = useState({ cuero: null, detalle: null });

  useEffect(() => {
    setCustomItem({ cuero: null, detalle: null });
  }, [seccionActiva]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (itemEnZoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [itemEnZoom]);

  const coloresUI = {
    marronOscuro: '#41251c',
    bronce: '#cd7f32',
    plata: '#c0c0c0',
  };

  const seccionesMateriales = {
    cueros: [
      { id: 1, nombre: 'Vaqueta Natural', img: '/cuero-natural.jpg', material: 'Vacuno' },
      { id: 2, nombre: 'Engrasado Marrón', img: '/cuero-marron.jpg', material: 'Vacuno' },
      { id: 3, nombre: 'Negro Profundo', img: '/pantalla4.jpg', material: 'Vacuno' },
    ],
    hebillas: [
      { id: 4, nombre: 'Hebilla Sol', variantes: [{ id: 41, nombre: 'Sol Bronce', img: '/Sol.jpg', material: 'Bronce' }, { id: 42, nombre: 'Sol Plata', img: '/sol-plata.jpg', material: 'Plata' }] },
      { id: 5, nombre: 'Estrella', variantes: [{ id: 51, nombre: 'Estrella Plata', img: '/hebilla-estrella.jpg', material: 'Plata' }, { id: 52, nombre: 'Estrella Bronce', img: '/estrella-bronce.jpg', material: 'Bronce' }] },
      { id: 6, nombre: 'Clásica', img: '/hebillas.jpg', material: 'Níquel' },
    ],
    tachas: [
      { id: 20, nombre: 'Línea Central', img: '/tacha-linea.jpg', material: 'Níquel' },
      { id: 21, nombre: 'Bordes Dobles', img: '/tacha-bordes.jpg', material: 'Bronce' },
    ]
  };

  const seccionesProductos = {
    armados: {
      titulo: 'CINTURONES TERMINADOS',
      items: [
        { id: 7, nombre: 'Cinto Sol', desc: 'Hebilla artesanal con baño de metal.', variantes: [{ id: 71, nombre: 'Cinto Sol Bronce', img: '/CinturonEstrella.png', material: 'Bronce' }, { id: 72, nombre: 'Cinto Sol Plata', img: '/CinturonEstrella2.png', material: 'Plata' }] },
        { id: 8, nombre: 'Cinto Toro', desc: 'Grabado tradicional.', img: '/CinturonToro.png' },
        { id: 9, nombre: 'Cinto', desc: 'Costura manual reforzada.', img: '/CinturonRaro.png' },
        { id: 11, nombre: 'Cinto Puntera', desc: 'Cuero engrasado de alta resistencia.', img: '/CinturonRedondo.png' },
        { id: 12, nombre: 'Cinto', desc: 'Diseño clásico correntino.', img: '/Circular.jpg' },
        { id: 13, nombre: 'Cinto Circular', desc: 'Hebilla artesanal con baño de metal.', variantes: [{ id: 131, nombre: 'Cinto Circular Bronce', img: '/CinturonCircular1.png', material: 'Bronce' }, { id: 132, nombre: 'Cinto Circular Plata', img: '/CinturonCircular2.png', material: 'Plata' }] },
      ]
    },
    brazaletes: {
      titulo: 'BRAZALETES TERMINADOS',
      items: [{ id: 10, nombre: 'Muñequera Pampa', desc: 'Grabado tradicional.', img: '/brazalete-1.jpg' }]
    }
  };

  const ModalZoom = () => {
    if (!itemEnZoom) return null;
    const esConfigurador = seccionActiva.includes('personalizar');
    return (
      <div style={estiloModalOverlay} onClick={() => setItemEnZoom(null)}>
        <div style={{ ...estiloModalContenido, animation: 'fadeSlideUp 0.3s ease both' }} onClick={e => e.stopPropagation()}>
          <X onClick={() => setItemEnZoom(null)} style={estiloBotonCerrar} size={22} />
          <img src={itemEnZoom.img} style={estiloFotoZoom} alt="zoom" />
          <div style={{ marginTop: '16px', color: '#fff' }}>
            <h2 style={{ letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
              {itemEnZoom.nombre}
            </h2>
            <p style={{ fontSize: '0.88rem', marginBottom: '18px', opacity: 0.85, fontFamily: 'sans-serif' }}>
              {itemEnZoom.desc || 'Artesanía en cuero de alta calidad.'}
            </p>
            <button
              onClick={() => {
                if (esConfigurador) {
                  if (itemEnZoom.material === 'Vacuno') setCustomItem({ ...customItem, cuero: itemEnZoom });
                  else setCustomItem({ ...customItem, detalle: itemEnZoom });
                } else {
                  onAgregar(itemEnZoom);
                }
                setItemEnZoom(null);
              }}
              style={estiloBotonSeleccionarZoom}
            >
              {esConfigurador ? 'SELECCIONAR PARA ARMAR' : 'AGREGAR A LA BOLSA'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TarjetaOpcion = ({ item }) => {
    const tieneVariantes = item.variantes && item.variantes.length > 0;
    const [varianteActiva, setVarianteActiva] = useState(tieneVariantes ? item.variantes[0] : item);
    const esSel = (customItem.cuero?.id === varianteActiva.id || customItem.detalle?.id === varianteActiva.id);
    return (
      <div style={{ ...estiloTarjetaOpcion, border: esSel ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)', transform: esSel ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s' }}>
        <div
          style={{ ...estiloFotoOpcion, backgroundImage: `url(${varianteActiva.img})`, height: '90px' }}
          onClick={() => {
            if (varianteActiva.material === 'Vacuno') setCustomItem({ ...customItem, cuero: varianteActiva });
            else setCustomItem({ ...customItem, detalle: varianteActiva });
          }}
        >
          {esSel && <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#41251c', fontWeight: 'bold' }}>✓</div>}
          <div onClick={e => { e.stopPropagation(); setItemEnZoom(varianteActiva); }} style={estiloIconoZoom}>
            <ZoomIn size={13} />
          </div>
        </div>
        {tieneVariantes && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '7px' }}>
            {item.variantes.map(v => (
              <div key={v.id} onClick={() => setVarianteActiva(v)} style={{ width: '13px', height: '13px', borderRadius: '50%', cursor: 'pointer', backgroundColor: v.material === 'Bronce' ? coloresUI.bronce : coloresUI.plata, border: varianteActiva.id === v.id ? '2px solid white' : '1px solid rgba(255,255,255,0.3)', transition: '0.15s' }} />
            ))}
          </div>
        )}
        <p style={estiloNombreOpcion}>{varianteActiva.nombre}</p>
      </div>
    );
  };

  if (seccionActiva === 'personalizarCinto' || seccionActiva === 'personalizarBrazalete') {
    const esCinto = seccionActiva === 'personalizarCinto';
    const listo = customItem.cuero && customItem.detalle;
    return (
      <div style={estiloContenedorVista}>
        <button onClick={() => setSeccionActiva('menu')} style={estiloBotonRegresar}>
          <ArrowLeft size={15} /> VOLVER
        </button>
        <h1 style={estiloTituloVista}>ARMA TU {esCinto ? 'CINTO' : 'BRAZALETE'}</h1>
        {(customItem.cuero || customItem.detalle) && (
          <div style={estiloResumenSeleccion}>
            {customItem.cuero && <span style={estiloChipSeleccion}>✓ {customItem.cuero.nombre}</span>}
            {customItem.detalle && <span style={estiloChipSeleccion}>✓ {customItem.detalle.nombre}</span>}
          </div>
        )}
        <div style={estiloGrillaConfigurador}>
          <div style={estiloCajaConfigurador}>
            <h3 style={estiloTituloConfig}>1. ELEGÍ EL CUERO</h3>
            <div style={{ ...estiloGrillaOpciones, gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
              {seccionesMateriales.cueros.map(c => <TarjetaOpcion key={c.id} item={c} />)}
            </div>
          </div>
          <div style={estiloCajaConfigurador}>
            <h3 style={estiloTituloConfig}>2. ELEGÍ EL {esCinto ? 'HEBILLA' : 'DETALLE'}</h3>
            <div style={{ ...estiloGrillaOpciones, gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
              {(esCinto ? seccionesMateriales.hebillas : seccionesMateriales.tachas).map(m => (
                <TarjetaOpcion key={m.id} item={m} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            disabled={!listo}
            onClick={() => {
              onAgregar({
                id: Date.now(),
                nombre: `${esCinto ? 'Cinto' : 'Brazalete'} Personalizado`,
                desc: `${customItem.cuero.nombre} + ${customItem.detalle.nombre}`,
                img: customItem.cuero.img,
                material: customItem.cuero.material,
              });
              setSeccionActiva('menu');
            }}
            style={{ ...estiloBotonFinal, opacity: listo ? 1 : 0.4, cursor: listo ? 'pointer' : 'not-allowed', transition: 'opacity 0.3s' }}
          >
            {listo ? 'AGREGAR A LA BOLSA ✓' : 'SELECCIONÁ CUERO Y DETALLE'}
          </button>
        </div>
        <ModalZoom />
      </div>
    );
  }

  if (seccionActiva !== 'menu') {
    const data = seccionesProductos[seccionActiva];
    return (
      <div style={estiloContenedorVista}>
        <button onClick={() => setSeccionActiva('menu')} style={estiloBotonRegresar}>
          <ArrowLeft size={15} /> VOLVER
        </button>
        <h1 style={estiloTituloVista}>{data.titulo}</h1>
        <div style={estiloGrillaProductos}>
          {data.items.map((item, i) => (
            <div key={item.id} style={{ animation: `fadeSlideUp 0.5s ${i * 0.08}s ease both`, opacity: 0 }}>
              <TarjetaProductoTerminado item={item} onVerZoom={setItemEnZoom} coloresUI={coloresUI} />
            </div>
          ))}
        </div>
        <ModalZoom />
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 20px)', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ letterSpacing: '5px', marginBottom: '50px', color: '#fff', fontSize: 'clamp(1.8rem, 7vw, 3.5rem)' }}>
        CATÁLOGO
      </h1>
      <div style={estiloGrillaMenuPrincipal}>
        {[
          { id: 'armados',    t: 'Cinturones', img: '/cinturon.jpg' },
          { id: 'brazaletes', t: 'Brazaletes', img: '/brazalete.png' },
        ].map((sec, i) => (
          <div
            key={sec.id}
            className="bloque-catalogo"
            onClick={() => setSeccionActiva(sec.id)}
            style={{ ...estiloBloqueSimple, backgroundImage: `url(${sec.img})`, animation: `fadeSlideUp 0.5s ${i * 0.1}s ease both`, opacity: 0 }}
          >
            <div className="overlay-texto" style={estiloContenedorTexto}>
              <h2 style={estiloTextoMenu}>{sec.t}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ESTILOS ---
const estiloContenedorVista = { padding: 'clamp(30px, 5vw, 60px) clamp(16px, 4vw, 40px)', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' };
const estiloTituloVista = { color: '#fff', letterSpacing: '4px', marginBottom: '36px', textAlign: 'center', fontSize: 'clamp(1.4rem, 5vw, 2.2rem)' };
const estiloGrillaMenuPrincipal = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(16px, 3vw, 30px)', width: '100%', padding: '0 0 40px' };
const estiloBloqueSimple = { border: '2px solid rgba(255,255,255,0.6)', aspectRatio: '1 / 1', width: '100%', maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '6px', overflow: 'hidden', position: 'relative' };
const estiloContenedorTexto = { backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', padding: 'clamp(10px, 2vw, 16px)', textAlign: 'center', backdropFilter: 'blur(3px)', transition: 'background-color 0.3s' };
const estiloTextoMenu = { fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 'bold', margin: '0', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' };
const estiloBotonRegresar = { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 18px', backgroundColor: '#41251c', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', cursor: 'pointer', marginBottom: '24px', fontSize: '0.75rem', letterSpacing: '1px', transition: 'opacity 0.2s' };
const estiloGrillaProductos = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' };
const estiloTarjetaProducto = { backgroundColor: 'rgba(65, 37, 28, 0.55)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.25s, box-shadow 0.25s' };
const estiloFotoTarjetaProducto = { height: 'clamp(200px, 30vw, 300px)', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', transition: 'transform 0.4s' };
const estiloInfoTarjetaProducto = { padding: 'clamp(14px, 3vw, 20px)', color: '#fff', textAlign: 'center' };
const estiloGrillaConfigurador = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' };
const estiloCajaConfigurador = { backgroundColor: 'rgba(20, 15, 10, 0.8)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' };
const estiloGrillaOpciones = { display: 'grid', gap: '10px', maxHeight: '420px', overflowY: 'auto' };
const estiloTarjetaOpcion = { padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', textAlign: 'center', cursor: 'pointer' };
const estiloFotoOpcion = { backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', cursor: 'pointer', position: 'relative' };
const estiloNombreOpcion = { fontSize: '0.6rem', marginTop: '6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' };
const estiloResumenSeleccion = { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' };
const estiloChipSeleccion = { backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '20px', padding: '5px 14px', fontSize: '0.7rem', color: '#fff', fontFamily: 'sans-serif', letterSpacing: '0.5px' };
const estiloBotonFinal = { padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 36px)', backgroundColor: '#41251c', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '4px', letterSpacing: '2px', fontWeight: 'bold', fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' };
const estiloIconoZoom = { position: 'absolute', top: '5px', right: '5px', backgroundColor: 'rgba(0,0,0,0.55)', padding: '4px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const estiloModalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', animation: 'fadeIn 0.25s ease' };
const estiloModalContenido = { backgroundColor: '#2a1a14', padding: 'clamp(20px, 4vw, 30px)', borderRadius: '8px', maxWidth: '440px', width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.15)' };
const estiloFotoZoom = { width: '100%', borderRadius: '4px', maxHeight: '55vh', objectFit: 'contain' };
const estiloBotonCerrar = { position: 'absolute', top: '10px', right: '10px', color: '#fff', cursor: 'pointer', opacity: 0.7 };
const estiloBotonSeleccionarZoom = { marginTop: '16px', padding: '12px 24px', backgroundColor: '#41251c', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1.5px', fontSize: '0.8rem', width: '100%' };
const estiloTituloConfig = { fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '14px', letterSpacing: '2px' };