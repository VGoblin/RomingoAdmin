import { FC, useEffect, useState, useContext } from "react";
import {
  useTheme,
  Chip,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  Box,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import moment from "moment";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { useParams } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { Check, Close, ExpandMore } from "@mui/icons-material";
import { HotelRoomContext } from "./RoomContext";

const CITIES_QUERY = gql`
  query Cities {
    cities {
      id
      name
    }
  }
`;
const ADMIN_ROOMS_QUERY = gql`
  query ($propertyId: String!) {
    adminRooms(input: { propertyId: $propertyId }) {
      id
      name
      sabreTexts
      sabreNames
      areaInSquareFeet
    }
  }
`;

const SABRE_ROOMS_QUERY = gql`
  query (
    $id: String!
    $checkIn: Date!
    $checkOut: Date!
    $adults: Int!
    $children: [ChildInput!]!
    $dogs: Int!
  ) {
    property(
      input: {
        propertyId: $id
        checkIn: $checkIn
        checkOut: $checkOut
        adults: $adults
        children: $children
        dogs: $dogs
      }
    ) {
      id
      name
      rooms {
        beds {
          code
          desc
          count
        }
        type
        typeCode
        nonSmoking
        desc
        amenities {
          code
          desc
          value
          accessible
          free
        }
        maxOccupants
        priceKey
        breakfastIncluded
        lunchIncluded
        dinnerIncluded
        averagePrice
        totalPrice
        totalPriceAfterTax
        averagePriceAfterTax
        totalFees
        fees {
          desc
          amount
        }
        availableQuantity
        cancelationPolicy {
          desc
          deadlineReference
          deadlineMultiplier
          deadlineUnit
          deadlineLocal
          cancelable
        }
        feesIncluded
      }
    }
  }
`;

export const SabreRooms: FC = () => {
  const theme = useTheme();
  const [roomContext, setRoomContext] = useContext(HotelRoomContext);
  const { id } = useParams();
  const [randomCheckin, setRandomCheckin] = useState(0);
  const [randomCheckout, setRandomCheckout] = useState(1);
  const [reducedRooms, setReducedRooms] = useState<any>(null);
  const [query, setQuery] = useState({
    checkIn: moment(new Date())
      .add(3, "months")
      .add(randomCheckin, "days")
      .format("YYYY-MM-DD"),
    checkOut: moment(new Date())
      .add(3, "months")
      .add(randomCheckout, "days")
      .format("YYYY-MM-DD"),
    adults: 2,
    children: [] as any,
    dogs:1
  });

  const importRoom = (e: any) => {
    setRoomContext((prev: any) => ({
      ...prev,
      sabreName: e.type,
      sabreText: e.desc,
    }));
  };

  const createDefault = (e: any) => {
    setRoomContext((prev: any) => ({
      ...prev,
      sabreRoomTypeCode: 0,
      sabreName: "default",
      sabreRoomId: "default",
    }));
  };

  const updateQuery = (prop: string) => (event: any) => {
    if (prop === "adults") {
      setQuery({ ...query, adults: Number(event.target.value) });
    } 
    
    else if (prop === "dogs") {
      setQuery({ ...query, dogs: Number(event.target.value) });
    } 
    
    else if (prop === "children") {
      if (event.target.value === 0) {
        setQuery({ ...query, children: [] });
      } else {
        setQuery({
          ...query,
          children: Array(parseInt(event.target.value)).fill({ age: 5 }),
        });
      }
    } else {
      setQuery({ ...query, [prop]: event.target.value });
    }
  };

  const [
    getAdminRooms,
    { loading: loadingAdminRooms, error: adminRoomsError, data: adminRoomData },
  ] = useLazyQuery(ADMIN_ROOMS_QUERY, {
    variables: {
      propertyId: id,
    },
  });

  const [
    getRooms,
    { loading: loadingRooms, error: roomsError, data: roomData },
  ] = useLazyQuery(SABRE_ROOMS_QUERY, {
    variables: {
      id: id,
      ...query
    },
  });

  useEffect(() => {
    if (roomData) {
      setReducedRooms(
        roomData.property?.rooms.reduce((acc: Array<any>, item: any) => {
          if (acc && acc.length === 0) {
            return [...acc, item];
          } else {
            if (item.desc) {
              if (acc.find((accedItem: any) => accedItem.desc === item.desc)) {
                return acc;
              } else {
                return [...acc, item];
              }
            } else {
              return acc;
            }
          }
        }, [])
      );
    }
  }, [roomData]);

  useEffect(() => {
    getAdminRooms();
    getRooms();
  }, []);

  return (
    <Grid
      container
      sx={{
        boxShadow: 3,
        transition: "all .25s ease-in-out",
        display: "flex",
        borderRadius: "12px",
        border: "1px solid #ddd",
        background: theme.palette.background.paper,
        flexDirection: { xs: "column", sm: "row" },
        p: "1rem",
      }}
    >
      <Grid item xs={12}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Montserrat",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              mr: "auto",
              ml: "0",
            }}
          >
            SABRE RESULTS
          </Box>
        </Typography>
      </Grid>
      <Grid container sx={{ mt: 1 }} spacing={2}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check In"
              value={moment(query.checkIn)}
              onChange={(newValue) => {
                setQuery({
                  ...query,
                  checkIn: moment(newValue || new Date()).format("YYYY-MM-DD"),
                });
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" size="small" />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check Out"
              value={moment(query.checkOut)}
              onChange={(newValue) => {
                setQuery({
                  ...query,
                  checkOut: moment(newValue || new Date()).format("YYYY-MM-DD"),
                });
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" size="small" />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            type="number"
            fullWidth
            value={query.adults}
            onChange={updateQuery("adults")}
            inputProps={{ min: 0, max: 5, style: { textAlign: "center" } }}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">adults</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            type="number"
            fullWidth
            value={query.children.length}
            onChange={updateQuery("children")}
            inputProps={{
              min: 0,
              max: 5,
              style: { textAlign: "center" },
            }}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">children</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            type="number"
            fullWidth
            value={query.dogs}
            onChange={updateQuery("dogs")}
            inputProps={{
              min: 1,
              max: 5,
              style: { textAlign: "center" },
            }}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">dogs</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {reducedRooms?.length || 0} Available Rooms
      </Typography>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: ".5rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />

      <Grid item xs={12} sm={9} sx={{ pl: ".5rem", pb: ".5rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          NAME
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          IN DB
        </Typography>
      </Grid>

      {loadingRooms && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loadingAdminRooms && reducedRooms === null && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {" "}
          No rooms found{" "}
        </Box>
      )}

      {!loadingRooms &&
        reducedRooms &&
        reducedRooms.map((item: any) => {
          return (
            <Accordion sx={{ width: "100%", border: "0px" }}>
              <AccordionSummary
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "capitalize",
                }}
                expandIcon={<ExpandMore />}
              >
                {item.type
                  ? item.type + " - " + item.desc.toLowerCase()
                  : item.desc.toLowerCase()}
                {adminRoomData &&
                adminRoomData.adminRooms.find((room: any) =>
                  room.sabreTexts.includes(item.desc)
                ) ? (
                  <Check sx={{ ml: "auto", mr: "1rem", color: "green" }} />
                ) : (
                  <Close
                    sx={{
                      color: "red",
                      ml: "auto",
                      mr: "1rem",
                      mt: "auto",
                      mb: "auto",
                    }}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12} sx={{ display: "flex" }}>
                    <Button
                      onClick={() => importRoom(item)}
                      variant="contained"
                      sx={{ ml: "auto" }}
                    >
                      {" "}
                      import room{" "}
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}

      {/* <Button onClick={createDefault} variant='contained' sx={{ mt: '1rem', ml: 'auto', mr: 'auto' }}> Create a default room </Button> */}
    </Grid>
  );
};
