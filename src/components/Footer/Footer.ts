import React, { FC } from "react";

interface FooterProps {
  email: string;
}

const Footer: FC<FooterProps> = ({ type,props,key }) => {
  return (
    <footer style={{ backgroundColor: "black", color: "white" }}>
      <div style={{ textAlign: "center" }}>
        <h3>Knygų prenumeravimo platforma Bookie</h3>
      </div>
      <div>
        <p style={{ textAlign: "right", fontSize: "0.8em" }}>
          Iškilus klausimams kreiptis adresu{" "}
          <a href={`mailto:${email}`} style={{ color: "white" }}>
            {email}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;