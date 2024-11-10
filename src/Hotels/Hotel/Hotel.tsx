import { FC, useEffect, useState, createContext, useContext } from "react";
import {
  Chip,
  Paper,
  Container,
  useTheme,
  Typography,
  Fab,
  Dialog,
  Grid,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  Box,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Close, SaveRounded, Check, ErrorRounded } from "@mui/icons-material";
import { HotelDataContext } from "./HotelContext";
import { Details } from "./Details/Details";
import { Images } from "./Images/Images";
import { Rooms } from "./Rooms/Rooms";
import { HotelData } from "../../tools/types";

const HOTEL_QUERY = gql`
  query ($id: String!) {
    adminProperty(input: { id: $id }) {
      id
      name
      desc
      sabreId
      addressLine1
      zipCode
      neighborhood
      romingoScore
      dogAmenities
      featuredImageFilename
      imageFilenames
      cityId
      imageDirectoryName
      listingsPagePromoText
      detailsPagePromoText
      checkoutPagePromoText
      googlePlaceId
      corporateDiscount
      blocked
      alias
      page_rank
      allows_big_dogs
      hotelEmail
      hotelAlternativeEmail
      petFeesData
    }
  }
`;

const UPDATE_HOTEL = gql`
  mutation AdminUpdateProperty(
    $id: String!
    $cityId: String!
    $corporateDiscount: Boolean!
    $sabreId: String!
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
    $alias: String!
    $page_rank: Int!
    $allows_big_dogs:Int
    $hotelEmail:String
    $hotelAlternativeEmail: String
    $petFeesData: String
  ) {
    adminUpdateProperty(
      input: {
        id: $id
        cityId: $cityId
        corporateDiscount: $corporateDiscount
        sabreId: $sabreId
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
        alias: $alias
        page_rank: $page_rank
        allows_big_dogs: $allows_big_dogs
        hotelEmail: $hotelEmail
        hotelAlternativeEmail: $hotelAlternativeEmail
        petFeesData: $petFeesData
      }
    ) {
      id
      lowestAveragePrice
    }
  }
`;

export const Hotel: FC = () => {
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState<HotelData>();
  const [initialData, setInitialData] = useState<HotelData>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(
    localStorage.getItem("currentTab") || "details"
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const { id } = useParams();
  const theme = useTheme();
  const [
    updateHotel,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_HOTEL);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const { loading, error, data } = useQuery(HOTEL_QUERY, {
    variables: {
      id: id,
    },
  });

  const handleUpdateHotel = () => {
    if (hotelData !== undefined) {
      if (
        hotelData.cityId!.length > 0 &&
        hotelData.sabreId!.length > 0 &&
        hotelData.name!.length > 0 &&
        hotelData.desc!.length > 0 &&
        hotelData.addressLine1!.length! > 0 &&
        hotelData.zipCode!.length > 0 &&
        hotelData.neighborhood!.length > 0 &&
        hotelData.romingoScore! > 0 &&
        hotelData.listingsPagePromoText &&
        hotelData.detailsPagePromoText &&
        hotelData.checkoutPagePromoText
      ) {
        if (
          hotelData.imageDirectoryName!.length > 0 &&
          hotelData.imageFilenames!.length > 0 &&
          hotelData.featuredImageFilename!.length > 0
        ) {
          setSaving(true);
          setTimeout(() => {
            updateHotel({
              variables: {
                id: id,
                cityId: hotelData.cityId && hotelData.cityId,
                corporateDiscount: hotelData.corporateDiscount,
                sabreId: hotelData.sabreId,
                name: hotelData.name,
                desc: hotelData.desc,
                addressLine1: hotelData.addressLine1,
                zipCode: hotelData.zipCode,
                neighborhood: hotelData.neighborhood,
                romingoScore: hotelData.romingoScore
                  ? parseFloat(hotelData.romingoScore.toString())
                  : 1,
                dogAmenities: hotelData && hotelData.dogAmenities,
                imageDirectoryName: hotelData.imageDirectoryName,
                featuredImageFilename: hotelData.featuredImageFilename,
                imageFilenames: hotelData.imageFilenames,
                googlePlaceId: hotelData.googlePlaceId || "",
                blocked: hotelData.blocked,
                listingsPagePromoText: hotelData.listingsPagePromoText,
                detailsPagePromoText: hotelData.detailsPagePromoText,
                checkoutPagePromoText: hotelData.checkoutPagePromoText,
                alias: hotelData.alias,
                allows_big_dogs: hotelData.allows_big_dogs,
                hotelEmail: hotelData.hotelEmail,
                hotelAlternativeEmail: hotelData.hotelAlternativeEmail,
                page_rank: hotelData.page_rank? parseFloat(hotelData.page_rank.toString())
                : 1,
                petFeesData: hotelData.petFeesData && JSON.stringify(hotelData.petFeesData) 
              },
            }).then(() => {
              setSaved(true);
              window.location.reload();
            });
          }, 2000);
        } else {
          setErrorMessage(
            "All images must be added before you can create a hotel."
          );
        }
      } else {
        setErrorMessage(
          "All hotel details need to be filled in before you can create a hotel. The only optional field is google place ID"
        );
      }
    }
  };

  useEffect(() => {
    if (data && data.adminProperty) setInitialData({ ...data.adminProperty });
  }, [data]);

  useEffect(() => {
    setHotelData(initialData);
  }, [initialData]);

  useEffect(() => {
    localStorage.setItem("currentTab", currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (saving) {
      setTimeout(() => {
        setSaved(true);
      }, 2000);
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
        <Grid container spacing={1}>
          {loading && <CircularProgress sx={{ margin: "0px auto" }} />}

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
                minWidth: "325px",
                background: "#11111140",
                fontWeight: 600,
                backdropFilter: "blur(6px)",
                fontSize: "20px",
              }}
            >
              <Grid
                sx={{
                  background: theme.palette.background.paper,
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
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
                    <Check sx={{ margin: "1rem auto", fontSize: "40px" }} />{" "}
                    Saving Complete
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
                    Saving Changes
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
                  <ErrorRounded
                    sx={{ margin: "1rem auto", fontSize: "40px" }}
                  />{" "}
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

          {hotelData && (
            <Grid item xs={12}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  sx={{ margin: "0px auto", mb: "1rem", mt: "1rem" }}
                >
                  <ButtonGroup fullWidth>
                    <Button
                      variant={
                        currentTab === "images" ? "contained" : "outlined"
                      }
                      onClick={() => setCurrentTab("images")}
                    >
                      HOTEL IMAGES
                    </Button>
                    <Button
                      variant={
                        currentTab === "details" ? "contained" : "outlined"
                      }
                      onClick={() => setCurrentTab("details")}
                    >
                      HOTEL DETAILS
                    </Button>
                    <Button
                      variant={
                        currentTab === "rooms" ? "contained" : "outlined"
                      }
                      onClick={() => setCurrentTab("rooms")}
                    >
                      ROOMS
                    </Button>
                  </ButtonGroup>
                </Grid>

                {currentTab === "images" && <Images />}
                {currentTab === "details" && <Details />}
                {currentTab === "rooms" && <Rooms />}
              </Grid>
            </Grid>
          )}
          <Fab
            disabled={initialData == hotelData}
            onClick={handleUpdateHotel}
            color="primary"
            sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
          >
            <SaveRounded />
          </Fab>
        </Grid>
      </Container>
    </HotelDataContext.Provider>
  );
};
