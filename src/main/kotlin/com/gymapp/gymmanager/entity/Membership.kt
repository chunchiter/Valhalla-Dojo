package com.gymapp.gymmanager.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate

@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
@Entity
@Table(name = "memberships")
data class Membership(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    val member: Member = Member(),

    @Column(nullable = false)
    val tipo: String = "MENSUALIDAD", // MENSUALIDAD o CLASES

    @Column(nullable = false)
    val disciplina: String = "",

    @Column(nullable = false)
    val fechaPago: LocalDate = LocalDate.now(),

    @Column
    val fechaVencimiento: LocalDate? = null, // null si es por clases

    @Column(nullable = false)
    val montoPagado: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false)
    val metodoPago: String = "Efectivo",

    @Column
    val clasesTotal: Int? = null, // solo si tipo = CLASES

    @Column
    val clasesRestantes: Int? = null // solo si tipo = CLASES
)