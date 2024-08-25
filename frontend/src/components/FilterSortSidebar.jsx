import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Reusable FormCheck component
const FormCheck = ({ id, name, label, value, checked, onChange }) => (
  <Form.Check
    type="radio"
    id={id}
    name={name}
    label={label}
    value={value}
    checked={checked}
    onChange={onChange}
  />
);

const FilterSortSidebar = ({ setFilters }) => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const ratingOptions = [
    { label: <span className="text-warning"><FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt /></span>, value: "4.5" },
    { label: <span className="text-warning"><FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></span>, value: "4" },
    { label: <span className="text-warning"><FaStar /><FaStar /><FaStar /><FaRegStar /><FaRegStar /></span>, value: "3" },
    { label: <span className="text-warning"><FaStar /><FaStar /><FaRegStar /><FaRegStar /><FaRegStar /></span>, value: "2" },
    { label: <span className="text-warning"><FaStar /><FaRegStar /><FaRegStar /><FaRegStar /><FaRegStar /></span>, value: "1" },
    { label: "All", value: "" },
  ];

  const categoryOptions = [
    { id: "clear", label: "All", value: "" },
    { id: "electronics", label: "Electronics", value: "Electronics" },
    { id: "decoration", label: "Decoration", value: "Decoration" },
    { id: "camera", label: "Camera", value: "Camera" },
    { id: "accessories", label: "Accessories", value: "Accessories" },
    { id: "clothing", label: "Clothing", value: "Clothing" },
  ];

  const sortOptions = [
    { id: "priceAsc", label: "Price: Low to High", value: "priceAsc" },
    { id: "priceDesc", label: "Price: High to Low", value: "priceDesc" },
    { id: "rating", label: "Top Rated", value: "rating" },
  ];

  const applyFilters = () => {
    setFilters({
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sortBy,
    });
  };

  return (
    <div className="sticky-top sidebar-container">
      <Button
        variant="secondary"
        className="d-md-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        Filter
      </Button>
      <div
        className={`sidebar p-3 d-md-block ${
          showSidebar ? "d-block" : "d-none"
        } d-md-block`}
        style={{ height: "90vh", overflowY: "auto" }}
      >
        <Form className="category-form">
          <Form.Group>
            <Form.Label className="fs-6 fw-bold">Choose a category</Form.Label>
            <div className="category-list">
              {categoryOptions.map(option => (
                <FormCheck
                  key={option.id}
                  id={option.id}
                  name="category"
                  label={option.label}
                  value={option.value}
                  checked={category === option.value}
                  onChange={() => setCategory(option.value)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className="fs-6 fw-bold">Sort By</Form.Label>
            {sortOptions.map(option => (
              <FormCheck
                key={option.id}
                id={option.id}
                name="sortOptions"
                label={option.label}
                value={option.value}
                checked={sortBy === option.value}
                onChange={() => setSortBy(option.value)}
              />
            ))}
          </Form.Group>

          <Form.Group>
            <Form.Label className="fs-6 fw-bold">Filter By Rating</Form.Label>
            {ratingOptions.map(option => (
              <FormCheck
                key={option.value}
                id={`rating-${option.value}`}
                name="filterOptions"
                label={option.label}
                value={option.value}
                checked={rating === option.value}
                onChange={() => setRating(option.value)}
              />
            ))}
          </Form.Group>

          <Form.Group controlId="formPriceRange">
            <Form.Label>Price Range</Form.Label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Min Price"
              value={minPrice}
              max={maxPrice - 1}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Form.Control
              type="number"
              min={minPrice}
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="mt-1"
            />
          </Form.Group>
        </Form>

        <Button variant="primary" className="mt-3" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSortSidebar;
