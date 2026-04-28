package com.gymapp.gymmanager.controller

import com.gymapp.gymmanager.dto.MembershipRequest
import com.gymapp.gymmanager.entity.Member
import com.gymapp.gymmanager.entity.Membership
import com.gymapp.gymmanager.service.MemberService
import com.gymapp.gymmanager.service.MembershipService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/memberships")
class MembershipController(
    private val membershipService: MembershipService,
    private val memberService: MemberService
) {

    @GetMapping
    fun getAll() = ResponseEntity.ok(membershipService.getAll())

    @GetMapping("/member/{memberId}")
    fun getByMember(@PathVariable memberId: Long) =
        ResponseEntity.ok(membershipService.getByMemberId(memberId))

    @PostMapping
    fun create(@RequestBody request: MembershipRequest): ResponseEntity<Membership> {
        val member = memberService.getById(request.memberId)
        val membership = Membership(
            member = member,
            tipo = request.tipo,
            disciplina = request.disciplina,
            fechaPago = request.fechaPago,
            fechaVencimiento = request.fechaVencimiento,
            montoPagado = request.montoPagado,
            metodoPago = request.metodoPago,
            clasesTotal = request.clasesTotal,
            clasesRestantes = request.clasesTotal
        )
        return ResponseEntity.ok(membershipService.create(membership))
    }

    @PutMapping("/{id}/descontar-clase")
    fun descontarClase(@PathVariable id: Long) =
        ResponseEntity.ok(membershipService.descontarClase(id))

    @GetMapping("/expired")
    fun getExpired() = ResponseEntity.ok(membershipService.getExpired())

    @GetMapping("/expiring-soon")
    fun getExpiringSoon() = ResponseEntity.ok(membershipService.getExpiringSoon())
}