import { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";

export default function BarcodeComponent({ value }) {
  const containerRef = useRef(null);
  const [barWidth, setBarWidth] = useState(2);

  useEffect(() => {
    if (containerRef.current) {
      const divWidth = containerRef.current.offsetWidth;
      const barcodeLength = value.length || 12; // length of barcode value
      // Adjust divisor (10) if you want thinner/thicker bars
      setBarWidth(divWidth / (barcodeLength * 10));
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Barcode
        value={value}
        width={barWidth}
        height={48}       // slightly less than 50px to fit
        displayValue={false}
        margin={0}
      />
    </div>
  );
}
