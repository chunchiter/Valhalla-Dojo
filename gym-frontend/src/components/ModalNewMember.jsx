import { useState } from 'react'
import axios from 'axios'

export default function ModalNewMember({ onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '',
    fechaPago: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    montoPagado: '',
    metodoPago: 'Efectivo'
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.email || !form.fechaVencimiento || !form.montoPagado)
      return alert('Completa todos los campos')

    const memberRes = await axios.post('/api/members', {
      nombre: form.nombre,
      telefono: form.telefono,
      email: form.email
    })

    await axios.post('/api/memberships', {
      memberId: memberRes.data.id,
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
        <h2>Nuevo miembro</h2>
        <div className="modal-body">
          <p className="modal-section-title">Datos personales</p>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" />
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="9611234567" />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="juan@gmail.com" />

          <p className="modal-section-title" style={{marginTop: '8px'}}>Membresía</p>
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