"use client";

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import styles from './page.module.css';

export default function BoardingPass() {
  // Default state matching the sample provided
  const [ticketData, setTicketData] = useState({
    fullName: "CHRIS O'BRYAN",
    originAirport: "JFK NEW YORK",
    destinationAirport: "DUB IRELAND",
    airline: "American Airlines",
    flightNumber: "AA 208",
    flightDateISO: "2025-04-23",
    terminal: "8",
    gate: "32",
    boardingTime: "330P",
    group: "4",
    seat: "52B",
    sequence: "SEQ 52B",
    recordLocator: "37QNSC2A",
    class: "ECONOMY"
  });

  const cardRef = useRef(null);

  // Utility to format date from ISO to ticket format
  const formatDateToTicket = (dateISO) => {
    const date = new Date(dateISO);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase().replace(',', '');
  };

  // Create a pseudo-barcode from record locator
  const makePseudoBarcode = (seedString) => {
    // Simple deterministic bar generation based on record locator
    return seedString.split('').map((char, index) => ({
      width: 2 + (char.charCodeAt(0) % 5),
      height: 20 + (index * 3)
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PDF Export functionality
  const handleDownloadPDF = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`boarding-pass-${ticketData.flightNumber}-${ticketData.seat}.pdf`);
      });
    }
  };

  return (
    <div className={`${styles.container} ${styles.printHidden}`}>
      <div className={styles.pageGrid}>
        {/* Form Column */}
        <div className={styles.formColumn}>
          <h1>Boarding Pass Generator</h1>

          {Object.keys(ticketData).map((key) => (
            <div key={key} className={styles.formGroup}>
              <label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type={key.includes('Date') ? 'date' : 'text'}
                id={key}
                name={key}
                value={ticketData[key]}
                onChange={handleInputChange}
                aria-describedby={`${key}-description`}
              />
            </div>
          ))}

          <div className={styles.actionButtons}>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <button onClick={() => window.print()}>Print</button>
          </div>
        </div>

        {/* Preview Column */}
        <div className={styles.previewColumn}>
          <div ref={cardRef} className={styles.boardingPass}>
            <div className={styles.header}>
              <div className={styles.airlineLogo}></div>
              <div className={styles.headerText}>
                <span>{ticketData.airline.toUpperCase()}</span>
                <span>BOARDING PASS</span>
              </div>
            </div>

            <div className={styles.passengerInfo}>
              <div className={styles.passengerName}>{ticketData.fullName}</div>
              <div className={styles.routeInfo}>
                <div>{ticketData.originAirport}</div>
                <div>{ticketData.destinationAirport}</div>
              </div>
            </div>

            <div className={styles.flightDetails}>
              <div className={styles.detailGrid}>
                <div>
                  <label>FLIGHT</label>
                  <div>{ticketData.flightNumber}</div>
                </div>
                <div>
                  <label>DATE</label>
                  <div>{formatDateToTicket(ticketData.flightDateISO)}</div>
                </div>
                <div>
                  <label>TERMINAL</label>
                  <div>{ticketData.terminal}</div>
                </div>
                <div className={styles.gateCircle}>
                  <label>GATE</label>
                  <div>{ticketData.gate}</div>
                </div>
                <div>
                  <label>BOARDING</label>
                  <div>{ticketData.boardingTime}</div>
                </div>
                <div>
                  <label>GROUP</label>
                  <div>{ticketData.group}</div>
                </div>
                <div>
                  <label>SEAT</label>
                  <div>{ticketData.seat}</div>
                </div>
              </div>
            </div>

            <div className={styles.additionalInfo}>
              <div>{ticketData.sequence}</div>
              <div>{ticketData.class}</div>
            </div>

            <div className={styles.barcodeArea}>
              {makePseudoBarcode(ticketData.recordLocator).map((bar, index) => (
                <div
                  key={index}
                  style={{
                    width: `${bar.width}px`,
                    height: `${bar.height}px`,
                    backgroundColor: 'black',
                    margin: '0 1px'
                  }}
                />
              ))}
            </div>

            <div className={styles.footer}>
              <small>GATES CLOSE 15 MINUTES BEFORE DEPARTURE</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
