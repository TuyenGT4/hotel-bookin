import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

const dummyQuestions = [
  {
    questionKey: "faq_q1",
    answerKey: "faq_a1",
  },
  {
    questionKey: "faq_q2",
    answerKey: "faq_a2",
  },
  {
    questionKey: "faq_q3",
    answerKey: "faq_a3",
  },
];

const FAQSection = () => {
  const { t } = useTranslation("component/faqsection/Faqsection ");
  const [expanded, setExpanded] = useState(dummyQuestions.length - 1);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              display="block"
              gutterBottom
              sx={{ color: "grey.700" }}
            >
              {t("faq_header", "FEEL FREE TO ASK QUESTION")}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {t(
                "faq_title",
                "Let's Start a Free of Questions and Get a Quick Support"
              )}
            </Typography>

            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              {t(
                "faq_description",
                "We are the agency who always gives you a priority on the free of question and you can easily make a question on the bunch."
              )}
            </Typography>

            {dummyQuestions.map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{ mb: 2, boxShadow: 3, "&:last-child": { mb: 0 } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    {t(item.questionKey)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{t(item.answerKey)}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/hotel88.jpg"
              alt={t("faq_image_alt", "Thinking Woman")}
              sx={{ width: "100%", borderRadius: 1, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FAQSection;
