import jsPDF from 'jspdf'

interface Feedback {
  id: string
  callId: string
  citizenMobile: string
  citizenName: string
  satisfaction: string
  description: string
  submittedBy: string
  submittedAt: string
  status: string
  queryType: string
  department: string
}

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export const exportFeedbackToPDF = (
  feedbacks: Feedback[],
  department: string = 'All Departments',
  title: string = 'Feedback Report'
) => {
  try {
    const doc = new jsPDF()

    // Set up the document
    const pageWidth = doc.internal.pageSize.width

    // Remove Hindi text header - start with English content directly
    doc.setFont('helvetica')
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(title, pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Department: ${department}`, pageWidth / 2, 30, { align: 'center' })
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, 40, { align: 'center' })

    // Summary statistics
    const totalFeedbacks = feedbacks.length
    const resolvedCount = feedbacks.filter(f => f.status === 'resolved').length
    const pendingCount = feedbacks.filter(f => f.status === 'pending').length
    const satisfiedCount = feedbacks.filter(f => f.satisfaction === 'satisfied').length

    doc.setFontSize(10)
    doc.text(`Total Feedbacks: ${totalFeedbacks}`, 20, 55)
    doc.text(`Resolved: ${resolvedCount}`, 20, 65)
    doc.text(`Pending: ${pendingCount}`, 80, 65)
    doc.text(`Satisfied: ${satisfiedCount}`, 140, 65)

    // Simple table without autoTable
    let yPosition = 85
    const lineHeight = 8

    // Table headers
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('S.No', 10, yPosition)
    doc.text('Call ID', 25, yPosition)
    doc.text('Citizen', 45, yPosition)
    doc.text('Mobile', 70, yPosition)
    doc.text('Query', 90, yPosition)
    doc.text('Department', 120, yPosition)
    doc.text('Status', 150, yPosition)
    doc.text('Date', 170, yPosition)

    yPosition += lineHeight
    doc.setFont('helvetica', 'normal')

    // Table data
    feedbacks.forEach((feedback, index) => {
      if (yPosition > 270) { // Start new page if needed
        doc.addPage()
        yPosition = 20

        // Repeat headers on new page
        doc.setFont('helvetica', 'bold')
        doc.text('S.No', 10, yPosition)
        doc.text('Call ID', 25, yPosition)
        doc.text('Citizen', 45, yPosition)
        doc.text('Mobile', 70, yPosition)
        doc.text('Query', 90, yPosition)
        doc.text('Department', 120, yPosition)
        doc.text('Status', 150, yPosition)
        doc.text('Date', 170, yPosition)
        yPosition += lineHeight
        doc.setFont('helvetica', 'normal')
      }

      doc.text((index + 1).toString(), 10, yPosition)
      doc.text((feedback.callId || '').substring(0, 8), 25, yPosition)
      doc.text((feedback.citizenName || '').substring(0, 12), 45, yPosition)
      doc.text(feedback.citizenMobile || '', 70, yPosition)
      doc.text((feedback.queryType || '').substring(0, 12), 90, yPosition)
      doc.text((feedback.department || 'N/A').substring(0, 15), 120, yPosition)
      doc.text(feedback.status || '', 150, yPosition)
      doc.text(feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleDateString('en-IN') : '', 170, yPosition)

      yPosition += lineHeight
    })

    // Save the PDF
    const fileName = `feedback_report_${department.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
    return false
  }
}

export const exportDepartmentSummary = (feedbacks: Feedback[]) => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    // Remove Hindi text header - start with English content directly
    doc.setFont('helvetica')
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Department-wise Summary Report', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, 35, { align: 'center' })

    // Group feedbacks by department
    const departmentGroups: { [key: string]: Feedback[] } = {}
    feedbacks.forEach(feedback => {
      const dept = feedback.department || 'Unassigned'
      if (!departmentGroups[dept]) {
        departmentGroups[dept] = []
      }
      departmentGroups[dept].push(feedback)
    })

    // Create summary table
    let yPosition = 65
    const lineHeight = 12

    // Table headers
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Department', 20, yPosition)
    doc.text('Total', 80, yPosition)
    doc.text('Resolved', 110, yPosition)
    doc.text('Pending', 140, yPosition)
    doc.text('Satisfied', 170, yPosition)

    yPosition += lineHeight
    doc.line(15, yPosition - 5, 195, yPosition - 5) // Header line

    doc.setFont('helvetica', 'normal')

    // Table data
    Object.entries(departmentGroups).forEach(([dept, deptFeedbacks]) => {
      const total = deptFeedbacks.length
      const resolved = deptFeedbacks.filter(f => f.status === 'resolved').length
      const pending = deptFeedbacks.filter(f => f.status === 'pending').length
      const satisfied = deptFeedbacks.filter(f => f.satisfaction === 'satisfied').length
      const satisfactionRate = total > 0 ? ((satisfied / total) * 100).toFixed(1) : '0'

      doc.text(dept.substring(0, 25), 20, yPosition)
      doc.text(total.toString(), 80, yPosition)
      doc.text(resolved.toString(), 110, yPosition)
      doc.text(pending.toString(), 140, yPosition)
      doc.text(`${satisfied} (${satisfactionRate}%)`, 170, yPosition)

      yPosition += lineHeight
    })

    // Save the PDF
    const fileName = `department_summary_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error('Error generating summary PDF:', error)
    alert('Error generating summary PDF. Please try again.')
    return false
  }
}
