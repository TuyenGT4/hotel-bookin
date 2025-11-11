import { Box, Typography, Button, Rating } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BedIcon from "@mui/icons-material/Bed";
import {
  RoomCardContainer,
  RoomImage,
  RoomContent,
  RoomDetails,
} from "./RoomCardStyles";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const RoomCard = ({ room }) => {
  const router = useRouter();
  const { t } = useTranslation("component/rooms/RoomCard");

  const handleBookNow = () => {
    router.push("/allrooms");
  };

  return (
    <RoomCardContainer>
      <RoomImage src={room.image} alt={room.roomtype_id.name} />
      <RoomContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {room.roomtype_id.name}
        </Typography>
        <Rating value={5} readOnly sx={{ color: "red", mb: 1 }} />
        <Typography variant="body2" color="textSecondary">
          {room.price} VND/ {t("per_night", "Per Night")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {room.short_desc.split(" ").slice(0, 20).join(" ") +
            (room.short_desc.split(" ").length > 10 ? "..." : "")}
        </Typography>
        <RoomDetails>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleIcon sx={{ color: "red" }} />
            {parseInt(room.total_adult) + parseInt(room.total_child)}{" "}
            {t("persons", "Persons")}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CropSquareIcon sx={{ color: "red" }} /> {room.size}{" "}
            {t("sqft", "sq.ft")}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon sx={{ color: "red" }} /> {room.view}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BedIcon sx={{ color: "red" }} /> {room.bed_style}
          </Box>
        </RoomDetails>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "16px",
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
          onClick={handleBookNow}
        >
          {t("book_now", "Book Now")}
        </Button>
      </RoomContent>
    </RoomCardContainer>
  );
};

export default RoomCard;
