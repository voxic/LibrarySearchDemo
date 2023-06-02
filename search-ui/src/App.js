import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import BookCard from "./BookCard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#001e2b",
        paper: "#001e2b",
      },
    },
  });

  const [searching, setSearching] = useState(false);
  const [books, setBooks] = useState([]);
  const [booksIds, setBooksIds] = useState([]);
  const [curBook, setCurBook] = useState();
  const [similarBooks, setSimilarBooks] = useState([]);
  const [profileId, setProfileId] = useState(222222);
  const [facetFilter, setFacetFilter] = useState([]);
  const [facets, setFacets] = useState();
  const [sortOrder, setSortOrder] = useState(1);
  const searchInputRef = useRef();
  const [open, setOpen] = useState(false);
  const [diaOpen, setDiaOpen] = useState(false);

  function handleChange() {
    setOpen(open ? false : true);
  }

  const handleClickOpen = () => {
    setDiaOpen(true);
  };

  const handleClose = () => {
    setDiaOpen(false);
    setSimilarBooks([]);
    setCurBook();
  };

  function handleSearch() {
    if (searchInputRef.current.value.length > 2) {
      setSearching(true);
      if (booksIds) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            bookids: booksIds,
            filter: searchInputRef.current.value,
          }),
          redirect: "follow",
        };

        fetch("<<APP SERVICES URL>>/endpoint/search", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setBooks(result);
            setSearching(false);
          })
          .catch((error) => console.log("error", error));
      }
    } else {
      setSearching(false);
      getLibrary();
    }
  }

  function getFiltered() {
    if (booksIds) {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({
          bookids: booksIds,
          filter: facetFilter,
          sortOrder: sortOrder,
        }),
      };

      fetch("<<APP SERVICES URL>>/endpoint/getFiltered", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setBooks(result);
          var tempids = [];
          result.map((book) => {
            tempids.push(book._id);
          });
          setBooksIds(tempids);
        })
        .catch((error) => console.log("error", error));
    }
  }

  function getLibrary() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    setFacetFilter([]);

    var raw = `{ "profileId" : ${profileId}}`;
    console.log(raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("<<APP SERVICES URL>>/endpoint/getLibrary", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBooks(result[0].books);
        setBooksIds(result[0].bookids);
      })
      .catch((error) => console.log("error", error));
  }

  function getFacets() {
    if (booksIds) {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({ bookids: booksIds }),
      };

      fetch("<<APP SERVICES URL>>/endpoint/facets", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setFacets(result[0].facet);
        })
        .catch((error) => console.log("error", error));
    }
  }

  function getMoreLikeThis() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    const tempBook = {
      title: curBook.title,
      description: curBook.description,
    };
    var raw = `{ "bookid": ${curBook._id}, "book" : ${JSON.stringify(
      tempBook
    )} }`;

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("<<APP SERVICES URL>>/endpoint/getMoreLikeThis", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const temp = result.filter((book) => book.title !== curBook.title);
        console.log(temp);
        setSimilarBooks(temp);
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    getLibrary();
  }, [profileId]);

  useEffect(() => {
    getFacets();
  }, [booksIds]);

  useEffect(() => {
    getFiltered();
  }, [facetFilter]);

  useEffect(() => {
    console.log(sortOrder);
    getFiltered();
  }, [sortOrder]);

  function handleFacetClick(e) {
    if (e.target.id) {
      const tempFilter = JSON.parse(e.target.id);
      setFacetFilter([...facetFilter, tempFilter]);
    } else {
      const tempFilter = JSON.parse(e.target.parentElement.id);
      setFacetFilter([...facetFilter, tempFilter]);
    }
  }

  function handleBookClick(book) {
    setCurBook(book);
    getMoreLikeThis();
    setDiaOpen(true);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ pt: 8 }} maxWidth="lg">
        {curBook && (
          <Dialog fullWidth={true} open={diaOpen} onClose={handleClose}>
            <DialogTitle>
              <Typography align="center" variant="h6" component="div">
                Selected Book
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography align="center" gutterBottom>
                  <img
                    src={curBook.image.coverimage}
                    style={{
                      maxWidth: "100px",
                    }}
                  ></img>
                </Typography>
                <Typography align="center" variant="h6" component="div">
                  {curBook.title}
                </Typography>
                <Typography
                  align="center"
                  variant="h7"
                  component="div"
                  sx={{ mb: 2 }}
                >
                  {curBook.authors[0].name}
                </Typography>
                <Divider />
                <Typography
                  align="center"
                  variant="h6"
                  component="div"
                  sx={{ mb: 2, color: "#FFFFFF" }}
                >
                  Similar books
                </Typography>
                {similarBooks &&
                  similarBooks.map((book) => {
                    return (
                      <>
                        <Typography align="center" gutterBottom>
                          <img
                            src={book.image.coverimage}
                            style={{
                              maxWidth: "100px",
                            }}
                          ></img>
                        </Typography>
                        <Typography align="center" variant="h6" component="div">
                          {book.title}
                        </Typography>
                        <Typography
                          align="center"
                          variant="h7"
                          component="div"
                          sx={{ mb: 2 }}
                        >
                          {book.authors[0].name}
                        </Typography>
                      </>
                    );
                  })}
                <Typography align="center" gutterBottom></Typography>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
        <Grid container spacing={2}>
          <Grid md={12} lg={12}>
            <Typography variant="h6" sx={{ color: "#00ed63" }} gutterBottom>
              Library
            </Typography>
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <Button
              onClick={() => {
                setProfileId(117881);
              }}
            >
              Profile: 117881
            </Button>
            <Button
              onClick={() => {
                setProfileId(222222);
              }}
            >
              Profile: 222222
            </Button>
          </Grid>
          <Grid md={2} lg={2}>
            {facets && (
              <>
                <Accordion expanded={open}>
                  <AccordionSummary>
                    {" "}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleChange}
                    >
                      Filter & Sort
                    </Button>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="flex-start"
                        spacing={0.5}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        Authors
                        {facets.authorFacet.buckets.map((facet) => {
                          return (
                            <Chip
                              id={`{"path" : "authors.name", "value" : "${facet._id}"}`}
                              label={facet._id + " (" + facet.count + ")"}
                              onClick={handleFacetClick}
                            />
                          );
                        })}
                      </Stack>
                      <Stack
                        direction="column"
                        alignItems="flex-start"
                        spacing={0.5}
                        flexWrap="wrap"
                      >
                        Type
                        {facets.typeFacet.buckets.map((facet) => {
                          return (
                            <Chip
                              id={`{"path" : "book_type", "value" : "${facet._id}"}`}
                              label={facet._id + " (" + facet.count + ")"}
                              onClick={handleFacetClick}
                            />
                          );
                        })}
                      </Stack>
                      <Stack
                        direction="column"
                        alignItems="flex-start"
                        spacing={0.5}
                        flexWrap="wrap"
                      >
                        Language
                        {facets.langFacet.buckets.map((facet) => {
                          return (
                            <Chip
                              id={`{"path" : "language", "value" : "${facet._id}"}`}
                              label={facet._id + " (" + facet.count + ")"}
                              onClick={handleFacetClick}
                            />
                          );
                        })}
                      </Stack>
                      ;
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={getLibrary}>Reset</Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSortOrder(sortOrder === 1 ? -1 : 1);
                          }}
                          endIcon={
                            sortOrder === 1 ? (
                              <ExpandMoreIcon />
                            ) : (
                              <ExpandLessIcon />
                            )
                          }
                        >
                          Sort Title
                        </Button>
                      </div>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Grid>
          <Grid md={10} lg={10}>
            <Divider />

            {searching && (
              <Typography variant="h4" gutterBottom>
                Searching...
              </Typography>
            )}
            <Grid container>
              {books.length > 0 &&
                books.map((book) => {
                  return (
                    <Grid item xs={4}>
                      <BookCard
                        id={book._id}
                        book={book}
                        handleClick={handleBookClick}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            {books.length < 1 && (
              <Typography variant="h4" gutterBottom>
                No results
              </Typography>
            )}
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <TextField
              focused={true}
              sx={{ width: "100%", pb: 3 }}
              inputRef={searchInputRef}
              onChange={handleSearch}
              id="outlined-search"
              label="Search field"
              type="search"
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
