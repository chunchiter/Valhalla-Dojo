package com.gymapp.gymmanager.controller

import com.gymapp.gymmanager.service.ExcelService
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reports")
class ReportController(private val excelService: ExcelService) {

    @GetMapping("/members")
    fun downloadMembersReport(): ResponseEntity<ByteArray> {
        val excel = excelService.generateMembersReport()
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=miembros.xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel)
    }
}