import React, { memo } from "react";
import "./Style.css";
function NotFound() {
  return (
    <div className="not-found-admin">
      <section className="error-container">
        <span>4</span>
        <span>
          <span className="screen-reader-text">0</span>
        </span>
        <span>4</span>
        <br></br>
        <span className="message">Không tìm thấy thông tin</span>
      </section>
    </div>
  );
}

export default memo(NotFound);
