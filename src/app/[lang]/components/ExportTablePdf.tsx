import React from "react";
import { FaFileExport } from "react-icons/fa";

const ExportTablePdf = () => {
  return (
    <div className="flex items-center gap-2 font-sansInter text-sm">
      <div>
        <FaFileExport />
      </div>
      <div>Export</div>
    </div>
  );
};

export default ExportTablePdf;
