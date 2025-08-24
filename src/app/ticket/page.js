const Ticket = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '20px'
        }}>
            <div style={{
                width: '600px',
                height: '200px',
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                overflow: 'hidden'
            }}>
                {/* Left side - main ticket */}
                <div style={{
                    flex: '3',
                    padding: '20px',
                    borderRight: '2px dashed #ccc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
                            AMERICAN AIRLINES
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            FLIGHT TICKET
                        </div>
                    </div>

                    {/* Passenger and Route */}
                    <div style={{ marginBottom: '15px' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
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

                        <div style={{
                            width: '50px',
                            height: '15px',
                            backgroundColor: '#000',
                            background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px)'
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
                            padding: '5px 2px'
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