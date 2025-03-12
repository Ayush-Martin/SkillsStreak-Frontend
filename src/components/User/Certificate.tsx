import { FC, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import certificateTemplate from "@/assets/images/certificateTemplate.jpg";
import { FaDownload } from "@/assets/icons";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";

interface ICertificateProps {
  courseName: string;
  trainerName: string;
}

const Certificate: FC<ICertificateProps> = ({ courseName, trainerName }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { username } = useSelector((state: RootReducer) => state.user);

  const generatePdf = async () => {
    const canvas = await html2canvas(certificateRef.current as HTMLElement);

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("certificate.pdf");
  };

  return (
    <div>
      {/* Hidden div for the certificate template but rendered*/}
      <div
        className="absolute opacity-0 pointer-events-none"
        style={{
          position: "absolute",
          zIndex: -1,
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={certificateRef}
          className="w-[1280px] h-[720px] relative text-center bg-cover"
          style={{
            background: `url(${certificateTemplate}) no-repeat center center`,
          }}
        >
          <h1 className="absolute top-[485px] left-[50%] transform -translate-x-1/2 text-4xl text-white font-mono font-semibold">
            {username}
          </h1>
          <h2 className="absolute top-[600px] left-[50%] transform -translate-x-1/2 text-2xl text-app-accent">
            {courseName}
          </h2>
          <h2 className="absolute top-[615px] right-0 transform -translate-x-1/2 text-lg text-app-accent text-center">
            {trainerName}
          </h2>
        </div>
      </div>

      <button onClick={generatePdf} className="text-2xl text-app-secondary">
        <FaDownload />
      </button>
    </div>
  );
};

export default Certificate;
