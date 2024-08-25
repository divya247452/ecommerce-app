import React from 'react'
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
   < footer className='h-100 bg-dark text-white'>
        <Container>
            <Row>
                <Col className='text-center pt-3'>
                    <p>DivyaShop &copy; {currentYear}</p>  
                </Col>
            </Row>
        </Container>
   </footer>
  )
}

export default Footer