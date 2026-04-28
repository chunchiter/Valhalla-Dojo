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

function calcularVencimiento(fechaPago) {
  if (!fechaPago) return ''
  const d = new Date(fechaPago + 'T00:00:00')
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export default function ModalNewMember({ onClose, onSave }) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '',
    fechaPago: today,
    metodoPago: 'Efectivo'
  })
  const [tieneMensualidad, setTieneMensualidad] = useState(false)
  const [tieneClases, setTieneClases] = useState(false)
  const [disciplinasMensualidad, setDisciplinasMensualidad] = useState([])
  const [paqueteClases, setPaqueteClases] = useState(null)
  const [fechaVencimiento, setFechaVencimiento] = useState(calcularVencimiento(today))
  const [montoMensualidad, setMontoMensualidad] = useState('')

  const handleChange = e => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (e.target.name === 'fechaPago') {
      setFechaVencimiento(calcularVencimiento(e.target.value))
    }
  }

  const toggleDisciplina = (d) => {
    setDisciplinasMensualidad(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.email)
      return alert('Completa los datos personales')
    if (!tieneMensualidad && !tieneClases)
      return alert('Selecciona al menos un tipo de membresía')
    if (tieneMensualidad && (disciplinasMensualidad.length === 0 || !fechaVencimiento || !montoMensualidad))
      return alert('Completa los datos de mensualidad')
    if (tieneClases && !paqueteClases)
      return alert('Selecciona un paquete de clases')

    const memberRes = await axios.post('/api/members', {
      nombre: form.nombre,
      telefono: form.telefono,
      email: form.email
    })
    const memberId = memberRes.data.id

    if (tieneMensualidad) {
      await axios.post('/api/memberships', {
        memberId,
        tipo: 'MENSUALIDAD',
        disciplina: disciplinasMensualidad.join(', '),
        fechaPago: form.fechaPago,
        fechaVencimiento,
        montoPagado: parseFloat(montoMensualidad),
        metodoPago: form.metodoPago
      })
    }

    if (tieneClases) {
      await axios.post('/api/memberships', {
        memberId,
        tipo: 'CLASES',
        disciplina: 'Pole & Aerial',
        fechaPago: form.fechaPago,
        fechaVencimiento: null,
        montoPagado: paqueteClases.precio,
        metodoPago: form.metodoPago,
        clasesTotal: paqueteClases.clases
      })
    }

    onSave()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal nm-modal">
        <h2>Nuevo miembro</h2>
        <div className="modal-body">

          <p className="modal-section-title">Datos personales</p>

          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" />

          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="9611234567" />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="juan@gmail.com" />

          <div className="nm-row">
            <div className="nm-field">
              <label>Fecha de pago</label>
              <input type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} />
            </div>
            <div className="nm-field">
              <label>Método de pago</label>
              <select name="metodoPago" value={form.metodoPago} onChange={handleChange}>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
            </div>
          </div>

          <p className="modal-section-title nm-section-gap">Tipo de membresía</p>

          <div className="nm-tipo-row">
            <label className="nm-check-label">
              <input type="checkbox" checked={tieneMensualidad} onChange={e => setTieneMensualidad(e.target.checked)} />
              Mensualidad
            </label>
            <label className="nm-check-label">
              <input type="checkbox" checked={tieneClases} onChange={e => setTieneClases(e.target.checked)} />
              Por clases
            </label>
          </div>

          {tieneMensualidad && (
            <div className="nm-section-box">
              <p className="nm-box-title">DISCIPLINAS</p>
              <div className="nm-disciplinas">
                {DISCIPLINAS_MENSUALIDAD.map(d => (
                  <label key={d} className="nm-check-label">
                    <input type="checkbox" checked={disciplinasMensualidad.includes(d)} onChange={() => toggleDisciplina(d)} />
                    {d}
                  </label>
                ))}
              </div>

              <div className="nm-row nm-venc-row">
                <div className="nm-field">
                  <label>
                    Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={e => setFechaVencimiento(e.target.value)}
                  />
                </div>
                <div className="nm-field">
                  <label>Monto</label>
                  <input
                    type="number"
                    value={montoMensualidad}
                    onChange={e => setMontoMensualidad(e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
          )}

          {tieneClases && (
            <div className="nm-section-box">
              <p className="nm-box-title">PAQUETE DE CLASES</p>
              <div className="nm-paquetes">
                {PAQUETES_CLASES.map(p => (
                  <label key={p.clases} className="nm-radio-label">
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

        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn-renovar" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  )
}