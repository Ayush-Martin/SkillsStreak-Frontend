import { FC } from "react";

interface IPdfViewerProps {
  path: string; 
}

const PdfViewer: FC<IPdfViewerProps> = ({ path }) => {
  return (
    <div className="h-full bg-white">
      <iframe
        src={path}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
