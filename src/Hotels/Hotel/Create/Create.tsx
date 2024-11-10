import { FC, useEffect, useState, createContext, useContext } from "react";
import {
  Chip,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Typography,
  Fab,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  Box,
  ButtonGroup,
  Tooltip,
  CircularProgress,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  Close,
  Add,
  SaveRounded,
  AddPhotoAlternate,
  ErrorRounded,
  ExpandMore,
  Check,
  HideImage,
  PanoramaWideAngleSelect,
  Launch,
} from "@mui/icons-material";
import { HotelDataContext } from "../HotelContext";
import { HotelData } from "../../../tools/types";

const CREATE_HOTEL = gql`
  mutation AdminCreateProperty(
    $cityId: String!
    $corporateDiscount: Boolean!
    $sabreId: String!
    $alias : String!
    $page_rank : Int!
    $allows_big_dogs : Int!
    $name: String!
    $desc: String!
    $addressLine1: String!
    $zipCode: String!
    $neighborhood: String!
    $romingoScore: Float!
    $dogAmenities: [Int!]!
    $imageDirectoryName: String!
    $featuredImageFilename: String!
    $imageFilenames: [String!]!
    $googlePlaceId: String!
    $blocked: Boolean!
    $listingsPagePromoText: String!
    $detailsPagePromoText: String!
    $checkoutPagePromoText: String!
    $hotelEmail: String
    $hotelAlternativeEmail: String
  ) {
    adminCreateProperty(
      input: {
        cityId: $cityId
        corporateDiscount: $corporateDiscount
        sabreId: $sabreId
        alias : $alias
        page_rank : $page_rank
        allows_big_dogs : $allows_big_dogs
        name: $name
        desc: $desc
        addressLine1: $addressLine1
        zipCode: $zipCode
        neighborhood: $neighborhood
        romingoScore: $romingoScore
        dogAmenities: $dogAmenities
        imageDirectoryName: $imageDirectoryName
        featuredImageFilename: $featuredImageFilename
        imageFilenames: $imageFilenames
        googlePlaceId: $googlePlaceId
        blocked: $blocked
        listingsPagePromoText: $listingsPagePromoText
        detailsPagePromoText: $detailsPagePromoText
        checkoutPagePromoText: $checkoutPagePromoText
        hotelEmail: $hotelEmail
        hotelAlternativeEmail: $hotelAlternativeEmail
      }
    ) {
      id
      lowestAveragePrice
    }
  }
`;

const IMAGE_DIRECTORY_QUERY = gql`
  query AdminImageDirectory($name: String!, $rooms: Boolean!) {
    adminImageDirectory(input: { name: $name, rooms: $rooms }) {
      name
      files {
        name
      }
    }
  }
`;

const DOG_AMENITIES_QUERY = gql`
  query DogAmenities {
    adminDogAmenities {
      id
      name
      desc
    }
  }
`;

export const CreateHotel: FC = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [createHotel] = useMutation(CREATE_HOTEL);
  const theme = useTheme();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState<HotelData>({
    name: "",
    location: {
      lat: "",
      lon: "",
      address: "",
    },
    city: {
      name: "",
      id: "",
      center: {
        latitude: 0,
        longitude: 0,
      },
      state: {
        id: "",
        code: "",
        name: "",
      },
    },
    mainImg: "",
    gallery: [],
    sabreId: "",
    alias :"",
    page_rank :0,
    allows_big_dogs :0,
    addressLine1: "",
    romingoScore: 0,
    neighborhood: "",
    zipCode: "",
    desc: "",
    imageFilenames: [],
    imageDirectoryName: "",
    featuredImageFilename: "",
    featuredImageURL: "",
    imageURLs: [],
    dogAmenities: [],
    amenities: [],
    nearbyActivities: [],
    cityId: "",
    corporateDiscount: false,
    blocked: false,
    hotelEmail: "",
    hotelAlternativeEmail: "",
    petFeesData: "",
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const savable = hotelData.name && hotelData.name.length > 0;

  const handleCreateHotel = () => {
    if (
      hotelData.city!.id.length! > 0 &&
      hotelData.sabreId!.length > 0 &&
      hotelData.name!.length > 0 &&
      hotelData.desc!.length > 0 &&
      hotelData.addressLine1!.length! > 0 &&
      hotelData.zipCode!.length > 0 &&
      hotelData.neighborhood!.length > 0 &&
      hotelData.romingoScore! > 0 &&
      hotelData.googlePlaceId &&
      hotelData.listingsPagePromoText &&
      hotelData.detailsPagePromoText &&
      hotelData.checkoutPagePromoText
    ) {
      if (
        hotelData.imageDirectoryName!.length > 0 &&
        hotelData.imageURLs!.length > 0 &&
        hotelData.featuredImageURL!.length > 0
      ) {
        setSaving(true);
        setTimeout(() => {
          createHotel({
            variables: {
              cityId: hotelData.city && hotelData.city.id,
              corporateDiscount: hotelData.corporateDiscount,
              sabreId: hotelData.sabreId,
              alias: hotelData.alias,
              page_rank: hotelData.page_rank? parseFloat(hotelData.page_rank.toString())
              : 1,
              allows_big_dogs: hotelData.allows_big_dogs,
              name: hotelData.name,
              desc: hotelData.desc,
              addressLine1: hotelData.addressLine1,
              zipCode: hotelData.zipCode,
              neighborhood: hotelData.neighborhood,
              romingoScore: hotelData.romingoScore
                ? parseFloat(hotelData.romingoScore.toString())
                : 1,
              dogAmenities:
                hotelData &&
                hotelData.dogAmenities &&
                hotelData.dogAmenities.map((a: any) => a.id),
              imageDirectoryName: hotelData.imageDirectoryName,
              featuredImageFilename: hotelData.featuredImageURL,
              imageFilenames: hotelData.imageURLs,
              googlePlaceId: hotelData.googlePlaceId,
              blocked: hotelData.blocked,
              listingsPagePromoText: hotelData.listingsPagePromoText,
              detailsPagePromoText: hotelData.detailsPagePromoText,
              checkoutPagePromoText: hotelData.checkoutPagePromoText,
              hotelEmail: hotelData.hotelEmail,
              hotelAlternativeEmail: hotelData.hotelAlternativeEmail,
            },
          }).then(() => {
            setSaved(true);
            setCurrentTab("rooms");
            setTimeout(() => {
              navigate(`/hotels/`);
            }, 250);
          });
        }, 2000);
      } else {
        setErrorMessage(
          "All images must be added before you can create a hotel."
        );
      }
    } else {
      setErrorMessage(
        "All hotel details need to be filled in before you can create a hotel. There are no optional fields."
      );
    }
  };

  useEffect(() => {
    if (saving) {
      setTimeout(() => {
        setSaved(true);
      }, 4000);
    } else {
      setSaved(false);
    }
  }, [saving]);

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaving(false);
      }, 2000);
    }
  }, [saved]);

  return (
    <HotelDataContext.Provider value={[hotelData, setHotelData]}>
      <Container>
        {saving && (
          <Grid
            sx={{
              position: "fixed",
              top: "0px",
              left: "0px",
              right: "0px",
              zIndex: 1401,
              bottom: "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#11111140",
              fontWeight: 600,
              backdropFilter: "blur(6px)",
              fontSize: "20px",
            }}
          >
            <Grid
              sx={{
                background: "#ffffffbf",
                padding: "1rem 2.5rem",
                borderRadius: "12px",
                minWidth: "325px",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              {saved ? (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check sx={{ margin: "1rem auto", fontSize: "40px" }} /> Hotel
                  Added
                </Grid>
              ) : (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    sx={{ margin: "1rem auto", height: "25px" }}
                  />{" "}
                  Adding Hotel to Database
                </Grid>
              )}
            </Grid>
          </Grid>
        )}

        {errorMessage && (
          <Grid
            sx={{
              position: "fixed",
              top: "0px",
              left: "0px",
              right: "0px",
              zIndex: 1401,
              bottom: "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "325px",
              background: "#11111140",
              fontWeight: 600,
              color: "#111",
              backdropFilter: "blur(6px)",
              fontSize: "20px",
            }}
          >
            <Grid
              sx={{
                background: "#ffffffbf",
                maxWidth: "350px",
                padding: "1rem 2.5rem",
                borderRadius: "12px",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ErrorRounded sx={{ margin: "1rem auto", fontSize: "40px" }} />{" "}
                {errorMessage}
              </Grid>
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  pt: "1rem",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => setErrorMessage(null)}
                >
                  {" "}
                  Ok{" "}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{ margin: "0px auto", mb: "1rem", mt: "1rem" }}
              >
                <ButtonGroup fullWidth>
                  <Button
                    variant={currentTab === "images" ? "contained" : "outlined"}
                    onClick={() => setCurrentTab("images")}
                  >
                    IMAGES
                  </Button>
                  <Button
                    variant={
                      currentTab === "details" ? "contained" : "outlined"
                    }
                    onClick={() => setCurrentTab("details")}
                  >
                    DETAILS
                  </Button>
                  {/* <Button variant={currentTab === 'rooms' ? 'contained' : 'outlined'} onClick={() => setCurrentTab('rooms')}>
                  ROOMS
                </Button> */}
                </ButtonGroup>
              </Grid>
              {currentTab === "images" && <Images />}
              {currentTab === "details" && <Details />}
              {currentTab === "rooms" && (
                <Grid>
                  {" "}
                  Please create the hotel before adding room details{" "}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Fab
            disabled={!savable}
            onClick={handleCreateHotel}
            color="primary"
            sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
          >
            {" "}
            <Add />{" "}
          </Fab>
        </Grid>
      </Container>
    </HotelDataContext.Provider>
  );
};

const STATES_QUERY = gql`
  query ($id: String!) {
    adminStates(input: { countryId: $id }) {
      id
      name
    }
  }
`;

const CITIES_QUERY = gql`
  query ($id: String!) {
    adminCities(input: { stateId: $id }) {
      id
      name
    }
  }
`;

interface NearbyActivity {
  id: string;
  name: string;
  overview: string;
  desc: string;
  addressLine1: string;
  price: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const Details: FC = () => {
  const [sortView, setSortView] = useState("3");
  const [state, setState] = useState({ id: "", name: "" });
  const [getStates, { loading, error, data: states }] = useLazyQuery(
    STATES_QUERY,
    {
      variables: {
        id: "US",
      },
    }
  );

  const [
    getCities,
    { loading: loadingCities, error: errorCities, data: cities },
  ] = useLazyQuery(CITIES_QUERY);
  const [
    getDogAmenities,
    {
      loading: loadingDogAmenities,
      error: errorDogAmenities,
      data: dogAmenities,
    },
  ] = useLazyQuery(DOG_AMENITIES_QUERY);
  const [addAmenity, setAddAmenity] = useState(false);
  const [addDogAmenityField, setAddDogAmenityField] = useState(false);
  const [hotelData, setHotelData] = useContext(HotelDataContext);
  const [activityToChange, setActivityToChange] = useState(null);
  const theme = useTheme();

  const addDogItem = (i: any) => {
    setHotelData({
      ...hotelData,
      dogAmenities: [...hotelData.dogAmenities, i],
    });
  };

  const removeDogItem = (i: any) => {
    setHotelData({
      ...hotelData,
      dogAmenities: hotelData.dogAmenities.filter((amen: string) => amen !== i),
    });
  };

  const addHotelItem = (i: any) => {
    if (i.key === "Enter") {
      setHotelData({
        ...hotelData,
        amenities: [...hotelData.amenities, { desc: i.target.value }],
      });
      i.target.value = "";
    }
  };

  const removeHotelItem = (i: any) => {
    setHotelData({
      ...hotelData,
      amenities: hotelData.amenities.filter((amen: string) => amen !== i),
    });
  };

  const removeActivity = (i: any) => {
    setHotelData({
      ...hotelData,
      nearbyActivities: hotelData.nearbyActivities.filter(
        (amen: any) => amen !== i
      ),
    });
  };

  const updateName = (i: any) => {
    setHotelData({ ...hotelData, name: i.target.value });
  };

  const updateScore = (i: any) => {
    setHotelData({ ...hotelData, romingoScore: i.target.value });
  };

  const updateAddress = (i: any) => {
    setHotelData({ ...hotelData, addressLine1: i.target.value });
  };

  const updateNeighborhood = (i: any) => {
    setHotelData({ ...hotelData, neighborhood: i.target.value });
  };

  const updateZipCode = (i: any) => {
    setHotelData({ ...hotelData, zipCode: i.target.value });
  };

  const updateDesc = (i: any) => {
    setHotelData({ ...hotelData, desc: i.target.value });
  };

  const updateState = (i: any) => {
    setState(i.target.value);
  };

  const updateCity = (i: any) => {
    setHotelData({ ...hotelData, city: { id: i.target.value } });
  };

  const updateDiscount = (i: any) => {
    hotelData.corporateDiscount
      ? setHotelData({ ...hotelData, corporateDiscount: false })
      : setHotelData({ ...hotelData, corporateDiscount: true });
  };

  const updateSabreId = (i: any) => {
    setHotelData({ ...hotelData, sabreId: i.target.value });
  };

  const addAlias = (i: any) => {
    setHotelData({ ...hotelData, alias: i.target.value });
  };

  const addPageRank = (i: any) => {
    setHotelData({ ...hotelData, page_rank: i.target.value });
  };

  const addBigdog = (i: any) => {
    hotelData.allows_big_dogs
      ? setHotelData({ ...hotelData, allows_big_dogs: 0})
      : setHotelData({ ...hotelData, allows_big_dogs: 1});
  };

  const updateGooglePlaceId = (i: any) => {
    setHotelData({ ...hotelData, googlePlaceId: i.target.value });
  };

  const updateBlocked = (i: any) => {
    hotelData.blocked
      ? setHotelData({ ...hotelData, blocked: false })
      : setHotelData({ ...hotelData, blocked: true });
  };

  const updatelistingsPagePromoText = (i: any) => {
    setHotelData({ ...hotelData, listingsPagePromoText: i.target.value });
  };

  const updateDetailsPagePromoText = (i: any) => {
    setHotelData({ ...hotelData, detailsPagePromoText: i.target.value });
  };

  const updateCheckoutPagePromoText = (i: any) => {
    setHotelData({ ...hotelData, checkoutPagePromoText: i.target.value });
  };

  const updateEmail = (i: any) => {
    setHotelData({ ...hotelData, hotelEmail: i.target.value });
  };

  const updateAlternativeEmail = (i: any) => {
    setHotelData({ ...hotelData, hotelAlternativeEmail: i.target.value });
  };

  useEffect(() => {
    getStates();
    getDogAmenities();
  }, []);

  useEffect(() => {
    if (state.id) {
      getCities({ variables: { id: state.id } });
    }
  }, [state]);

  return (
    <Grid
      container
      sx={{
        boxShadow: 3,
        transition: "all .25s ease-in-out",
        "&:hover": { boxShadow: 5 },
        display: "flex",
        borderRadius: "12px",
        border: "1px solid #ddd",
        background: theme.palette.background.paper,
        flexDirection: { xs: "row", sm: "row" },
        p: "1rem",
      }}
    >
      <Grid item xs={12} sm={6}>
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
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField onChange={updateName} value={hotelData.name} fullWidth />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ textAlign: "left", pl: "1rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          ROMINGO SCORE
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: "1rem",
            color: "warning.main",
            mr: { sm: "0rem", xs: "auto" },
          }}
        >
          <TextField
            onChange={updateScore}
            type="number"
            value={hotelData.romingoScore}
            fullWidth
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ pl: "1rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Montserrat",
          }}
        >
          CORPORATE DISCOUNT
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Roboto",
          }}
        >
          <Switch
            onClick={updateDiscount}
            value={hotelData.corporateDiscount}
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ pt: "1rem" }}>
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
          SABRE ID
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField
            onChange={updateSabreId}
            value={hotelData.sabreId}
            fullWidth
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ pt: "1rem", pl: "1rem" }}>
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
          GOOGLE PLACE ID
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField
            onChange={updateGooglePlaceId}
            value={hotelData.googlePlaceId}
            fullWidth
          />
          <Button
            onClick={() =>
              window.open(
                "https://developers.google.com/maps/documentation/places/web-service/place-id"
              )
            }
          >
            <Launch />
          </Button>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ pt: "1rem", pl: "1rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Montserrat",
          }}
        >
          BLOCKED
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Roboto",
          }}
        >
          <Switch onClick={updateBlocked} value={hotelData.blocked} />
        </Typography>
      </Grid>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />
      <Grid item xs={12} sm={6} >
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
          ALIAS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField onChange={addAlias} value={hotelData.alias} fullWidth />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          PAGE RANK
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: "1rem",
            color: "warning.main",
            mr: { sm: "0rem", xs: "auto" },
          }}
        >
          <TextField
            onChange={addPageRank}
            type="number"
            value={hotelData.page_rank}
            fullWidth
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={2} sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Montserrat",
          }}
        >
          BIG DOGS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            fontFamily: "Roboto",
          }}
        >
          <Switch onClick={addBigdog} value={hotelData.allows_big_dogs} />
        </Typography>
      </Grid>
      
      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mt: ".5rem", mb: ".5rem" }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "#666",
              justifyContent: "space-between",
              fontFamily: "Montserrat",
            }}
          >
            LOCATION
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: "1rem",
              color: "#222",
              fontWeight: 500,
              fontSize: "1.25rem",
              display: { sm: "block", md: "flex" },
              justifyContent: "space-between",
              fontFamily: "Roboto",
              flexWrap: "wrap",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  onChange={updateAddress}
                  label="address"
                  value={hotelData.addressLine1}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>state</InputLabel>
                  <Select
                    label="state"
                    value={state}
                    renderValue={(s) => s.name}
                    onChange={updateState}
                    sx={{ minWidth: "200px" }}
                  >
                    {states &&
                      states.adminStates &&
                      states.adminStates.map((s: any) => (
                        <MenuItem value={s}>{s.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>city</InputLabel>
                  <Select
                    label="city"
                    value={hotelData.city.id}
                    onChange={updateCity}
                    sx={{ minWidth: "200px" }}
                  >
                    {cities &&
                      cities.adminCities &&
                      cities.adminCities.map((amenity: any) => (
                        <MenuItem value={amenity.id}>{amenity.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  onChange={updateNeighborhood}
                  label="neighborhood"
                  value={hotelData.neighborhood}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  onChange={updateZipCode}
                  label="zip code"
                  value={hotelData.zipCode}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Typography>
        </Grid>
      </Grid>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />

      <Grid item xs={12} sx={{ mt: ".5rem", mb: ".5rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          DESCRIPTION
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField
            onChange={updateDesc}
            value={hotelData.desc}
            fullWidth
            multiline
            rows={5}
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
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
          Email
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField onChange={updateEmail} value={hotelData.hotelEmail} fullWidth />
        </Typography>
      </Grid>
      <Grid item
        xs={12}
        sm={6}
        sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
      >
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
          Alternative Email
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField onChange={updateAlternativeEmail} value={hotelData.hotelAlternativeEmail} fullWidth />
        </Typography>
      </Grid>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />

      <Grid item xs={12} sx={{ mt: ".5rem", mb: ".5rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          PROMO TEXT
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField
            sx={{ mr: ".5rem" }}
            label="listing page"
            onChange={updatelistingsPagePromoText}
            value={hotelData.listingsPagePromoText}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            sx={{ ml: ".5rem", mr: ".5rem" }}
            label="details page"
            onChange={updateDetailsPagePromoText}
            value={hotelData.detailsPagePromoText}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            sx={{ ml: ".5rem" }}
            label="checkout page"
            onChange={updateCheckoutPagePromoText}
            value={hotelData.checkoutPagePromoText}
            fullWidth
            multiline
            rows={2}
          />
        </Typography>
      </Grid>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />

      <Grid item xs={4} sx={{ mt: ".5rem", mb: ".5rem", pl: ".5rem" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#666",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
        >
          DOG AMENITIES &#8212; {hotelData.dogAmenities.length}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
            flexWrap: "wrap",
            border: "1px solid #ddd",
            padding: ".25rem",
            borderRadius: "12px",
            mt: ".5rem",
          }}
        >
          {hotelData.dogAmenities.map((i: any) => {
            if (i.name) {
              return (
                <Chip
                  onDelete={() => removeDogItem(i)}
                  sx={{
                    margin: ".125rem",
                    border: "1px solid #ddd",
                    p: ".125rem",
                  }}
                  key={i.name}
                  label={i.name}
                />
              );
            } else {
              return (
                <Chip
                  onDelete={() => removeDogItem(i)}
                  sx={{
                    margin: ".125rem",
                    border: "1px solid #ddd",
                    p: ".125rem",
                  }}
                  key={i}
                  label={i}
                />
              );
            }
          })}
        </Typography>

        {addDogAmenityField && (
          <Grid
            container
            sx={{ mb: "1rem", pt: "1rem", display: "flex" }}
            spacing={2}
          >
            <Grid item xs={11}>
              <FormControl fullWidth>
                <InputLabel>amenity</InputLabel>
                <Select
                  label="amenity"
                  value={hotelData.city.id}
                  sx={{ minWidth: "200px" }}
                >
                  {dogAmenities &&
                    dogAmenities.adminDogAmenities &&
                    dogAmenities.adminDogAmenities.map((amenity: any) => (
                      <MenuItem
                        onClick={() => addDogItem(amenity)}
                        value={amenity.id}
                      >
                        {amenity.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1} sx={{ display: "flex" }}>
              <Button
                onClick={() => setAddDogAmenityField(false)}
                size="small"
                sx={{ minWidth: "30px" }}
              >
                <Close />
              </Button>
            </Grid>
          </Grid>
        )}

        <Button
          onClick={() => setAddDogAmenityField(!addDogAmenityField)}
          variant="contained"
          sx={{ mt: ".5rem" }}
        >
          {" "}
          Add Dog Amenity{" "}
        </Button>
      </Grid>

      <hr
        style={{
          height: "2px",
          display: "block",
          marginTop: "1rem",
          border: "0px",
          background: "#ddd",
          width: "100%",
        }}
      />
    </Grid>
  );
};

export const Images: FC = () => {
  const [hotelData, setHotelData] = useContext(HotelDataContext);
  const theme = useTheme();

  const [fetchDirectoryImages, { data, loading, error, refetch }] =
    useLazyQuery(IMAGE_DIRECTORY_QUERY, {
      variables: {
        name: hotelData.imageDirectoryName,
        rooms: false,
      },
    });

  const addImage = (i: any) => {
    setHotelData({ ...hotelData, imageURLs: [...hotelData.imageURLs, i] });
  };

  const updateDirectory = (i: any) => {
    setHotelData({ ...hotelData, imageDirectoryName: i.target.value });
  };

  const removeImage = (i: string) => {
    setHotelData({
      ...hotelData,
      imageURLs: hotelData.imageURLs.filter((item: string) => item !== i),
    });
  };

  const setFeatured = (i: string) => {
    setHotelData({ ...hotelData, featuredImageURL: i });
  };

  const fetchDirectory = () => {
    fetchDirectoryImages();
  };

  return (
    <Grid
      container
      sx={{
        boxShadow: 3,
        transition: "all .25s ease-in-out",
        "&:hover": { boxShadow: 5 },
        display: "flex",
        borderRadius: "12px",
        border: "1px solid #ddd",
        background: theme.palette.background.paper,
        flexDirection: { xs: "row", sm: "row" },
        p: "1rem",
      }}
    >
      <Grid item xs={12} sm={12} sx={{ mb: "1rem" }}>
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
          DIRECTORY NAME
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "1rem",
            color: "#222",
            fontWeight: 500,
            fontSize: "1.25rem",
            display: { sm: "block", md: "flex" },
            justifyContent: "space-between",
            fontFamily: "Roboto",
          }}
        >
          <TextField
            value={hotelData.imageDirectoryName}
            onChange={updateDirectory}
            fullWidth
          />
          <Button
            sx={{ minWidth: "200px", ml: "1rem" }}
            onClick={fetchDirectory}
            variant="contained"
          >
            {" "}
            Update Cloud Images{" "}
          </Button>
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
          FEATURED IMAGE
        </Typography>
        <Box
          component="img"
          src={
            hotelData.featuredImageURL.includes("http")
              ? hotelData.featuredImageURL
              : `https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(
                  hotelData.imageDirectoryName
                )}/${hotelData.featuredImageURL.replace("http:", "")}`
          }
          alt={hotelData.featuredImageURL}
          boxShadow={2}
          sx={{
            background: theme.palette.background.paper,
            width: "100%",
            boxShadow: 0,
            mt: "1rem",
            height: { xs: "200px", sm: "350px" },
            objectFit: "cover",
            borderRadius: 3,
            transition: "all .25s linear",
            mx: 0,
            "&:hover": { cursor: "pointer" },
          }}
        ></Box>
      </Grid>

      <Grid item xs={12} sx={{ p: ".5rem 0rem" }}>
        <Accordion elevation={2}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography
              variant="body1"
              sx={{
                mt: "1rem",
                mb: ".5rem",
                fontWeight: 600,
                color: "#666",
                display: { sm: "block", md: "flex" },
                justifyContent: "space-between",
                fontFamily: "Montserrat",
              }}
            >
              VISIBLE IMAGES &#8212; {hotelData.imageURLs.length}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {hotelData.imageURLs.map((src: string) => {
                if (src.includes("http")) {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      key={src}
                      sx={{
                        "& .hide": {
                          userSelect: "none",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          alignItems: "center",
                          "& .option": {
                            "&:hover": { background: "#ffffff" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#ffffffbf",
                            backdropFilter: "blur(6px)",
                            borderRadius: "12px",
                            padding: ".25rem .5rem",
                          },
                          padding: ".5rem",
                          display: "none",
                        },
                        "&:hover": { "& .hide": { display: "flex" } },
                      }}
                    >
                      <Grid
                        sx={{
                          borderRadius: "8px 8px 0px 0px",
                          minHeight: "200px",
                          background: `url("${src}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      >
                        <Grid container className="hide">
                          <Grid
                            className="option"
                            item
                            onClick={() => removeImage(src)}
                          >
                            <HideImage sx={{ mr: ".5rem", fontSize: "20px" }} />{" "}
                            REMOVE
                          </Grid>
                          <Grid
                            className="option"
                            item
                            onClick={() => setFeatured(src)}
                          >
                            <PanoramaWideAngleSelect
                              sx={{ mr: ".5rem", fontSize: "20px" }}
                            />{" "}
                            FEATURE
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          background: "#f1f1f1",
                          borderRadius: "0px 0px 8px 8px",
                          border: "2px solid #ddd",
                          borderTop: "0px",
                          padding: ".25rem 0rem .25rem .5rem",
                        }}
                      >
                        {src}
                      </Grid>
                    </Grid>
                  );
                } else {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      key={src}
                      sx={{
                        "& .hide": {
                          userSelect: "none",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          alignItems: "center",
                          "& .option": {
                            "&:hover": { background: "#ffffff" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#ffffffbf",
                            backdropFilter: "blur(6px)",
                            borderRadius: "12px",
                            padding: ".25rem .5rem",
                          },
                          padding: ".5rem",
                          display: "none",
                        },
                        "&:hover": { "& .hide": { display: "flex" } },
                      }}
                    >
                      <Grid
                        sx={{
                          borderRadius: "8px 8px 0px 0px",
                          minHeight: "200px",
                          background: `url("https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(
                            hotelData.imageDirectoryName
                          )}/${src}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      >
                        <Grid container className="hide">
                          <Grid
                            className="option"
                            item
                            onClick={() => removeImage(src)}
                          >
                            <HideImage sx={{ mr: ".5rem", fontSize: "20px" }} />{" "}
                            REMOVE
                          </Grid>
                          <Grid
                            className="option"
                            item
                            onClick={() => setFeatured(src)}
                          >
                            <PanoramaWideAngleSelect
                              sx={{ mr: ".5rem", fontSize: "20px" }}
                            />{" "}
                            FEATURE
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          background: "#f1f1f1",
                          borderRadius: "0px 0px 8px 8px",
                          border: "2px solid #ddd",
                          borderTop: "0px",
                          padding: ".25rem 0rem .25rem .5rem",
                        }}
                      >
                        {src}
                      </Grid>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Grid item xs={12} sx={{ p: ".5rem 0rem" }}>
        <Accordion elevation={2}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography
              variant="body1"
              sx={{
                mt: "1rem",
                mb: ".5rem",
                fontWeight: 600,
                color: "#666",
                display: { sm: "block", md: "flex" },
                justifyContent: "space-between",
                fontFamily: "Montserrat",
              }}
            >
              ALL GOOGLE CLOUD IMAGES &#8212;{" "}
              {data && data.adminImageDirectory.files.length}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {data &&
                data.adminImageDirectory.files.map((file: any) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      key={file.name}
                      sx={{
                        "& .hide": {
                          ml: "auto",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          alignItems: "center",
                          background: "#ffffffbf",
                          backdropFilter: "blur(6px)",
                          margin: "1rem .5rem",
                          borderRadius: "12px",
                          padding: ".25rem .5rem",
                          display: "none",
                          position: "absolute",
                          "&:hover": { background: "#ffffff" },
                        },
                        "&:hover": { "& .hide": { display: "flex" } },
                      }}
                    >
                      <Grid
                        sx={{
                          borderRadius: "8px 8px 0px 0px",
                          minHeight: "200px",
                          background: `url(" https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(
                            hotelData.imageDirectoryName
                          )}/${file.name}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      >
                        <Grid
                          className="hide"
                          onClick={() => addImage(file.name)}
                        >
                          {" "}
                          <AddPhotoAlternate
                            sx={{ mr: ".5rem", fontSize: "20px" }}
                          />{" "}
                          ADD{" "}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          borderTop: "0px",
                          background: "#f1f1f1",
                          borderRadius: "0px 0px 8px 8px",
                          border: "2px solid #ddd",
                          padding: ".25rem 0rem .25rem .5rem",
                        }}
                      >
                        {file.name}
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};
