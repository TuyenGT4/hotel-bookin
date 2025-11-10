import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const dummyQuestions = [
    {
        question: "How I Will Book a Room or Resort?",
        answer: "You can book a room or resort through our website by following these simple steps..."
    },
    {
        question: "How I Will Be Able to Add on the Admin Portal?",
        answer: "To add on the admin portal, you need to first log in and then follow these instructions..."
    },
    {
        question: "What are the Benefits of These Agencies?",
        answer: "Our agencies provide a range of benefits including discounts, exclusive offers, and 24/7 customer support..."
    }
];

const FAQSection = () => {
    const [expanded, setExpanded] = useState(dummyQuestions.length - 1);

    const handleChange = (index) => (event, isExpanded) => {
        setExpanded(isExpanded ? index : false);
    };

    return (

        <Container maxWidth="xl"     >

        <Box sx={{ padding: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="overline" display="block" gutterBottom sx={{ color: 'grey.700' }}>
                        FEEL FREE TO ASK QUESTION
                    </Typography>
                    <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Let's Start a Free of Questions and Get a Quick Support
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                        We are the agency who always gives you a priority on the free of question and you can easily make a question on the bunch.
                    </Typography>
                    {dummyQuestions.map((item, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === index}
                            onChange={handleChange(index)}
                            sx={{ mb: 2, boxShadow: 3, '&:last-child': { mb: 0 } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{item.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    {item.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="/images/hotel8.jpg"
                        alt="Thinking Woman"
                        sx={{ width: '100%', borderRadius: 1, boxShadow: 3 }}
                    />
                </Grid>
            </Grid>
        </Box>

        </Container>

    );
};

export default FAQSection;