export const headingStyles = {
    fontWeight: 900,
    fontSize: { xs: "2.2rem", md: "3rem" },
    letterSpacing: { xs: "-0.5px", md: "-1.5px" },
    background: "linear-gradient(90deg,rgb(235, 18, 36) 0%,rgb(240, 4, 24) 50%, #2B86C5 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
    display: "inline-block",
    cursor: "default",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": {
        transform: "scale(1.03)",
        letterSpacing: { xs: "0px", md: "-0.5px" },
        "&::after": {
            width: "100%",
            left: 0,
        },
    },
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: -8,
        left: "50%",
        width: 0,
        height: 4,
        background: "linear-gradient(90deg, #FF3CAC 0%,rgb(231, 16, 9) 100%)",
        borderRadius: 2,
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    "&:active": {
        transform: "scale(0.98)",
    },
};