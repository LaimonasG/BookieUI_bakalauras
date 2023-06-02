import React, { useState } from 'react';
import "./BookBlockDropDown.css"

type BlockBookDropdownProps = {
  blockReason: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

const BlockBookDropdown: React.FC<BlockBookDropdownProps> = ({ blockReason, onChange, onSubmit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (blockReason.trim() !== '') {
      onSubmit();
    }
  };
  return (
    <div className="block-book-dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Blokuoti knygą
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Priežastis"
              value={blockReason}
              onChange={handleInputChange}
            />
            <button type="submit">Pateikti</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlockBookDropdown;