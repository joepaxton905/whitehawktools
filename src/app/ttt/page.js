"use client";

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Simple SVG barcode-like strips with >=2px bar widths
const VerticalBars = ({ width = 16, height = 180, bar = 2, gap = 1 }) => {
  const bars = [];
  let y = 0;
  let flip = true;
  while (y < height) {
    const h = flip ? bar : bar + 1;
    bars.push(<rect key={y} x="0" y={y} width={width} height={h} fill="#000" />);
    y += h + gap;
    flip = !flip;
  }
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <rect width={width} height={height} fill="#fff" />
      {bars}
    </svg>
  );
};

const HorizontalBars = ({ width = 90, height = 16, bar = 2, gap = 1 }) => {
  const bars = [];
  let x = 0;
  let flip = true;
  while (x < width) {
    const w = flip ? bar : bar + 1;
    bars.push(<rect key={x} x={x} y="0" width={w} height={height} fill="#000" />);
    x += w + gap;
    flip = !flip;
  }
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <rect width={width} height={height} fill="#fff" />
      {bars}
    </svg>
  );
};

// Multi-line, rotated SVG warning with automatic wrapping (no glyph stretching)
const RightWarningSVG = ({
  width = 48,        // wider strip for readability
  height = 200,      // strip height matches ticket height
  padding = 6,       // inner padding
  fontSize = 8,      // readable size after rasterization
  lineGap = 1        // extra space between lines
}) => {
  const message =
    'BOARDING GATES CLOSE 15 MINUTES BEFORE DEPARTURE TIME. PASSENGERS MAY NOT BE ACCEPTED FOR TRAVEL AFTER GATES CLOSE.';

  // After rotation: x-axis spans original "height", y-axis spans original "width"
  const innerW = Math.max(1, height - padding * 2); // horizontal space for each line
  const innerH = Math.max(1, width - padding * 2);  // vertical stack space for all lines
  const lineHeight = fontSize + lineGap;

  // Rough width per character in Arial (uppercase-heavy), tweakable
  const approxCharWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.max(10, Math.floor(innerW / approxCharWidth));
  const maxLines = Math.max(1, Math.floor(innerH / lineHeight));

  // Greedy word wrap by character budget
  const wrapWords = (text, maxChars) => {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (const w of words) {
      const next = current ? current + ' ' + w : w;
      if (next.length <= maxChars) current = next;
      else {
        if (current) lines.push(current);
        // If a single word is longer than maxChars, hard-split it
        if (w.length > maxChars) {
          let i = 0;
          while (i < w.length) {
            lines.push(w.slice(i, i + maxChars));
            i += maxChars;
          }
          current = '';
        } else {
          current = w;
        }
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  let lines = wrapWords(message, maxCharsPerLine);
  if (lines.length > maxLines) lines = lines.slice(0, maxLines);

  // Center the block along the narrow (y) dimension; center each line along x
  const blockHeight = lines.length * lineHeight;
  const startY = (width / 2) - (blockHeight / 2) + fontSize * 0.8; // baseline tweak
  const centerX = height / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
      shapeRendering="crispEdges"
      textRendering="geometricPrecision"
      aria-hidden="true"
      role="img"
    >
      <rect x="0" y="0" width={width} height={height} fill="#d32f2f" />
      {/* rotate -90deg, then draw tspans centered */}
      <g transform={`translate(0, ${height}) rotate(-90)`}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={centerX}
            y={startY + i * lineHeight}
            fill="#fff"
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fontSize={fontSize}
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.2px"
          >
            <tspan>{line}</tspan>
          </text>
        ))}
      </g>
    </svg>
  );
};

const Ticket = () => {
  const ticketRef = useRef(null);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      const node = ticketRef.current;

      // High-resolution rasterization for crisp text/bars
      const canvas = await html2canvas(node, {
        scale: 4,                 // a bit higher for tiny vertical text
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: node.offsetWidth,
        height: node.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: node.offsetWidth,
        windowHeight: node.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      // No compression to avoid washing out fine lines
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight, undefined, 'NONE');
      pdf.save('flight-ticket.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px'
    }}>
      <button
        onClick={downloadPDF}
        style={{
          marginBottom: '20px',
          padding: '12px 24px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0052a3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0066cc')}
      >
        Download PDF
      </button>

      <div
        ref={ticketRef}
        style={{
          width: '600px',
          height: '200px',
          backgroundColor: 'white',
          border: '2px solid #ddd',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Left side - main ticket */}
        <div style={{
          flex: '3',
          padding: '20px',
          borderRight: '2px dashed #ccc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* SVG barcode strip on the left */}
          <div style={{
            position: 'absolute',
            left: '5px',
            top: '10px',
            bottom: '10px',
            width: '16px',
            display: 'flex',
            alignItems: 'stretch'
          }}>
            <VerticalBars width={16} height={180} bar={2} gap={1} />
          </div>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            marginLeft: '25px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
              AMERICAN AIRLINES
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              FLIGHT TICKET
            </div>
          </div>

          {/* Passenger and Route */}
          <div style={{ marginBottom: '15px', marginLeft: '25px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
              JOHN SMITH
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold' }}>JFK</span>
              <span style={{ margin: '0 10px', color: '#666' }}>→</span>
              <span style={{ fontWeight: 'bold' }}>LAX</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              NEW YORK → LOS ANGELES
            </div>
          </div>

          {/* Flight Details */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginLeft: '25px'
          }}>
            <div>
              <div style={{ color: '#666' }}>FLIGHT</div>
              <div style={{ fontWeight: 'bold' }}>AA 1234</div>
            </div>
            <div>
              <div style={{ color: '#666' }}>DATE</div>
              <div style={{ fontWeight: 'bold' }}>15 MAR 2024</div>
            </div>
            <div>
              <div style={{ color: '#666' }}>TIME</div>
              <div style={{ fontWeight: 'bold' }}>14:30</div>
            </div>
            <div>
              <div style={{ color: '#666' }}>SEAT</div>
              <div style={{ fontWeight: 'bold' }}>12A</div>
            </div>
          </div>
        </div>

        {/* Right side - stub */}
        <div style={{
          flex: '1',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          position: 'relative'
        }}>
          <div style={{
            flex: '1',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '8px', color: '#666', textAlign: 'center', marginBottom: '5px' }}>
              BOARDING PASS
            </div>

            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '3px' }}>
                JOHN SMITH
              </div>
              <div style={{ fontSize: '8px', color: '#666', marginBottom: '3px' }}>
                JFK → LAX
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>
                AA 1234
              </div>
              <div style={{ fontSize: '8px', color: '#666', marginBottom: '3px' }}>
                15 MAR
              </div>
              <div style={{ fontSize: '9px', fontWeight: 'bold' }}>
                12A
              </div>
            </div>

            {/* SVG horizontal bars */}
            <HorizontalBars width={90} height={16} bar={2} gap={1} />
          </div>

          {/* Vertical warning at the right edge (SVG with multi-line text, no squashing) */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '48px', // match RightWarningSVG width
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}>
            <RightWarningSVG width={48} height={200} padding={6} fontSize={8} lineGap={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
