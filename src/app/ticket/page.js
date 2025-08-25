"use client";

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Ticket = () => {
    const ticketRef = useRef(null);

    const downloadPDF = async () => {
        if (ticketRef.current) {
            try {
                // Create canvas with higher quality settings
                const canvas = await html2canvas(ticketRef.current, {
                    scale: 3, // Higher scale for better quality
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: ticketRef.current.offsetWidth,
                    height: ticketRef.current.offsetHeight,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: ticketRef.current.offsetWidth,
                    windowHeight: ticketRef.current.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png', 1.0);

                // Calculate dimensions to maintain aspect ratio
                const ticketWidth = 600; // Original ticket width
                const ticketHeight = 200; // Original ticket height
                const aspectRatio = ticketWidth / ticketHeight;

                // Create PDF with custom dimensions that match the ticket
                const pdfWidth = 210; // A4 width in mm
                const pdfHeight = pdfWidth / aspectRatio;

                const pdf = new jsPDF({
                    orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight]
                });

                // Add image to fill the entire PDF page
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

                pdf.save('flight-ticket.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '20px'
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
                onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
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
                    fontFamily: 'Arial, sans-serif' // Ensure consistent font
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
                    {/* PDF417 barcode at the beginning of left side */}
                    <div style={{
                        position: 'absolute',
                        left: '5px',
                        top: '10px',
                        bottom: '10px',
                        width: '15px',
                        background: `
                            repeating-linear-gradient(0deg,
                                #000 0px, #000 1px, #fff 1px, #fff 2px,
                                #000 2px, #000 4px, #fff 4px, #fff 5px,
                                #000 5px, #000 6px, #fff 6px, #fff 8px,
                                #000 8px, #000 10px, #fff 10px, #fff 11px,
                                #000 11px, #000 12px, #fff 12px, #fff 14px,
                                #000 14px, #000 16px, #fff 16px, #fff 17px,
                                #000 17px, #000 18px, #fff 18px, #fff 20px
                            )
                        `,
                        borderRadius: '2px'
                    }}></div>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        marginLeft: '25px'
                    }}>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#0066cc',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            AMERICAN AIRLINES
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            FLIGHT TICKET
                        </div>
                    </div>

                    {/* Passenger and Route */}
                    <div style={{ marginBottom: '15px', marginLeft: '25px' }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            JOHN SMITH
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>JFK</span>
                            <span style={{ margin: '0 10px', color: '#666' }}>→</span>
                            <span style={{ fontWeight: 'bold' }}>LAX</span>
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            NEW YORK → LOS ANGELES
                        </div>
                    </div>

                    {/* Flight Details */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        marginLeft: '25px',
                        fontFamily: 'Arial, sans-serif'
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
                        <div style={{
                            fontSize: '8px',
                            color: '#666',
                            textAlign: 'center',
                            marginBottom: '5px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            BOARDING PASS
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <div style={{
                                fontSize: '9px',
                                fontWeight: 'bold',
                                marginBottom: '3px',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                JOHN SMITH
                            </div>
                            <div style={{
                                fontSize: '8px',
                                color: '#666',
                                marginBottom: '3px',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                JFK → LAX
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                marginBottom: '3px',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                AA 1234
                            </div>
                            <div style={{
                                fontSize: '8px',
                                color: '#666',
                                marginBottom: '3px',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                15 MAR
                            </div>
                            <div style={{
                                fontSize: '9px',
                                fontWeight: 'bold',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                12A
                            </div>
                        </div>

                        <div style={{
                            width: '90px',
                            height: '15px',
                            backgroundColor: '#000',
                            background: `
                                repeating-linear-gradient(90deg,
                                    #000 0px, #000 1px, #fff 1px, #fff 2px,
                                    #000 2px, #000 3px, #fff 3px, #fff 5px,
                                    #000 5px, #000 6px, #fff 6px, #fff 7px,
                                    #000 7px, #000 9px, #fff 9px, #fff 10px,
                                    #000 10px, #000 11px, #fff 11px, #fff 13px,
                                    #000 13px, #000 15px, #fff 15px, #fff 16px
                                )
                            `
                        }}></div>
                    </div>

                    {/* Vertical warning at the right edge */}
                    <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        width: '25px',
                        backgroundColor: '#d32f2f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed'
                    }}>
                        <div style={{
                            fontSize: '7px',
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            lineHeight: '1.3',
                            letterSpacing: '0.3px',
                            padding: '5px 2px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            BOARDING GATES CLOSE 15 MINUTES BEFORE DEPARTURE TIME. PASSENGERS MAY NOT BE ACCEPTED FOR TRAVEL AFTER GATES CLOSE.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;