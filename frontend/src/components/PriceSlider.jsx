import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import './CustomRangeSlider.css'; // Custom styles for the slider

const PriceSlider = ({minValue, maxValue}) => {
  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(100);
  const [sliderWidth, setSliderWidth] = useState(0);

  // Effect to set the slider width
  useEffect(() => {
    const handleResize = () => {
      const slider = document.getElementById('range-slider');
      if (slider) {
        setSliderWidth(slider.clientWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMinChange = (e) => {
    const value = Math.min(e.target.value, maxValue - 1);
    setMinValue(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(e.target.value, minValue + 1);
    setMaxValue(value);
  };

  return (
    <Form.Group controlId="formPriceRange">
      <Form.Label>Price Range</Form.Label>
      <div className="range-slider-container">
        <input
          id="range-slider"
          type="range"
          min="0"
          max="1000"
          step="1"
          value={minValue}
          onChange={handleMinChange}
          className="range-slider"
        />
        <input
          type="range"
          min={minValue + 1}
          max="1000"
          step="1"
          value={maxValue}
          onChange={handleMaxChange}
          className="range-slider"
        />
        <div className="range-labels">
          <span>Min Price: ${minValue}</span>
          <span>Max Price: ${maxValue}</span>
        </div>
      </div>
    </Form.Group>
  );
};

export default PriceSlider;
