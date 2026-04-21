import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModalHistorial({ member, onClose }) {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/memberships/member/${member.id}`)
      .then(res => { setPagos(res.data); setLoading(false) })
  }, [])

  return (
    <div className="modal-overlay">
      <div className="modal" style={{width: '550px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div>
            <h2>Historial de pagos</h2>
            <p className="modal-subtitle">{member.nombre}</p>
          </div>
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', color: '#888', padding: '2rem'}}>Cargando...</p>
        ) : pagos.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888', padding: '2rem'}}>Sin pagos registrados</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
            <thead>
              <tr style={{background: '#fafafa'}}>
                <th style={{textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 500}}>Fecha pago</th>
                <th style={{textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 500}}>Vencimiento</th>
                <th style={{textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 500}}>Monto</th>
                <th style={{textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 500}}>Método</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(p => (
                <tr key={p.id} style={{borderTop: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 12px'}}>{p.fechaPago}</td>
                  <td style={{padding: '8px 12px'}}>{p.fechaVencimiento}</td>
                  <td style={{padding: '8px 12px', fontWeight: 500}}>${p.montoPagado}</td>
                  <td style={{padding: '8px 12px', color: '#666'}}>{p.metodoPago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{marginTop: '1rem', padding: '12px', background: '#f9f9f9', borderRadius: '8px', fontSize: '13px', color: '#666'}}>
          Total pagos: <strong style={{color: '#111'}}>{pagos.length}</strong> &nbsp;|&nbsp;
          Total cobrado: <strong style={{color: '#111'}}>${pagos.reduce((sum, p) => sum + p.montoPagado, 0).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  )
}