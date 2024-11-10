import { FC, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { uuid } from "uuidv4";
import {
  Grid,
  Typography,
  CircularProgress,
  Fab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Box,
} from "@mui/material";
import { SaveRounded } from "@mui/icons-material";

import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import stylesArray from "./GoogleMapStyles";

const CITY_QUERY = gql`
  query ($id: String!) {
    adminCity(input: { id: $id }) {
      id
      name
      blocked
      center {
        latitude
        longitude
      }
      zoom
      state {
        id
        code
        name
        country {
          id
          name
        }
      }
    }
  }
`;

const STATES_QUERY = gql`
  query ($id: String!) {
    adminStates(input: { countryId: $id }) {
      id
      name
    }
  }
`;

const mapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControlOptions: { position: 7 },
  keyboardShortcuts: false,
  styles: stylesArray,
};

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 59px)",
};

const CREATE_CITY = gql`
  mutation AdminCreateCity($input: AdminCreateCityInput!) {
    adminCreateCity(input: $input) {
      id
    }
  }
`;

const UPDATE_CITY = gql`
  mutation AdminUpdateCity($input: AdminUpdateCityInput!) {
    adminUpdateCity(input: $input) {
      id
    }
  }
`;

export const City: FC = () => {
  const [mapRef, setMapRef] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const { id, name, state } = useParams();
  const [form, setForm] = useState({
    id: "",
    name: "",
    state: { name: state, id: "" },
    center: { latitude: 39.8295817848248, longitude: -98.57711931288252 },
    zoom: 4,
    blocked: false,
  });
  // const [updateCity] = useMutation(UPDATE_CITY);

  const [getCity, { loading, data: city }] = useLazyQuery(CITY_QUERY, {
    variables: {
      id: id,
    },
    fetchPolicy: "no-cache",
  });

  const [createCity, { data: create_city_data }] = useMutation(CREATE_CITY);
  const [updateCity, { data: update_city_data }] = useMutation(UPDATE_CITY);

  const { data: states } = useQuery(STATES_QUERY, {
    variables: {
      id: "US",
    },
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAnlMeQQ072sRw22U6aG0zLTHbyh0g8TB0",
  });

  useEffect(() => {
    id ? getCity() : setLoaded(true);
  }, []);

  useEffect(() => {
    if (create_city_data?.adminCreateCity?.id) {
      setForm({ ...form, id: create_city_data?.id });
    }
  }, [create_city_data]);

  useEffect(() => {
    if (states && states.adminStates && state) {
      const match = states.adminStates.find((s: any) => s.name === state);
      setForm({ ...form, state: match });
    }
  }, [states, state]);

  useEffect(() => {
    if (city?.adminCity) {
      setForm(city?.adminCity);
      setLoaded(true);
    }
  }, [city]);

  const updateField = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateLatitude = (e: any) => {
    setForm({
      ...form,
      center: { ...form.center, latitude: parseFloat(e.target.value) },
    });
  };

  const updateLongitude = (e: any) => {
    setForm({
      ...form,
      center: { ...form.center, longitude: parseFloat(e.target.value) },
    });
  };

  const updateZoom = (e: any) => {
    console.log(e.target.value);
    setForm({
      ...form,
      zoom: parseInt(e.target.value) || 4,
    });
  };

  const updateBlocked = (e: any) => {
    setForm({ ...form, blocked: e.target.checked });
  };

  const setNewCenter = () => {
    if (!mapRef) return;
    const newCenter = mapRef?.getCenter().toJSON();
    if (
      newCenter.lat !== form.center.latitude ||
      newCenter.lng !== form.center.longitude
    ) {
      setForm({
        ...form,
        center: { latitude: newCenter.lat, longitude: newCenter.lng },
      });
    }
  };

  const setNewZoom = () => {
    if (!mapRef) return;
    const newZoom = mapRef?.getZoom();
    if (newZoom !== form.zoom) {
      setForm({
        ...form,
        zoom: parseInt(newZoom),
      });
    }
  };

  const handleUpdateCity = () => {
    if (form.name.length === 0) return;
    if (id) {
      updateCity({
        variables: {
          input: {
            id: id,
            name: form.name,
            center: {
              latitude: form.center.latitude,
              longitude: form.center.longitude,
            },
            zoom: form.zoom,
            blocked: form.blocked,
            stateId: form.state?.id,
          },
        },
      });
    } else {
      createCity({
        variables: {
          input: {
            name: form.name,
            center: {
              latitude: form.center.latitude,
              longitude: form.center.longitude,
            },
            zoom: form.zoom,
            blocked: form.blocked,
            stateId: form.state?.id,
          },
        },
      });
    }
  };

  return (
    <>
      {id && loading && <CircularProgress sx={{ margin: "5rem auto" }} />}
      {isLoaded && loaded && (
        <Box
          sx={{
            mt: "-40px",
            mx: "calc(50% - 50vw)",
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 0 }}>
              <GoogleMap
                onLoad={(map) => setMapRef(map)}
                onCenterChanged={setNewCenter}
                onZoomChanged={setNewZoom}
                mapContainerStyle={containerStyle}
                center={{
                  lat: form.center.latitude,
                  lng: form.center.longitude,
                }}
                options={mapOptions}
                zoom={form.zoom}
              />
            </Grid>
            <Grid item xs={12} md={5} mt={2} sx={{ px: "20px", pb: "10px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">{name}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="h6">Blocked</Typography>
                  <Switch onClick={updateBlocked} checked={form?.blocked} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="id"
                    name="id"
                    onChange={updateField}
                    value={form.id || city?.adminCity?.id || "save to generate"}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="city name"
                    name="name"
                    onChange={updateField}
                    value={form?.name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>state</InputLabel>
                    <Select
                      label="state"
                      name="state"
                      value={form?.state}
                      renderValue={(s) => s.name}
                      onChange={updateField}
                      sx={{ minWidth: "200px" }}
                    >
                      {states &&
                        states.adminStates &&
                        states.adminStates.map((s: any) => (
                          <MenuItem key={s.id} value={s}>
                            {s.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5">Map Display</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Center</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="latitude"
                    name="center.latitude"
                    type="number"
                    onChange={updateLatitude}
                    value={form?.center?.latitude}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="longitude"
                    name="center.longitude"
                    type="number"
                    onChange={updateLongitude}
                    value={form?.center?.longitude}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    label="zoom"
                    name="zoom"
                    InputProps={{ inputProps: { min: 4, max: 20 } }}
                    onChange={updateZoom}
                    value={form?.zoom}
                    sx={{ minWidth: "100px" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
      <Fab
        onClick={handleUpdateCity}
        color="primary"
        sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
      >
        <SaveRounded />
      </Fab>
    </>
  );
};
