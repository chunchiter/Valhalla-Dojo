import { useState } from 'react'
import axios from 'axios'

const DISCIPLINAS_MENSUALIDAD = ['Aikido', 'Defensa Personal', 'Esgrima Vikinga', 'Funcional Militar']
const PAQUETES_CLASES = [
  { label: 'Clase suelta - $130', clases: 1, precio: 130 },
  { label: '6 clases - $480', clases: 6, precio: 480 },
  { label: '8 clases - $630', clases: 8, precio: 630 },
  { label: '10 clases - $780', clases: 10, precio: 780 },
  { label: '12 clases - $915', clases: 12, precio: 915 },
  { label: '16 clases - $1200', clases: 16, precio: 1200 },
  { label: '20 clases - $1500', clases: 20, precio: 1500 },
]

export default function ModalRenew({ member, onClose, onSave }) {
  const disciplinasGuardadas = member.disciplinasMensualidad
    ? member.disciplinasMensualidad.split(',').map(d => d.trim()).filter(Boolean)
    : []

  const teniaMensualidad = !!member.lastMembership
  const teniaClases = (member.clasesRestantes ?? 0) > 0 || member.lastClasesAgotadas === true

  const [tieneMensualidad, setTieneMensualidad] = useState(teniaMensualidad)
  const [tieneClases, setTieneClases] = useState(false)
  const [disciplinasMensualidad, setDisciplinasMensualidad] = useState(disciplinasGuardadas)
  const [paqueteClases, setPaqueteClases] = useState(null)
  const [fechaVencimiento, setFechaVencimiento] = useState(
    member.lastMembership?.fechaVencimiento ?? ''
  )
  const [monto, setMonto] = useState('')
  const [fechaPago] = useState(new Date().toISOString().split('T')[0])
  const [metodoPago, setMetodoPago] = useState('Efectivo')

  const toggleDisciplina = (d) => {
    setDisciplinasMensualidad(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )
  }

  const handleSubmit = async () => {
    if (!tieneMensualidad && !tieneClases)
      return alert('Selecciona al menos un tipo de membresía')
    if (tieneMensualidad && (disciplinasMensualidad.length === 0 || !fechaVencimiento || !monto))
      return alert('Completa todos los campos de mensualidad')
    if (tieneClases && !paqueteClases)
      return alert('Selecciona un paquete de clases')

    if (tieneMensualidad) {
      await axios.post('/api/memberships', {
        memberId: member.id,
        tipo: 'MENSUALIDAD',
        disciplina: disciplinasMensualidad.join(', '),
        fechaPago,
        fechaVencimiento,
        montoPagado: parseFloat(monto),
        metodoPago,
        clasesTotal: null
      })
    }

    if (tieneClases) {
      await axios.post('/api/memberships', {
        memberId: member.id,
        tipo: 'CLASES',
        disciplina: 'Pole & Aerial',
        fechaPago,
        fechaVencimiento: null,
        montoPagado: paqueteClases.precio,
        metodoPago,
        clasesTotal: paqueteClases.clases
      })
    }

    onSave()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '440px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Renovar membresía</h2>
        <p className="modal-subtitle">{member.nombre}</p>

        <div className="modal-body">

          {/* Tipo: checkboxes para poder combinar */}
          <label>Tipo de renovación</label>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={tieneMensualidad}
                onChange={e => setTieneMensualidad(e.target.checked)}
              />
              Mensualidad
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={tieneClases}
                onChange={e => setTieneClases(e.target.checked)}
              />
              Por clases
            </label>
          </div>

          {/* Sección Mensualidad */}
          {tieneMensualidad && (
            <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>DISCIPLINAS</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {DISCIPLINAS_MENSUALIDAD.map(d => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={disciplinasMensualidad.includes(d)}
                      onChange={() => toggleDisciplina(d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Fecha de vencimiento</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={e => setFechaVencimiento(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <label style={{ display: 'block', marginBottom: '4px' }}>Monto</label>
              <input
                type="number"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="500"
              />
            </div>
          )}

          {/* Sección Clases */}
          {tieneClases && (
            <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>PAQUETE DE CLASES</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PAQUETES_CLASES.map(p => (
                  <label key={p.clases} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="paquete"
                      checked={paqueteClases?.clases === p.clases}
                      onChange={() => setPaqueteClases(p)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label style={{ marginTop: '4px' }}>Método de pago</label>
          <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn-renovar" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  )
}