import jsPDF from 'jspdf'
// import * as XLSX from 'xlsx' // Temporarily commented out

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

export interface ExportFilters {
  department: string
  satisfactionOption: string
  dateRange: string
  startDate?: string
  endDate?: string
}

export const formatSatisfactionOption = (satisfaction: string) => {
  switch (satisfaction) {
    case 'satisfied': return 'Satisfied'
    case 'not-satisfied': return 'Not Satisfied'
    case 'mobile-missing': return 'Mobile Missing'
    case 'number-incorrect': return 'Number Incorrect'
    case 'call-not-picked': return 'Call Not Picked'
    case 'person-not-exist': return 'Person Doesn\'t Exist'
    default: return satisfaction || 'N/A'
  }
}

export const getDateRange = (range: string) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    case 'last7days':
      return {
        start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    case 'last30days':
      return {
        start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    case 'last6months':
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    case 'alltime':
    default:
      return null
  }
}

export const filterFeedbacks = (feedbacks: Feedback[], filters: ExportFilters): Feedback[] => {
  let filtered = [...feedbacks]

  // Filter by department
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter(feedback => feedback.department === filters.department)
  }

  // Filter by satisfaction option
  if (filters.satisfactionOption && filters.satisfactionOption !== 'all') {
    if (filters.satisfactionOption === 'satisfied') {
      filtered = filtered.filter(feedback => feedback.satisfaction === 'satisfied')
    } else if (filters.satisfactionOption === 'not-satisfied') {
      filtered = filtered.filter(feedback => feedback.satisfaction === 'not-satisfied')
    } else if (filters.satisfactionOption === 'other-issues') {
      filtered = filtered.filter(feedback => 
        ['mobile-missing', 'number-incorrect', 'call-not-picked', 'person-not-exist'].includes(feedback.satisfaction)
      )
    } else {
      // Specific satisfaction option
      filtered = filtered.filter(feedback => feedback.satisfaction === filters.satisfactionOption)
    }
  }

  // Filter by date range
  const dateRange = getDateRange(filters.dateRange)
  if (dateRange) {
    filtered = filtered.filter(feedback => {
      const feedbackDate = new Date(feedback.submittedAt)
      return feedbackDate >= dateRange.start && feedbackDate <= dateRange.end
    })
  }

  return filtered
}

export const exportToPDF = (
  feedbacks: Feedback[],
  filters: ExportFilters,
  title: string = 'Feedback Report'
) => {
  try {
    const filteredFeedbacks = filterFeedbacks(feedbacks, filters)
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    // Header
    doc.setFont('helvetica')
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text(title, pageWidth / 2, 20, { align: 'center' })

    // Filter information
    doc.setFontSize(10)
    let yPos = 35
    doc.text(`Department: ${filters.department === 'all' ? 'All Departments' : filters.department}`, 20, yPos)
    yPos += 5
    doc.text(`Satisfaction Filter: ${filters.satisfactionOption === 'all' ? 'All Options' : formatSatisfactionOption(filters.satisfactionOption)}`, 20, yPos)
    yPos += 5
    doc.text(`Date Range: ${filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1).replace(/([A-Z])/g, ' $1')}`, 20, yPos)
    yPos += 5
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 20, yPos)
    yPos += 5
    doc.text(`Total Records: ${filteredFeedbacks.length}`, 20, yPos)

    // Statistics
    yPos += 10
    const stats = {
      satisfied: filteredFeedbacks.filter(f => f.satisfaction === 'satisfied').length,
      notSatisfied: filteredFeedbacks.filter(f => f.satisfaction === 'not-satisfied').length,
      resolved: filteredFeedbacks.filter(f => f.status === 'resolved').length,
      pending: filteredFeedbacks.filter(f => f.status === 'pending').length,
    }

    doc.text(`Statistics: Satisfied: ${stats.satisfied} | Not Satisfied: ${stats.notSatisfied} | Resolved: ${stats.resolved} | Pending: ${stats.pending}`, 20, yPos)

    // Table
    yPos += 15
    const lineHeight = 8

    // Table headers
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('S.No', 8, yPos)
    doc.text('Call ID', 20, yPos)
    doc.text('Citizen', 35, yPos)
    doc.text('Mobile', 55, yPos)
    doc.text('Query', 75, yPos)
    doc.text('Department', 95, yPos)
    doc.text('Selected Option', 120, yPos)
    doc.text('Status', 150, yPos)
    doc.text('Date', 170, yPos)
    doc.text('Executive', 185, yPos)

    yPos += lineHeight
    doc.setFont('helvetica', 'normal')

    // Table data
    filteredFeedbacks.forEach((feedback, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20

        // Repeat headers on new page
        doc.setFont('helvetica', 'bold')
        doc.text('S.No', 8, yPos)
        doc.text('Call ID', 20, yPos)
        doc.text('Citizen', 35, yPos)
        doc.text('Mobile', 55, yPos)
        doc.text('Query', 75, yPos)
        doc.text('Department', 95, yPos)
        doc.text('Selected Option', 120, yPos)
        doc.text('Status', 150, yPos)
        doc.text('Date', 170, yPos)
        doc.text('Executive', 185, yPos)
        yPos += lineHeight
        doc.setFont('helvetica', 'normal')
      }

      doc.text((index + 1).toString(), 8, yPos)
      doc.text((feedback.callId || '').substring(0, 6), 20, yPos)
      doc.text((feedback.citizenName || '').substring(0, 10), 35, yPos)
      doc.text(feedback.citizenMobile || '', 55, yPos)
      doc.text((feedback.queryType || '').substring(0, 10), 75, yPos)
      doc.text((feedback.department || 'N/A').substring(0, 12), 95, yPos)
      doc.text(formatSatisfactionOption(feedback.satisfaction).substring(0, 15), 120, yPos)
      doc.text(feedback.status || '', 150, yPos)
      doc.text(feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleDateString('en-IN') : '', 170, yPos)
      doc.text((feedback.submittedBy || '').substring(0, 8), 185, yPos)

      yPos += lineHeight
    })

    // Generate filename
    const filterSuffix = filters.department !== 'all' ? `_${filters.department.replace(/\s+/g, '_')}` : ''
    const dateSuffix = `_${filters.dateRange}`
    const satisfactionSuffix = filters.satisfactionOption !== 'all' ? `_${filters.satisfactionOption}` : ''
    const fileName = `feedback_report${filterSuffix}${dateSuffix}${satisfactionSuffix}_${new Date().toISOString().split('T')[0]}.pdf`
    
    doc.save(fileName)
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    return false
  }
}

export const exportToExcel = (
  feedbacks: Feedback[],
  filters: ExportFilters,
  title: string = 'Feedback Report'
) => {
  try {
    // Temporarily show alert until xlsx is properly installed
    alert('Excel export functionality will be available soon. Please use PDF export for now.')
    return false
    
    /* TODO: Uncomment when xlsx is installed
    const filteredFeedbacks = filterFeedbacks(feedbacks, filters)
    
    // Prepare data for Excel
    const excelData = filteredFeedbacks.map((feedback, index) => ({
      'S.No': index + 1,
      'Call ID': feedback.callId || '',
      'Citizen Name': feedback.citizenName || '',
      'Mobile Number': feedback.citizenMobile || '',
      'Query Type': feedback.queryType || '',
      'Department': feedback.department || 'N/A',
      'Selected Option': formatSatisfactionOption(feedback.satisfaction),
      'Status': feedback.status || '',
      'Submitted Date': feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleDateString('en-IN') : '',
      'Submitted Time': feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleTimeString('en-IN') : '',
      'Submitted By': feedback.submittedBy || '',
      'Description': feedback.description || ''
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Create main data sheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Set column widths
    const columnWidths = [
      { wch: 8 },   // S.No
      { wch: 15 },  // Call ID
      { wch: 20 },  // Citizen Name
      { wch: 15 },  // Mobile Number
      { wch: 20 },  // Query Type
      { wch: 20 },  // Department
      { wch: 20 },  // Selected Option
      { wch: 12 },  // Status
      { wch: 15 },  // Submitted Date
      { wch: 15 },  // Submitted Time
      { wch: 15 },  // Submitted By
      { wch: 40 }   // Description
    ]
    ws['!cols'] = columnWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Feedback Data')

    // Create summary sheet
    const stats = {
      'Total Records': filteredFeedbacks.length,
      'Satisfied': filteredFeedbacks.filter(f => f.satisfaction === 'satisfied').length,
      'Not Satisfied': filteredFeedbacks.filter(f => f.satisfaction === 'not-satisfied').length,
      'Mobile Missing': filteredFeedbacks.filter(f => f.satisfaction === 'mobile-missing').length,
      'Number Incorrect': filteredFeedbacks.filter(f => f.satisfaction === 'number-incorrect').length,
      'Call Not Picked': filteredFeedbacks.filter(f => f.satisfaction === 'call-not-picked').length,
      'Person Doesn\'t Exist': filteredFeedbacks.filter(f => f.satisfaction === 'person-not-exist').length,
      'Resolved': filteredFeedbacks.filter(f => f.status === 'resolved').length,
      'Pending': filteredFeedbacks.filter(f => f.status === 'pending').length,
    }

    const summaryData = [
      { 'Filter': 'Department', 'Value': filters.department === 'all' ? 'All Departments' : filters.department },
      { 'Filter': 'Satisfaction Option', 'Value': filters.satisfactionOption === 'all' ? 'All Options' : formatSatisfactionOption(filters.satisfactionOption) },
      { 'Filter': 'Date Range', 'Value': filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1).replace(/([A-Z])/g, ' $1') },
      { 'Filter': 'Generated On', 'Value': new Date().toLocaleDateString('en-IN') + ' at ' + new Date().toLocaleTimeString('en-IN') },
      ...Object.entries(stats).map(([key, value]) => ({ 'Filter': key, 'Value': value }))
    ]

    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

    // Generate filename
    const filterSuffix = filters.department !== 'all' ? `_${filters.department.replace(/\s+/g, '_')}` : ''
    const dateSuffix = `_${filters.dateRange}`
    const satisfactionSuffix = filters.satisfactionOption !== 'all' ? `_${filters.satisfactionOption}` : ''
    const fileName = `feedback_report${filterSuffix}${dateSuffix}${satisfactionSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`
    
    XLSX.writeFile(wb, fileName)
    return true
    */
  } catch (error) {
    console.error('Error generating Excel:', error)
    return false
  }
}
