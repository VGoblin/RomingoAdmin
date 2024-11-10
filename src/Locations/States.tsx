import { FC } from "react";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ArrowForwardIos } from "@mui/icons-material";
import { StateData } from "../tools/types";

const STATES_QUERY = gql`
  query ($id: String!) {
    adminStates(input: { countryId: $id }) {
      id
      name
    }
  }
`;

export const States: FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    data: states,
  } = useQuery(STATES_QUERY, {
    variables: {
      id: "US",
    },
  });

  return (
    <Grid container>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h5">United States</Typography>
        </Grid>
        <Grid item xs={6} sx={{ padding: "0px" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0rem 1rem 1rem 1rem",
            }}
          ></Grid>
        </Grid>
      </Grid>
      {loading && <CircularProgress sx={{ margin: "5rem auto" }} />}
      {states &&
        states.adminStates.map((item: StateData) => (
          <Grid
            key={item.id}
            item
            className="hotelsCardBox"
            xs={12}
            sx={{ padding: ".5rem", color: "text.primary" }}
          >
            <Grid
              className="hotelsCard"
              onClick={() =>
                navigate(`/locations/states/${item.name}/${item.id}`)
              }
              container
              sx={{
                display: "flex",
                boxShadow: 1,
                "&:hover": { boxShadow: 7, cursor: "pointer" },
                transition: "all .25s ease-in-out",
                p: {
                  xs: ".5rem",
                  sm: ".5rem .5rem .5rem 1rem",
                  md: ".25rem 0rem",
                },
              }}
            >
              <Grid
                item
                xs={11}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    p: ".5rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body2"
                    className="cardTitle"
                    sx={{
                      minHeight: "0px",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowForwardIos />
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};
