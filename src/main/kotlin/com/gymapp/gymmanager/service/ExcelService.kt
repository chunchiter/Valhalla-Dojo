package com.gymapp.gymmanager.service

import com.gymapp.gymmanager.repository.MemberRepository
import com.gymapp.gymmanager.repository.MembershipRepository
import org.apache.poi.ss.usermodel.*
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.time.LocalDate

@Service
class ExcelService(
    private val memberRepository: MemberRepository,
    private val membershipRepository: MembershipRepository
) {

    fun generateMembersReport(): ByteArray {
        val workbook = XSSFWorkbook()
        val sheet = workbook.createSheet("Miembros")

        // Estilo encabezado
        val headerStyle = workbook.createCellStyle().apply {
            fillForegroundColor = IndexedColors.DARK_BLUE.index
            fillPattern = FillPatternType.SOLID_FOREGROUND
            val font = workbook.createFont()
            font.bold = true
            font.color = IndexedColors.WHITE.index
            setFont(font)
        }

        // Estilos de estado
        val redStyle = workbook.createCellStyle().apply {
            fillForegroundColor = IndexedColors.RED.index
            fillPattern = FillPatternType.SOLID_FOREGROUND
        }
        val yellowStyle = workbook.createCellStyle().apply {
            fillForegroundColor = IndexedColors.YELLOW.index
            fillPattern = FillPatternType.SOLID_FOREGROUND
        }
        val greenStyle = workbook.createCellStyle().apply {
            fillForegroundColor = IndexedColors.BRIGHT_GREEN.index
            fillPattern = FillPatternType.SOLID_FOREGROUND
        }

        // Encabezados
        val headers = listOf("ID", "Nombre", "Teléfono", "Email", "Último Pago", "Vencimiento", "Monto", "Estado")
        val headerRow = sheet.createRow(0)
        headers.forEachIndexed { i, title ->
            headerRow.createCell(i).apply {
                setCellValue(title)
                cellStyle = headerStyle
            }
        }

        // Datos
        val members = memberRepository.findAll()
        val today = LocalDate.now()

        members.forEachIndexed { index, member ->
            val row = sheet.createRow(index + 1)
            val lastMembership = membershipRepository
                .findByMemberId(member.id!!)
                .maxByOrNull { it.fechaVencimiento }

            val vencimiento = lastMembership?.fechaVencimiento
            val estado = when {
                vencimiento == null -> "Sin membresía"
                vencimiento.isBefore(today) -> "VENCIDO"
                vencimiento.isBefore(today.plusDays(5)) -> "POR VENCER"
                else -> "AL DÍA"
            }

            val rowStyle = when (estado) {
                "VENCIDO" -> redStyle
                "POR VENCER" -> yellowStyle
                "AL DÍA" -> greenStyle
                else -> null
            }

            row.createCell(0).setCellValue(member.id!!.toDouble())
            row.createCell(1).setCellValue(member.nombre)
            row.createCell(2).setCellValue(member.telefono)
            row.createCell(3).setCellValue(member.email)
            row.createCell(4).setCellValue(lastMembership?.fechaPago?.toString() ?: "N/A")
            row.createCell(5).setCellValue(vencimiento?.toString() ?: "N/A")
            row.createCell(6).setCellValue(lastMembership?.montoPagado?.toDouble() ?: 0.0)
            row.createCell(7).setCellValue(estado)

            if (rowStyle != null) {
                (0..7).forEach { row.getCell(it)?.cellStyle = rowStyle }
            }
        }

        // Autoajustar columnas
        (0..7).forEach { sheet.autoSizeColumn(it) }

        val out = ByteArrayOutputStream()
        workbook.write(out)
        workbook.close()
        return out.toByteArray()
    }
}