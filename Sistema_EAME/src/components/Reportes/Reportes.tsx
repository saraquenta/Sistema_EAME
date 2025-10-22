import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, Award, UserX, BarChart3, PieChart, Trophy } from 'lucide-react';
import { useData } from '../../context/DataContext';
import jsPDF from 'jspdf';

const Reportes: React.FC = () => {
  const { cursantes, disciplinas, evaluaciones, meritos, bajas } = useData();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportType, setReportType] = useState('general');

  const generateReport = () => {
    const reportData = {
      periodo: selectedYear,
      fecha_generacion: new Date().toLocaleDateString(),
      cursantes_activos: cursantes.filter(c => c.estado === 'activo' && c.curso_anual === selectedYear).length,
      total_cursantes: cursantes.filter(c => c.curso_anual === selectedYear).length,
      total_bajas: bajas.length,
      total_meritos: meritos.length,
      disciplinas_activas: disciplinas.filter(d => d.activo).length
    };

    return reportData;
  };

  const reportData = generateReport();

  const cursantesDelAno = cursantes.filter(c => c.curso_anual === selectedYear);
  const evaluacionesDelAno = evaluaciones.filter(e => {
    const cursante = cursantes.find(c => c.id === e.cursante_id);
    return cursante?.curso_anual === selectedYear;
  });

  const promedioGeneral = evaluacionesDelAno.length > 0 
    ? evaluacionesDelAno.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesDelAno.length 
    : 0;

  // Estadísticas de méritos por tipo
  const meritosPorTipo = meritos.reduce((acc, merito) => {
    acc[merito.tipo] = (acc[merito.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas de bajas por motivo
  const bajasPorMotivo = bajas.reduce((acc, baja) => {
    acc[baja.motivo] = (acc[baja.motivo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas de evaluaciones por disciplina
  const evaluacionesPorDisciplina = disciplinas.map(disciplina => {
    const evaluacionesDisciplina = evaluacionesDelAno.filter(e => e.disciplina_id === disciplina.id);
    const promedio = evaluacionesDisciplina.length > 0 
      ? evaluacionesDisciplina.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesDisciplina.length 
      : 0;
    
    return {
      nombre: disciplina.nombre,
      evaluaciones: evaluacionesDisciplina.length,
      promedio: promedio
    };
  });

  const rankingCursantes = cursantesDelAno.map(cursante => {
    const evaluacionesCursante = evaluacionesDelAno.filter(e => e.cursante_id === cursante.id);
    const promedio = evaluacionesCursante.length > 0 
      ? evaluacionesCursante.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesCursante.length 
      : 0;
    
    return {
      ...cursante,
      promedio,
      evaluaciones: evaluacionesCursante.length
    };
  }).sort((a, b) => b.promedio - a.promedio);

  // Listado detallado de bajas con información del cursante
  const bajasDetalladas = bajas.map(baja => {
    const cursante = cursantes.find(c => c.id === baja.cursante_id);
    return {
      ...baja,
      cursante_nombre: cursante?.nombre_completo || 'N/A',
      cursante_ci: cursante?.ci || 'N/A',
      cursante_grado: cursante?.grado_militar || 'N/A'
    };
  }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Listado detallado de méritos con información del cursante
  const meritosDetallados = meritos.map(merito => {
    const cursante = cursantes.find(c => c.id === merito.cursante_id);
    return {
      ...merito,
      cursante_nombre: cursante?.nombre_completo || 'N/A',
      cursante_ci: cursante?.ci || 'N/A',
      cursante_grado: cursante?.grado_militar || 'N/A'
    };
  }).sort((a, b) => a.cursante_nombre.localeCompare(b.cursante_nombre));

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    // Configuración de fuentes y colores
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(220, 38, 38); // Color rojo EAME
    
    // Encabezado
    pdf.text('ESCUELA DE ARTES MARCIALES DEL EJÉRCITO', 105, 20, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text('BOLIVIA', 105, 30, { align: 'center' });
    
    // Línea decorativa
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 190, 35);
    
    // Título del reporte
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REPORTE ESTADÍSTICO ANUAL', 105, 50, { align: 'center' });
    
    // Información del período
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Período Académico: ${selectedYear}`, 20, 65);
    pdf.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-BO')}`, 20, 75);
    
    // Resumen estadístico
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(220, 38, 38);
    pdf.text('RESUMEN ESTADÍSTICO GENERAL', 20, 95);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    let yPos = 110;
    const estadisticas = [
      `Total de Cursantes: ${reportData.total_cursantes}`,
      `Cursantes Activos: ${reportData.cursantes_activos}`,
      `Total de Bajas: ${reportData.total_bajas}`,
      `Méritos Otorgados: ${reportData.total_meritos}`,
      `Disciplinas Activas: ${reportData.disciplinas_activas}`,
      `Promedio General: ${promedioGeneral.toFixed(2)} puntos`
    ];
    
    estadisticas.forEach(stat => {
      pdf.text(`• ${stat}`, 25, yPos);
      yPos += 8;
    });

    // Nueva página para ranking de cursantes
    pdf.addPage();
    yPos = 20;
    
    // Título de ranking
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 38);
    pdf.text('RANKING DE CURSANTES POR PROMEDIO', 20, yPos);
    
    yPos += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    
    // Encabezados de tabla
    pdf.text('POS.', 25, yPos);
    pdf.text('CURSANTE', 45, yPos);
    pdf.text('CI', 120, yPos);
    pdf.text('GRADO', 140, yPos);
    pdf.text('PROMEDIO', 170, yPos);
    
    // Línea de separación
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 3, 190, yPos + 3);
    
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    rankingCursantes.forEach((cursante, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Destacar los primeros 3 lugares
      if (index < 3) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      }
      
      pdf.text(`${index + 1}°`, 25, yPos);
      pdf.text(cursante.nombre_completo.substring(0, 25), 45, yPos);
      pdf.text(cursante.ci, 120, yPos);
      pdf.text(cursante.grado_militar, 140, yPos);
      pdf.text(cursante.promedio.toFixed(2), 170, yPos);
      
      yPos += 8;
    });

    // Nueva página para bajas registradas
    pdf.addPage();
    yPos = 20;
    
    // Título de bajas registradas
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 38);
    pdf.text('BAJAS REGISTRADAS', 20, yPos);
    
    yPos += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    bajasDetalladas.forEach((baja, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`• Cursante ${baja.cursante_ci} - ${baja.cursante_nombre}`, 25, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`  Motivo: ${baja.motivo}`, 30, yPos);
      yPos += 6;
      pdf.text(`  Fecha: ${new Date(baja.fecha).toLocaleDateString('es-BO')}`, 30, yPos);
      yPos += 6;
      pdf.text(`  Grado: ${baja.cursante_grado}`, 30, yPos);
      yPos += 10;
    });

    // Nueva página para méritos otorgados
    pdf.addPage();
    yPos = 20;
    
    // Título de méritos otorgados
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 38);
    pdf.text('MÉRITOS OTORGADOS', 20, yPos);
    
    yPos += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    meritosDetallados.forEach((merito, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`• Cursante ${merito.cursante_ci} - ${merito.cursante_nombre}`, 25, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`  Tipo: ${merito.tipo}`, 30, yPos);
      yPos += 6;
      pdf.text(`  Gestión: ${merito.gestion}`, 30, yPos);
      yPos += 6;
      pdf.text(`  Grado: ${merito.cursante_grado}`, 30, yPos);
      yPos += 10;
    });
    
    // Pie de página
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Página ${i} de ${totalPages}`, 105, 290, { align: 'center' });
      pdf.text('Sistema de Evaluación EAME - Confidencial', 105, 295, { align: 'center' });
    }
    
    // Descargar el PDF
    pdf.save(`Reporte_Estadistico_EAME_${selectedYear}.pdf`);
  };

  const colors = ['#dc2626', '#059669', '#7c3aed', '#d97706', '#0891b2', '#be185d'];

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Reportes Estadísticos</h2>
              <p className="text-muted mb-0">Análisis estadístico y reportes de la EAME</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-danger d-flex align-items-center shadow-sm"
              style={{ borderRadius: '25px', padding: '12px 24px' }}
            >
              <Download size={18} className="me-2" />
              <span className="fw-semibold">Descargar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark">
                    <Calendar size={16} className="me-2" />
                    Año del Curso
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="form-select form-select-lg"
                    style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark">
                    <BarChart3 size={16} className="me-2" />
                    Tipo de Reporte
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="form-select form-select-lg"
                    style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                  >
                    <option value="general">Reporte General</option>
                    <option value="evaluaciones">Evaluaciones</option>
                    <option value="meritos">Méritos y Bajas</option>
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="w-100">
                    <div className="bg-danger-subtle p-3 rounded-3 text-center">
                      <h5 className="fw-bold text-danger mb-1">{promedioGeneral.toFixed(1)}</h5>
                      <small className="text-muted">Promedio General</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        {[
          {
            title: 'Total Cursantes',
            value: reportData.total_cursantes,
            icon: Users,
            color: '#dc2626',
            bgColor: '#fef2f2',
            change: '+5%'
          },
          {
            title: 'Cursantes Activos',
            value: reportData.cursantes_activos,
            icon: TrendingUp,
            color: '#059669',
            bgColor: '#f0fdf4',
            change: '+12%'
          },
          {
            title: 'Méritos Otorgados',
            value: reportData.total_meritos,
            icon: Award,
            color: '#d97706',
            bgColor: '#fffbeb',
            change: '+8%'
          },
          {
            title: 'Bajas Registradas',
            value: reportData.total_bajas,
            icon: UserX,
            color: '#7c3aed',
            bgColor: '#faf5ff',
            change: '-3%'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-md-6 col-lg-3 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="p-3 rounded-circle" style={{ backgroundColor: stat.bgColor }}>
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <span className={`badge ${stat.change.startsWith('+') ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">{stat.value}</h3>
                  <p className="text-muted small mb-0">{stat.title}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="progress" style={{ height: '4px', borderRadius: '2px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${Math.min((stat.value / 100) * 100, 100)}%`,
                          backgroundColor: stat.color,
                          borderRadius: '2px'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        {/* Doughnut Chart - Méritos por Tipo */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  <PieChart size={20} className="me-2" />
                  Méritos por Tipo
                </h5>
                <span className="badge bg-warning text-dark">{Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)} Total</span>
              </div>
            </div>
            <div className="card-body">
              {/* Simulated Doughnut Chart */}
              <div className="row">
                <div className="col-md-6">
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    {/* Outer circle */}
                    <div 
                      className="rounded-circle position-absolute"
                      style={{ 
                        width: '160px', 
                        height: '160px',
                        background: `conic-gradient(
                          ${colors[0]} 0deg ${Object.values(meritosPorTipo)[0] ? (Object.values(meritosPorTipo)[0] / Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)) * 360 : 0}deg,
                          ${colors[1]} ${Object.values(meritosPorTipo)[0] ? (Object.values(meritosPorTipo)[0] / Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)) * 360 : 0}deg ${Object.values(meritosPorTipo)[1] ? ((Object.values(meritosPorTipo)[0] + Object.values(meritosPorTipo)[1]) / Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)) * 360 : 0}deg,
                          ${colors[2]} ${Object.values(meritosPorTipo)[1] ? ((Object.values(meritosPorTipo)[0] + Object.values(meritosPorTipo)[1]) / Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)) * 360 : 0}deg 360deg
                        )`
                      }}
                    ></div>
                    {/* Inner circle (hole) */}
                    <div 
                      className="rounded-circle bg-white position-absolute"
                      style={{ width: '80px', height: '80px' }}
                    ></div>
                    <div className="position-absolute text-center">
                      <h4 className="fw-bold text-dark mb-0">{Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)}</h4>
                      <small className="text-muted">Méritos</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 d-flex flex-column justify-content-center">
                    {Object.entries(meritosPorTipo).map(([tipo, cantidad], index) => (
                      <div key={tipo} className="d-flex align-items-center mb-3">
                        <div 
                          className="rounded-circle me-3"
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: colors[index % colors.length] 
                          }}
                        ></div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <span className="small fw-semibold text-dark">{tipo}</span>
                            <span className="small text-muted">{cantidad}</span>
                          </div>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${(cantidad / Object.values(meritosPorTipo).reduce((a, b) => a + b, 0)) * 100}%`,
                                backgroundColor: colors[index % colors.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart - Evaluaciones por Disciplina */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  <BarChart3 size={20} className="me-2" />
                  Evaluaciones por Disciplina
                </h5>
                <span className="badge bg-info text-white">{evaluacionesDelAno.length} Total</span>
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: '250px', position: 'relative' }}>
                {/* Y-axis labels */}
                <div className="position-absolute" style={{ left: '0', top: '0', height: '100%', width: '30px' }}>
                  {[100, 80, 60, 40, 20, 0].map((value, index) => (
                    <div 
                      key={value}
                      className="position-absolute small text-muted"
                      style={{ 
                        top: `${(index / 5) * 100}%`, 
                        transform: 'translateY(-50%)',
                        fontSize: '10px'
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
                
                {/* Chart area */}
                <div className="position-absolute" style={{ left: '35px', right: '0', top: '0', bottom: '30px' }}>
                  <div className="d-flex align-items-end justify-content-around h-100">
                    {evaluacionesPorDisciplina.slice(0, 6).map((disciplina, index) => (
                      <div key={disciplina.nombre} className="d-flex flex-column align-items-center">
                        <div 
                          className="rounded-top"
                          style={{ 
                            width: '30px',
                            height: `${(disciplina.promedio / 100) * 100}%`,
                            backgroundColor: colors[index % colors.length],
                            minHeight: '5px',
                            marginBottom: '5px'
                          }}
                          title={`${disciplina.nombre}: ${disciplina.promedio.toFixed(1)}`}
                        ></div>
                        <small 
                          className="text-muted text-center"
                          style={{ 
                            fontSize: '9px', 
                            transform: 'rotate(-45deg)',
                            transformOrigin: 'center',
                            width: '60px',
                            marginTop: '10px'
                          }}
                        >
                          {disciplina.nombre.substring(0, 8)}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  <Trophy size={20} className="me-2 text-warning" />
                  Ranking de Cursantes por Promedio (Mayor a Menor)
                </h5>
                <span className="badge bg-primary text-white">{rankingCursantes.length} Cursantes</span>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">POSICIÓN</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">CURSANTE</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">CI</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">GRADO MILITAR</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">EVALUACIONES</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">PROMEDIO</th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold small">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingCursantes.map((cursante, index) => (
                      <tr key={cursante.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <span 
                              className={`badge rounded-pill px-3 py-2 fw-bold ${
                                index === 0 ? 'bg-warning text-dark' : 
                                index === 1 ? 'bg-secondary text-white' : 
                                index === 2 ? 'bg-warning text-dark' : 
                                'bg-light text-dark'
                              }`}
                              style={{ fontSize: '14px' }}
                            >
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '40px', 
                                height: '40px', 
                                backgroundColor: index < 3 ? '#d97706' : '#dc2626',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              {cursante.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{cursante.nombre_completo}</div>
                              <div className="text-muted small">
                                Ingreso: {new Date(cursante.fecha_ingreso).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="fw-semibold text-dark">{cursante.ci}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-secondary text-white px-2 py-1" style={{ borderRadius: '6px' }}>
                            {cursante.grado_militar}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="fw-semibold text-dark">{cursante.evaluaciones}</span>
                          <div className="text-muted small">evaluaciones</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <span 
                              className={`fw-bold fs-5 me-2 ${
                                cursante.promedio >= 90 ? 'text-success' :
                                cursante.promedio >= 80 ? 'text-info' :
                                cursante.promedio >= 70 ? 'text-warning' :
                                cursante.promedio >= 60 ? 'text-orange' :
                                'text-danger'
                              }`}
                            >
                              {cursante.promedio.toFixed(2)}
                            </span>
                            <div className="flex-grow-1">
                              <div className="progress" style={{ height: '6px', width: '60px' }}>
                                <div 
                                  className={`progress-bar ${
                                    cursante.promedio >= 90 ? 'bg-success' :
                                    cursante.promedio >= 80 ? 'bg-info' :
                                    cursante.promedio >= 70 ? 'bg-warning' :
                                    cursante.promedio >= 60 ? 'bg-orange' :
                                    'bg-danger'
                                  }`}
                                  style={{ width: `${cursante.promedio}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge px-2 py-1 ${
                            cursante.estado === 'activo' ? 'bg-success text-white' :
                            cursante.estado === 'baja' ? 'bg-danger text-white' :
                            'bg-warning text-dark'
                          }`} style={{ borderRadius: '6px' }}>
                            {cursante.estado.charAt(0).toUpperCase() + cursante.estado.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Lists Row */}
      <div className="row">
        {/* Bajas Registradas */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-danger mb-0">
                  <UserX size={20} className="me-2" />
                  BAJAS REGISTRADAS
                </h5>
                <span className="badge bg-danger text-white">{bajasDetalladas.length} Total</span>
              </div>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {bajasDetalladas.length > 0 ? (
                <div className="list-group list-group-flush">
                  {bajasDetalladas.map((baja, index) => (
                    <div key={baja.id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-start">
                        <div 
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            backgroundColor: '#dc2626',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark mb-1">
                            • Cursante {baja.cursante_ci} - {baja.cursante_nombre}
                          </h6>
                          <p className="text-muted small mb-1">
                            <strong>Motivo:</strong> {baja.motivo}
                          </p>
                          <p className="text-muted small mb-1">
                            <strong>Fecha:</strong> {new Date(baja.fecha).toLocaleDateString('es-BO')}
                          </p>
                          <p className="text-muted small mb-0">
                            <strong>Grado:</strong> {baja.cursante_grado}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <UserX size={48} className="text-muted mb-3" />
                  <p className="text-muted">No se registraron bajas en este período</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Méritos Otorgados */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-warning mb-0">
                  <Award size={20} className="me-2" />
                  MÉRITOS OTORGADOS
                </h5>
                <span className="badge bg-warning text-dark">{meritosDetallados.length} Total</span>
              </div>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {meritosDetallados.length > 0 ? (
                <div className="list-group list-group-flush">
                  {meritosDetallados.map((merito, index) => (
                    <div key={merito.id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-start">
                        <div 
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            backgroundColor: '#d97706',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark mb-1">
                            • Cursante {merito.cursante_ci} - {merito.cursante_nombre}
                          </h6>
                          <p className="text-muted small mb-1">
                            <strong>Tipo:</strong> {merito.tipo}
                          </p>
                          <p className="text-muted small mb-1">
                            <strong>Gestión:</strong> {merito.gestion}
                          </p>
                          <p className="text-muted small mb-0">
                            <strong>Grado:</strong> {merito.cursante_grado}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award size={48} className="text-muted mb-3" />
                  <p className="text-muted">No se otorgaron méritos en este período</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;