import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Error from 'next/error';
import Pagination from 'react-bootstrap/Pagination';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '@/components/ArtworkCard';

const PER_PAGE = 12

export default function ArtHome() {
    const router = useRouter();
    // Get the query from the path using the router
    // let finalQuery = router.asPath.split('?')[1];
    let finalQuery = "q=sunflowers"

    // Add the artworkList and page to the state
    let [ artworkList, setArtworkList ] = useState([]);
    let [ page, setPage ] = useState(1)

    // Make a call to the museum API using the objectID passed as props to this component
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers`);

    // Create a 2D array of data for paging that is set in the state 
    useEffect(() => {
        let results = []
        console.log(data)
        for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE) {
            const chunk = data?.objectIDs.slice(i, i + PER_PAGE);
            results.push(chunk);
        } 
        console.log(results);
        setArtworkList(results);
        setPage(1);
    }, [ data ]);

    // Throw an error if the API request fails
    if (error) {
        return <Error statusCode={404} />;
    } else {
        if (!data || data.length === 0) {
            return null;
        }
    }

    // Increase the value of page by 1
    const nextPage = () => page < artworkList.length && setPage(++page);
    
    // Decrease the value of page by 1
    const previousPage = () => page > 1 && setPage(--page);

    return (
        <>
            <Container>
            {artworkList.length > 0 ? (
                <>
                    <Row className="gy-4">
                    {artworkList[page - 1].map((currentObjectID) => (
                        <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID} />
                        </Col>
                    ))}
                    </Row>
                    <Row>
                    <Pagination>
                        <Pagination.Prev onClick={previousPage} />
                        <Pagination.Item>{page}</Pagination.Item>
                        <Pagination.Next onClick={nextPage} />
                    </Pagination>
                    </Row>
                </>
                ) : (
                <Card>
                    <Card.Body>
                    <h4>Nothing Here</h4>
                    <p>Try searching for something else.</p>
                    </Card.Body>
                </Card>
                )}
            </Container>
        </>
    );
}