package com.gymapp.gymmanager.service

import com.gymapp.gymmanager.entity.Member
import com.gymapp.gymmanager.repository.MemberRepository
import com.gymapp.gymmanager.repository.MembershipRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val membershipRepository: MembershipRepository
) {

    fun getAll(): List<Map<String, Any?>> {
        return memberRepository.findAll().map { member ->
            val memberships = membershipRepository.findByMemberId(member.id!!)

            val lastMensualidad = memberships
                .filter { it.tipo == "MENSUALIDAD" }
                .maxByOrNull { it.fechaVencimiento ?: java.time.LocalDate.MIN }

            // Clases con restantes > 0 (activas)
            val clasesActivas = memberships
                .filter { it.tipo == "CLASES" && (it.clasesRestantes ?: 0) > 0 }

            // Clases agotadas: tiene membresía de clases pero todas en 0
            val todasClases = memberships.filter { it.tipo == "CLASES" }
            val tieneClases = todasClases.isNotEmpty()
            val lastClasesAgotadas = tieneClases && clasesActivas.isEmpty()

            val clasesRestantes = clasesActivas.sumOf { it.clasesRestantes ?: 0 }
            val clasesTotal = clasesActivas.sumOf { it.clasesTotal ?: 0 }
            val lastClases = clasesActivas.maxByOrNull { it.fechaPago }

            // Disciplinas de mensualidad activa
            val disciplinasMensualidad = lastMensualidad?.disciplina ?: ""

            mapOf(
                "id" to member.id,
                "nombre" to member.nombre,
                "telefono" to member.telefono,
                "email" to member.email,
                "fechaRegistro" to member.fechaRegistro,
                "activo" to member.activo,
                "lastMembership" to lastMensualidad,
                "clasesRestantes" to clasesRestantes,
                "clasesTotal" to clasesTotal,
                "lastClasesId" to lastClases?.id,
                "lastClasesAgotadas" to lastClasesAgotadas,   // true si tuvo clases y se agotaron
                "disciplinasMensualidad" to disciplinasMensualidad, // disciplinas guardadas
                "disciplinas" to memberships.map { it.disciplina }.filter { it.isNotBlank() }.distinct()
            )
        }
    }

    fun getById(id: Long): Member = memberRepository.findById(id)
        .orElseThrow { RuntimeException("Miembro no encontrado") }

    fun create(member: Member): Member = memberRepository.save(member)

    fun update(id: Long, member: Member): Member {
        val existing = getById(id)
        return memberRepository.save(existing.copy(
            nombre = member.nombre,
            telefono = member.telefono,
            email = member.email,
            activo = member.activo
        ))
    }

    @Transactional
    fun delete(id: Long) {
        membershipRepository.deleteByMemberId(id)
        memberRepository.deleteById(id)
    }
}