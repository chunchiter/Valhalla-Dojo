package com.gymapp.gymmanager.dto

import java.math.BigDecimal
import java.time.LocalDate

data class MembershipRequest(
    val memberId: Long,
    val tipo: String = "MENSUALIDAD",
    val disciplina: String = "",
    val fechaPago: LocalDate,
    val fechaVencimiento: LocalDate? = null,
    val montoPagado: BigDecimal,
    val metodoPago: String = "Efectivo",
    val clasesTotal: Int? = null
)