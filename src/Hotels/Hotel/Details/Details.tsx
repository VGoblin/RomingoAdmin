import { FC, useEffect, useState, useContext, useRef } from "react";
import {
  Chip,
  useMediaQuery,
  useTheme,
  Switch,
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
  FormControlLabel,
} from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import { Close, Launch } from "@mui/icons-material";
import { HotelDataContext } from "../HotelContext";
import produce from "immer"

const CITIES_QUERY = gql`
  query Cities {
    cities {
      id
      name
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
  let breakups = useRef([]);
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
  const isMobile = useMediaQuery("(max-width:770px)");

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

  const updateAlias = (i: any) => {
    setHotelData({ ...hotelData, alias: i.target.value });
  };

  const updatePageRank = (i: any) => {
    setHotelData({ ...hotelData, page_rank: i.target.value });
  };

  const updateEmail = (i: any) => {
    setHotelData({ ...hotelData, hotelEmail: i.target.value });
  };

  const updateAlternativeEmail = (i: any) => {
    setHotelData({ ...hotelData, hotelAlternativeEmail: i.target.value });
  };

  const updateBigdog = (i: any) => {
    hotelData.allows_big_dogs
      ? setHotelData({ ...hotelData, allows_big_dogs: 0 })
      : setHotelData({ ...hotelData, allows_big_dogs: 1 });
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

  const updateCity = (i: any) => {
    setHotelData({ ...hotelData, cityId: i.target.value });
  };

  const updateDiscount = (i: any) => {
    hotelData.corporateDiscount
      ? setHotelData({ ...hotelData, corporateDiscount: false })
      : setHotelData({ ...hotelData, corporateDiscount: true });
  };

  const updateSabreId = (i: any) => {
    setHotelData({ ...hotelData, sabreId: i.target.value });
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

  const updatePetData = (e: any) => {
    setHotelData(produce(hotelData, (draft: any) => {
      draft.petFeesData === null && (draft.petFeesData = {})
      switch (e.target.name) {
        case 'perPet':
        case 'perNight':
          draft.petFeesData[e.target.name] = e.target.checked;
          break;
        case 'desc':
          draft.petFeesData[e.target.name] = e.target.value;
          break;
        default:
          draft.petFeesData[e.target.name] = parseInt(e.target.value)
          break;
      }
    }))
  };

  const updatePetDataBreakup = (e: any) => {
    setHotelData(produce(hotelData, (draft: any) => {
      draft.petFeesData === null && (draft.petFeesData = {})
      !draft?.petFeesData?.breakup && (draft.petFeesData.breakup = {})
      draft.petFeesData.breakup[parseInt(e.target.dataset.ref)] = parseInt(e.target.value)
    }));
  }

  const [extraInfo, setExtraInfo] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    getCities();
    getDogAmenities();
  }, []);

  const deleteHotel = async () => {
    console.log('delete hotel')
    try {
      const hotelId = window.location.href.split('/').slice(-1)[0]
      const url = `${process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:4000'}/v2/admin/hotel/${hotelId}?userId=${localStorage.getItem("userId")}`
      console.log(url)
      const result = await fetch(url, { method: "POST" })
      const data = await result.json()
      setExtraInfo(JSON.stringify(data))
    } catch (err) {
      console.log(err)
      setExtraInfo(JSON.stringify(err))
    }

  }

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

      <Grid
        item
        xs={12}
        sm={3}
        sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
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

      <Grid item xs={12} sm={3} sx={{ pl: { xs: 0, sm: 0, md: "1rem" } }}>
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
            checked={hotelData.corporateDiscount}
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

      <Grid
        item
        xs={12}
        sm={3}
        sx={{ pt: "1rem", pl: { xs: 0, sm: 0, md: "1rem" } }}
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
          <Switch onClick={updateBlocked} checked={hotelData.blocked} />
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

      <Grid item xs={12} sm={7} >
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
          <TextField onChange={updateAlias} value={hotelData.alias} fullWidth />
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
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
            onChange={updatePageRank}
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
          <Switch onChange={updateBigdog} checked={hotelData.allows_big_dogs} />
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
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              label="address"
              onChange={updateAddress}
              value={hotelData.addressLine1}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            sx={{
              mb: "1rem",
              pt: { xs: ".5rem", sm: ".5rem", md: "0rem" },
              pl: { xs: "0rem", sm: "0rem", md: "1rem" },
            }}
          >
            <FormControl fullWidth>
              <InputLabel>city</InputLabel>
              <Select
                label="city"
                value={hotelData.cityId}
                onChange={updateCity}
                sx={{ minWidth: "200px" }}
              >
                {cities &&
                  cities.cities &&
                  cities.cities.map((amenitiy: any) => (
                    <MenuItem value={amenitiy.id}>{amenitiy.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            sx={{
              pt: { xs: ".5rem", sm: ".5rem", md: "0rem" },
              pl: { xs: "0rem", sm: "0rem", md: "1rem" },
            }}
          >
            <TextField
              onChange={updateNeighborhood}
              label="neighborhood"
              value={hotelData.neighborhood}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            sx={{
              pt: { xs: ".5rem", sm: ".5rem", md: "0rem" },
              pl: { xs: "0rem", sm: "0rem", md: "1rem" },
            }}
          >
            <TextField
              onChange={updateZipCode}
              label="zip code"
              value={hotelData.zipCode}
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={4} sx={{ pt: { xs: '.5rem', sm: '.5rem', md: '0rem', }, pl: { xs: '0rem', sm: '0rem', md: '1rem' } }}>
          <TextField label='location' fullWidth />
        </Grid> */}
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
            sx={{ mr: { xs: 0, sm: 0, md: ".5rem" } }}
            label="listing page"
            onChange={updatelistingsPagePromoText}
            value={hotelData.listingsPagePromoText}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            sx={{
              ml: { xs: 0, sm: 0, md: ".5rem" },
              mr: { xs: 0, sm: 0, md: ".5rem" },
            }}
            label="details page"
            onChange={updateDetailsPagePromoText}
            value={hotelData.detailsPagePromoText}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            sx={{ ml: { xs: 0, sm: 0, md: ".5rem" } }}
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
          PET POLICY
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
          <Grid
            item
            xs={12}
            sm={2}
            sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
          >
            <TextField
              type="number"
              onChange={updatePetData}
              value={hotelData?.petFeesData?.maxPets}
              label="Maximum Pets"
              name="maxPets"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
          >
            <TextField
              type="number"
              onChange={updatePetData}
              value={hotelData?.petFeesData?.maxWeightPerPetInLBS}
              label="Maximum Weight Per Pet in LBS"
              name="maxWeightPerPetInLBS"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
          >
            <TextField
              type="number"
              onChange={updatePetData}
              value={hotelData?.petFeesData?.totalPrice}
              label="Total Fees"
              name="totalPrice"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
          >
            <FormControlLabel
              control={
                <Switch
                  onChange={updatePetData}
                  checked={hotelData?.petFeesData?.perPet}
                  name="perPet"
                />
              }
              label="Per Pet"
              labelPlacement="top"
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={2}
            sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" } }}
          >
            {/* <Switch onChange={updateAlternativeEmail} value={hotelData.petFeesData.maxPets} /> */}
            <FormControlLabel
              control={
                <Switch
                  onChange={updatePetData}
                  checked={hotelData?.petFeesData?.perNight}
                  name="perNight"
                />
              }
              label="Per Night"
              labelPlacement="top"
            />
          </Grid>

          <Grid item xs={12} sm={8} sx={{ textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" }, marginTop: "23px" }}>
            <TextField
              onChange={updatePetData}
              value={hotelData?.petFeesData?.desc}
              fullWidth
              multiline
              rows={13}
              label="DESCRIPTION"
              name="desc"
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={4}
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
              Breakup
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: "1rem",
                color: "#222",
                fontWeight: 500,
                fontSize: "1.25rem",
                display: { sm: "block", md: "grid" },
                gridTemplateColumns: { md: "auto auto" },
                justifyContent: "space-between",
                fontFamily: "Roboto",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                }}
              >
                <TextField
                  type="number"
                  value="6"
                  fullWidth
                  label="Nights"
                  size="small"
                  ref={breakups.current[6]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                }}
              >
                <TextField
                  label="Price"
                  size="small"
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[6]}
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 6 }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={12}
                  fullWidth
                  label="Nights"
                  size="small"
                />

              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[12]}
                  fullWidth
                  label="Price"
                  size="small"
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 12 }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value="18"
                  fullWidth
                  label="Nights"
                  size="small"
                  ref={breakups.current[18]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  label="Price"
                  size="small"
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[18]}
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 18 }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={24}
                  fullWidth
                  label="Nights"
                  size="small"
                />

              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[24]}
                  fullWidth
                  label="Price"
                  size="small"
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 24 }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value="30"
                  fullWidth
                  label="Nights"
                  size="small"
                  ref={breakups.current[30]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  label="Price"
                  size="small"
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[30]}
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 30 }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={365}
                  fullWidth
                  label="Nights"
                  size="small"
                />

              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "left", pl: { xs: 0, sm: 0, md: "1rem" },
                  maxWidth: { md: "100%" },
                  marginTop: "15px"
                }}
              >
                <TextField
                  type="number"
                  value={hotelData?.petFeesData?.breakup && hotelData?.petFeesData?.breakup[365]}
                  fullWidth
                  label="Price"
                  size="small"
                  onChange={updatePetDataBreakup}
                  inputProps={{ 'data-ref': 365 }}
                />
              </Grid>

            </Typography>
          </Grid>
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

      {/* <Grid item xs={12} sm={12} md={4} sx={{ mt: '.5rem', mb: '.5rem' }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        AMENITIES  &#8212; {hotelData.amenities.length}
      </Typography>
      <Typography variant="body1" sx={{ color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Roboto', flexWrap: 'wrap', border: '1px solid #ddd', padding: '.25rem', borderRadius: '12px', mt: '.5rem'}}>
          {hotelData.amenities.map((i:any) => <Chip onDelete={() => removeHotelItem(i)}  sx={{ margin: '.125rem', border: '1px solid #ddd', p: '.125rem'}}  key={i.desc} label={i.desc} />)}
      </Typography>
      {addAmenity && <Tooltip arrow placement='bottom' open={true} title='enter amenity and press enter'>
        <Box sx={{ mt: '.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <TextField onKeyDown={addHotelItem} fullWidth label='amenity' size='small' />
          <Button onClick={() => setAddAmenity(false)}  size='small' sx={{ minWidth: '30px' }}><Close /></Button>
        </Box>
      </Tooltip>}

      <Button onClick={() => setAddAmenity(!addAmenity)} variant='contained' sx={{ mt: '.5rem'}}> Add Amenity </Button>
    </Grid> */}

      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        sx={{ mt: ".5rem", mb: ".5rem", pl: ".5rem" }}
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
          DOG AMENITIES &#8212;{" "}
          {hotelData && hotelData.dogAmenities && hotelData.dogAmenities.length}
        </Typography>
        <Box
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
          {dogAmenities &&
            hotelData.dogAmenities &&
            dogAmenities.adminDogAmenities
              .filter((amenity: any) => {
                if (hotelData.dogAmenities.includes(amenity.id)) {
                  return amenity;
                }
              })
              .map((item: any) => {
                return (
                  <Chip
                    onDelete={() => removeDogItem(item.id)}
                    sx={{
                      margin: ".125rem",
                      border: "1px solid #ddd",
                      p: ".125rem",
                    }}
                    key={item.name}
                    label={item.name}
                  />
                );
              })}
        </Box>

        {addDogAmenityField && (
          <Grid container sx={{ mb: "1rem", pt: "1rem", display: "flex" }}>
            <Grid item xs={11}>
              <FormControl fullWidth>
                <InputLabel>amenity</InputLabel>
                <Select label="amenity" sx={{ minWidth: "200px" }}>
                  {dogAmenities &&
                    dogAmenities.adminDogAmenities &&
                    dogAmenities.adminDogAmenities.map((amenity: any) => (
                      <MenuItem
                        onClick={() => addDogItem(amenity.id)}
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
      {/*
    <Grid item xs={12} sm={12} md={4} sx={{ mt: '.5rem', mb: '.5rem', pl: '.5rem'}}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        NEARBY ACTIVITIES  &#8212; {hotelData.nearbyActivities.length}
      </Typography>
      <Typography variant="body1" sx={{ color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Roboto', flexWrap: 'wrap', border: '1px solid #ddd', padding: '.25rem', borderRadius: '12px', mt: '.5rem'}}>
        {hotelData.nearbyActivities.slice().sort((a:NearbyActivity, b:NearbyActivity) => a.name > b.name ? 1 : -1).map((i:any) =>
          <Tooltip
            arrow
            data-html="true"
            title={
              <div>
                <b>name: </b>{i.name} <br /> <br />
                <b>overview: </b>{i.overview}  <br /> <br />
                <b>desc: </b>{i.desc}  <br /> <br />
                <b>addressLine1: </b> {i.addressLine1} <br /> <br />
                <b>price: </b> {i.price}  <br /> <br />
                <b>long: </b> {i.location.longitude} <br /> <br />
                <b>lat: </b> {i.location.latitude}
              </div>
            }
          >
            <Chip
              onDelete={() => removeActivity(i)}
              onClick={() => setActivityToChange(i)}
              sx={{ margin: '.125rem', border: '1px solid #ddd', p: '.125rem', '&:hover': { cursor: 'pointer', opacity: .75 }}}
              key={i}
              label={`${i.name}`}
            />
          </Tooltip>)}
      </Typography>
      <AddActivity  />
      {activityToChange && <EditActivity setActivityToChange={setActivityToChange} activityToChange={activityToChange} />}

    </Grid> */}

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

      {!showConfirm && <button onClick={() => setShowConfirm(true)}>DELETE</button>}
      {showConfirm && <button onClick={() => deleteHotel()}>Confirm?</button>}
      <br />
      {extraInfo && <p>{extraInfo}</p>}
    </Grid>
  );
};
