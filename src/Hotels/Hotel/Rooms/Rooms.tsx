import { FC, useState } from 'react'
import { ArrowForwardIos } from '@mui/icons-material'
import { Box, Grid, Typography, Select, FormControl, InputLabel, MenuItem, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

const ROOMS_QUERY = gql`
  query($propertyId: String! ) {
    adminRooms(input: { propertyId: $propertyId } ) {
      id
      name
      sabreNames
      areaInSquareFeet
    }
  }
`

export const Rooms: FC = () => {
  const [sortView, setSortView] = useState('1')
  const [sortBy, setSortBy] = useState('hotel')
  const navigate = useNavigate()
  const { id } = useParams()

  const { loading, error, data } = useQuery(ROOMS_QUERY, {
    fetchPolicy: 'network-only',
    variables: { propertyId: id }
  })

  return <Grid container spacing={1}>
    <Button onClick={() => navigate(`/hotels/${id}/rooms/create`)} variant='contained' sx={{ ml: 'auto', mb: '1rem' }}> Create new room </Button>

    {data && data.adminRooms.length < 1 && <Grid container sx={{display: "flex", boxShadow: 1, transition: 'all .25s ease-in-out', p: { xs: '.5rem', sm: '.5rem .5rem .5rem 1rem', md: '.125rem 0rem'}, }}>

      <Grid item xs={12}>
        {/* <Box sx={{ borderRadius: '12px', width: sortView === '1' ? '200px' :'100%', border: '1px solid #ddd', height: sortView === '1'?'100%':'150px'}} /> */}
        <Box sx={{ p: '.5rem', justifyContent: 'center', display: 'flex',  }}>
          <Typography variant="body2">
            There are no rooms in the database. Click to create one.
          </Typography>
        </Box>
        </Grid>
    </Grid>}


    {data && data.adminRooms.length > 0 && data.adminRooms.slice().sort((a: any, b:any) => (sortBy === 'hotel' ? (a.name > b.name) : (a.id > b.id)) ? 1 : -1).map((item:any) => <Grid onClick={() => navigate(`/hotels/${id}/rooms/${item.id}`)} item xs={sortView === '3' ? 4 : sortView === '1' ? 12 : 2} className='hotelsCardBox' sx={{ padding: '.5rem', color: "text.primary", }}>

        <Grid className='hotelsCard' container sx={{display: "flex", boxShadow: 1, '&:hover': { boxShadow: 7, cursor: 'pointer' },transition: 'all .25s ease-in-out', p: { xs: '.5rem', sm: '.5rem .5rem .5rem 1rem', md: '.125rem 0rem'}, }}>

            <Grid item xs={11} sx={{  display: 'flex', flexDirection: sortView === '1' ? 'row':'column'}}>
              {/* <Box sx={{ borderRadius: '12px', width: sortView === '1' ? '200px' :'100%', border: '1px solid #ddd', height: sortView === '1'?'100%':'150px'}} /> */}

              <Box sx={{ p: '.5rem', display: 'flex', flexDirection: 'column'}}>
                <Typography variant="body2" className='cardTitle'>
                  {item.name}
                </Typography>

                <Typography variant="body2" className='cardSubtitle' sx={{ fontSize: { xs: "95%", sm: "90%" }, mt: { xs: '.25rem', sm: '.125rem'}, mb: { xs: '.5rem', md: '0'} }}>
                 {item.areaInSquareFeet} sq. ft.
                </Typography>

                <Typography variant="body2" className='cardDescription' sx={{ mb: { xs: '.5rem', md: '0'}, fontSize: { xs: "95%", sm: "90%" }, mt: { xs: '.25rem', sm: '.125rem'}, }}>
                  {item.sabreNames.join('')}
                </Typography>
              </Box>


              </Grid>
              <Grid item xs={1} sx={{  justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                  <ArrowForwardIos />
              </Grid>
            </Grid>

      </Grid>)}
  </Grid>
}