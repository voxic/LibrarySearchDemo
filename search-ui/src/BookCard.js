import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export default function BookCard({ book, handleClick }) {
  return (
    <Card
      sx={{ minWidth: 100, minHeight: 200 }}
      onClick={() => {
        handleClick(book);
      }}
    >
      <CardContent>
        <Typography
          align="center"
          sx={{ fontSize: "0.1em" }}
          color="text.secondary"
          gutterBottom
        >
          <img src={book.image.coverimage} style={{ maxWidth: "45px" }}></img>
        </Typography>
        <Typography
          align="center"
          variant="h9"
          sx={{ fontSize: "0.8em" }}
          component="div"
        >
          {book.title}
        </Typography>
        <Typography
          align="center"
          sx={{ fontSize: "0.6em" }}
          color="text.secondary"
        >
          {book.authors[0].name}
        </Typography>
      </CardContent>
    </Card>
  );
}
