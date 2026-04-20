import { useState } from 'react'
import axios from 'axios'

export default function ModalRenew({ member, onClose, onSave }) {
  const [form, setForm] = useState({
    fechaPago: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    montoPagado: '',
    metodoPago: 'Efectivo'
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.fechaVencimiento || !form.montoPagado) return alert('Completa todos los campos')
    await axios.post('/api/memberships', {
      memberId: member.id,
      fechaPago: form.fechaPago,
      fechaVencimiento: form.fechaVencimiento,
      montoPagado: parseFloat(form.montoPagado),
      metodoPago: form.metodoPago
    })
    onSave()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Renovar membresía</h2>
        <p className="modal-subtitle">{member.nombre}</p>
        <div className="modal-body">
          <label>Fecha de pago</label>
          <input type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} />
          <label>Fecha de vencimiento</label>
          <input type="date" name="fechaVencimiento" value={form.fechaVencimiento} onChange={handleChange} />
          <label>Monto pagado</label>
          <input type="number" name="montoPagado" value={form.montoPagado} onChange={handleChange} placeholder="500" />
          <label>Método de pago</label>
          <select name="metodoPago" value={form.metodoPago} onChange={handleChange}>
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