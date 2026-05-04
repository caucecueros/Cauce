import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
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
              <div key={v.id} onClick={e => { e.stopPropagation(); setSeleccionado(v); }} title={v.nombre}
                style={{ width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', backgroundColor: v.material === 'Bronce' ? coloresUI.bronce : coloresUI.plata, border: seleccionado.id === v.id ? '2px solid white' : '1px solid rgba(255,255,255,0.3)', boxShadow: seleccionado.id === v.id ? '0 0 10px rgba(255,255,255,0.4)' : 'none', transition: 'all 0.2s' }}
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

export default function Catalogo({ onAgregar }) {
  const navigate = useNavigate();
  const { seccion } = useParams();
  const [itemEnZoom, setItemEnZoom] = useState(null);

  useEffect(() => {
    if (itemEnZoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [itemEnZoom]);

  const coloresUI = { marronOscuro: '#41251c', bronce: '#cd7f32', plata: '#c0c0c0' };

  const seccionesProductos = {
    cinturones: {
      titulo: 'CINTURONES',
      items: [
        { id: 7,  nombre: 'Cinto Clásica',  img: '/CinturonSimple.png' },
        { id: 8,  nombre: 'Cinto Clásico',  img: '/CinturonSimplo.png' },
        { id: 9,  nombre: 'Cinto Tallado',  img: '/CinturonRaro.png' },
        { id: 10, nombre: 'Cinto Puntera',  img: '/CinturonRedondo.png' },
        { id: 11, nombre: 'Cinto Flor',     img: '/CinturonCirculo.png' },
        { id: 12, nombre: 'Cinto Indio',    img: '/CinturonIndio.png' },
        { id: 13, nombre: 'Cinto Toro',     img: '/CinturonToro.png' },
        { id: 14, nombre: 'Cinto Durval',   img: '/CinturonDurval.png' },
        { id: 15, nombre: 'Cinto Terra',    img: '/CinturonTerra.png' },
        { id: 16, nombre: 'Cinto Cora',     img: '/CinturonCora.png' },
        { id: 17, nombre: 'Cinto Sol',      variantes: [{ id: 171, nombre: 'Cinto Sol Bronce', img: '/CinturonEstrella.png', material: 'Bronce' }, { id: 172, nombre: 'Cinto Sol Plata', img: '/CinturonEstrella2.png', material: 'Plata' }] },
        { id: 18, nombre: 'Cinto Ovál',     variantes: [{ id: 181, nombre: 'Cinto Ovál Bronce', img: '/CinturonCircular1.png', material: 'Bronce' }, { id: 182, nombre: 'Cinto Ovál Plata', img: '/CinturonCircular2.png', material: 'Plata' }] },
        { id: 19, nombre: 'Cinto Potro',    variantes: [{ id: 191, nombre: 'Cinto Potro Bronce', img: '/CinturonPerro.png', material: 'Bronce' }, { id: 192, nombre: 'Cinto Potro Plata', img: '/CinturonPerro2.png', material: 'Plata' }] },
      ]
    },
    brazaletes: {
      titulo: 'BRAZALETES',
      items: [
        { id: 10, nombre: 'Brazalete Clásica',   img: '/brazalete1.png' },
        { id: 11, nombre: 'Brazalete Cuadrada',  img: '/brazalete2.png' },
        { id: 12, nombre: 'Brazalete Gruesa',    img: '/brazalete3.png' },
        { id: 13, nombre: 'Brazalete Tachas',    variantes: [{ id: 131, nombre: 'Brazalete Tachas Marrón', img: '/brazalete4.png', material: 'Bronce' }, { id: 132, nombre: 'Brazalete Tachas Negro', img: '/brazalete5.png', material: 'Plata' }] },
      ]
    }
  };

  const ModalZoom = () => {
    if (!itemEnZoom) return null;
    return createPortal(
      <div style={estiloModalOverlay} onClick={() => setItemEnZoom(null)}>
        <div style={{ ...estiloModalContenido, animation: 'fadeSlideUp 0.3s ease both' }} onClick={e => e.stopPropagation()}>
          <X onClick={() => setItemEnZoom(null)} style={estiloBotonCerrar} size={22} />
          <img src={itemEnZoom.img} style={estiloFotoZoom} alt="zoom" />
          <div style={{ marginTop: '16px', color: '#fff' }}>
            <h2 style={{ letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
              {itemEnZoom.nombre}
            </h2>
            <button onClick={() => { onAgregar(itemEnZoom); setItemEnZoom(null); }} style={estiloBotonSeleccionarZoom}>
              AGREGAR A LA BOLSA
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Vista: sección de productos
  if (seccion && seccionesProductos[seccion]) {
    const data = seccionesProductos[seccion];
    return (
      <div style={estiloContenedorVista}>
        <button onClick={() => navigate('/catalogo')} style={estiloBotonRegresar}>
          <ArrowLeft size={15} /> VOLVER AL CATÁLOGO
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

  // Vista: menú principal del catálogo
  return (
    <div style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 20px)', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ letterSpacing: '5px', marginBottom: '50px', color: '#fff', fontSize: 'clamp(1.8rem, 7vw, 3.5rem)' }}>
        CATÁLOGO
      </h1>
      <div style={estiloGrillaMenuPrincipal}>
        {[
          { id: 'cinturones', t: 'Cinturones', img: '/cinturon.jpg' },
          { id: 'brazaletes', t: 'Brazaletes', img: '/brazalete.png' },
        ].map((sec, i) => (
          <div key={sec.id} className="bloque-catalogo" onClick={() => navigate(`/catalogo/${sec.id}`)}
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
const estiloModalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', animation: 'fadeIn 0.25s ease' };
const estiloModalContenido = { backgroundColor: '#2a1a14', padding: 'clamp(20px, 4vw, 30px)', borderRadius: '8px', maxWidth: '440px', width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.15)' };
const estiloFotoZoom = { width: '100%', borderRadius: '4px', maxHeight: '55vh', objectFit: 'contain' };
const estiloBotonCerrar = { position: 'absolute', top: '10px', right: '10px', color: '#fff', cursor: 'pointer', opacity: 0.7 };
const estiloBotonSeleccionarZoom = { marginTop: '16px', padding: '12px 24px', backgroundColor: '#41251c', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1.5px', fontSize: '0.8rem', width: '100%' };