package com.gymapp.gymmanager.service

import com.gymapp.gymmanager.entity.Membership
import com.gymapp.gymmanager.repository.MemberRepository
import com.gymapp.gymmanager.repository.MembershipRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class MembershipService(
    private val membershipRepository: MembershipRepository,
    private val memberRepository: MemberRepository
) {

    fun getAll(): List<Membership> = membershipRepository.findAll()

    fun getByMemberId(memberId: Long): List<Membership> =
        membershipRepository.findByMemberId(memberId)

    fun create(membership: Membership): Membership {
        // Si es la primera membresía de CLASES de este miembro,
        // registrar automáticamente la inscripción de $250
        if (membership.tipo == "CLASES") {
            val prevClases = membershipRepository.findByMemberId(membership.member.id!!)
                .filter { it.tipo == "CLASES" }
            if (prevClases.isEmpty()) {
                membershipRepository.save(
                    Membership(
                        member = membership.member,
                        tipo = "INSCRIPCION",
                        disciplina = "Inscripción",
                        fechaPago = membership.fechaPago,
                        fechaVencimiento = null,
                        montoPagado = BigDecimal("250"),
                        metodoPago = membership.metodoPago,
                        clasesTotal = null,
                        clasesRestantes = null
                    )
                )
            }
        }
        return membershipRepository.save(membership)
    }

    fun getExpired(): List<Membership> =
        membershipRepository.findExpired(LocalDate.now())

    fun getExpiringSoon(days: Long = 5): List<Membership> =
        membershipRepository.findExpiringSoon(LocalDate.now(), LocalDate.now().plusDays(days))

    fun descontarClase(id: Long): Membership {
        val membership = membershipRepository.findById(id)
            .orElseThrow { RuntimeException("Membresía no encontrada") }
        if (membership.tipo != "CLASES") throw RuntimeException("Esta membresía no es por clases")
        val restantes = membership.clasesRestantes ?: 0
        if (restantes <= 0) throw RuntimeException("No quedan clases disponibles")
        return membershipRepository.save(membership.copy(clasesRestantes = restantes - 1))
    }
}