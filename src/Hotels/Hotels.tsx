import { FC, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const HOTELS_QUERY = gql`
  query {
    adminProperties {
      id
      name
      city {
        name
      }
    }
  }
`;

export const Hotels: FC = () => {
  const [sortView, setSortView] = useState("3");
  const [sortBy, setSortBy] = useState("hotel");
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(HOTELS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [showSection, setShowSection] = useState<boolean[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (data && data.adminProperties) {
      const cities = data.adminProperties.map((hotel: any) => hotel.city.name)
      const unique = [...new Set(cities)]
      const newGroups = []
      for (let i = 0; i < unique.length; i++) {
        const hotelsByGroup = data.adminProperties.filter((hotel: any) => hotel.city.name === unique[i])
        newGroups.push({
          cityName: unique[i],
          hotels: hotelsByGroup
        })
      }
      newGroups.sort((a: any, b: any) => a.cityName.slice(-2).localeCompare(b.cityName.slice(-2)))
      setGroups(newGroups)
      setLoaded(true)

      const noShow : boolean[] = new Array(groups.length).fill(false)
      setShowSection(noShow)
    }
  }, [data]) 

  const toggleVisibility = (index : number) => {
    const visibility = showSection[index]
    const newState = [...showSection]
    newState[index] = !visibility
    setShowSection(newState)
  }


  if (error) return <> error.... </>;

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ padding: "0px" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0rem 1rem 1rem 1rem",
            }}
          >
            <Grid item>
              <FormControl size="small">
                <InputLabel>View</InputLabel>
                <Select
                  label="view"
                  value={sortView}
                  onChange={(e) => setSortView(e.target.value)}
                  sx={{ minWidth: "200px" }}
                >
                  <MenuItem value="3">3 Wide</MenuItem>
                  <MenuItem value="2">2 Wide</MenuItem>
                  <MenuItem value="1">1 Wide</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                onClick={() => navigate("/hotels/create")}
                variant="contained"
                size="large"
                sx={{ fontWeight: 600 }}
              >
                {" "}
                Create Hotel{" "}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ margin: "5rem auto" }} />}
      </Grid>
      <Grid container>
      {loaded && groups.map((section: any, index: number) => {
        const hotels = section.hotels.map((item: any) => {
          if (item.name === 'DELETED') {
            return <></>
          }
          return (
            <Grid
              key={item.id}
              onClick={() => navigate(`/hotels/${item.id}`)}
              item
              className="hotelsCardBox"
              sx={{ padding: ".5rem", color: "text.primary" }}
            >
              <Grid
                className="hotelsCard"
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
                  sx={{
                    display: "flex",
                    flexDirection: sortView === "1" ? "row" : "column",
                  }}
                >
                  {/* <Box sx={{ borderRadius: '12px', width: sortView === '1' ? '200px' :'100%', border: '1px solid #ddd', height: sortView === '1'?'100%':'150px'}} /> */}

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
                        minHeight:
                          sortView === "3"
                            ? "50px"
                            : sortView === "6"
                            ? "100px"
                            : "0px",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
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
          )
        })
        return(<Grid  item xs={sortView === "3" ? 4 : sortView === "1" ? 12 : 6} key={section.cityName}>
          <Button onClick={() => toggleVisibility(index)}  sx={{ m: '1rem'}} variant="outlined"><h3>{section.cityName}</h3></Button>
          {showSection[index] && hotels}
        </Grid>)
      })}
      </Grid>
    </>
  );
};
