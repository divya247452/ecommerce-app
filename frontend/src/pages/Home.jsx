import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import FilterSortSidebar from "../components/FilterSortSidebar";

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const [filters, setFilters] = useState({});

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    ...filters,
  });

  useEffect(() => {
    // Fetch data when filters are applied or changed
  }, [filters]);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <Row>
        <Col md={3}>
          <FilterSortSidebar setFilters={setFilters} />
        </Col>
        <Col md={9}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <h1>Latest Products</h1>
              <Row>
                {data.products.length === 0 ? (
                  <Col className="bg-danger p-2">No Product Found.</Col>
                ) : (
                  data.products.map((product) => (
                    <Col key={product._id} sm={6} md={6} lg={4} className='d-flex align-items-stretch'>
                      <Product product={product} />
                    </Col>
                  ))
                )}
              </Row>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ""}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Home;
