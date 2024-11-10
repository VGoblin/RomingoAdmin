import { FC, useEffect, useState, createContext, useContext } from 'react'
import { useTheme, Typography, TextField, Grid, Button, Box, Accordion, AccordionSummary, AccordionDetails  } from '@mui/material'
import { HideImage, ExpandMore, AddPhotoAlternate, PanoramaWideAngleSelect } from '@mui/icons-material'
import { HotelDataContext } from '../HotelContext'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

const IMAGE_DIRECTORY_QUERY = gql`
query AdminImageDirectory($name: String!, $rooms: Boolean!) {
  adminImageDirectory(input: { name: $name, rooms: $rooms }) {
    name
    files {
      name
    }
  }
}`

export const Images: FC= () => {
  const [hotelData, setHotelData] = useContext(HotelDataContext)
  const theme = useTheme()
  const [fetchDirectoryImages, { data, loading, error, refetch }] = useLazyQuery(IMAGE_DIRECTORY_QUERY, {
    variables: {
      name: hotelData.imageDirectoryName,
      rooms: false
    }
  })

  const removeImage = (i:string) => {
    setHotelData({ ...hotelData, imageFilenames: hotelData.imageFilenames.filter((item: string) => item !== i )})
  }

  const addImage = (i:string) => {
    setHotelData({ ...hotelData, imageFilenames: [ ...hotelData.imageFilenames, i ] })
  }

  const setFeatured = (i:string) => {
    setHotelData({ ...hotelData, featuredImageFilename: i })
  }

  const updateDirectory = (i: any) => {
    setHotelData({ ...hotelData, imageDirectoryName: i.target.value })
  }

  const fetchDirectory = () => {
    fetchDirectoryImages()
  }

  return <Grid container sx={{ boxShadow: 3, transition: 'all .25s ease-in-out', '&:hover': { boxShadow: 5 }, display: 'flex', borderRadius: '12px', border: '1px solid #ddd', background:theme.palette.background.paper, flexDirection: { xs: 'row', sm: 'row' }, p: '1rem'}}>
    <Grid item xs={12} sm={12} sx={{ mb: '1rem' }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        DIRECTORY NAME
      </Typography>
      <Typography variant="body1" sx={{ mt: '1rem', color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Roboto'}}>
        <TextField value={hotelData.imageDirectoryName} onChange={updateDirectory} fullWidth />
        <Button sx={{ minWidth: '200px', ml: '1rem' }} onClick={fetchDirectory} variant='contained'> Update Cloud Images </Button>
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        FEATURED HOTEL IMAGE
      </Typography>
      <Box component="img" src={hotelData.featuredImageFilename.includes('http') ? hotelData.featuredImageURL : `https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(hotelData.imageDirectoryName)}/${(hotelData.featuredImageFilename).replace("http:", "")}`}
        alt={hotelData.featuredImageFilename} boxShadow={2}
        sx={{ background:theme.palette.background.paper, width: "100%", boxShadow: 0, mt: '1rem',
          height: { xs: "200px", sm: "350px" },
          objectFit: 'cover', borderRadius: 3, transition: 'all .25s linear',
          mx: 0, '&:hover': { cursor: 'pointer' }
        }}
      >
      </Box>
    </Grid>
    <Grid item xs={12} sx={{ p: '.5rem 0rem'}}>
      <Accordion elevation={2}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body1" sx={{ mt: '1rem', mb: '.5rem', fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
          VISIBLE IMAGES &#8212; {hotelData.imageFilenames.length}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} >
          {hotelData.imageFilenames.map((src: string, i: number) => {
            if (src.includes('http')) {
              return <Grid item xs={12} sm={12} md={4} key={src + i} sx={{ '& .hide': { userSelect: 'none', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', fontWeight: 600, alignItems: 'center', '& .option': { '&:hover': { background: '#ffffff' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffffbf', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '.25rem .5rem', }, padding: '.5rem', display: 'none',  }, '&:hover': { '& .hide': { display: 'flex' }}, }}>
              <Grid sx={{ borderRadius: '8px 8px 0px 0px', minHeight: '200px', background: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center center',  }}>
                <Grid container className='hide'>
                  <Grid className='option' item onClick={() => removeImage(src)}>
                    <HideImage sx={{ mr: '.5rem', fontSize: '20px' }} /> REMOVE
                  </Grid>
                  <Grid className='option' item onClick={() => setFeatured(src)} >
                    <PanoramaWideAngleSelect sx={{ mr: '.5rem', fontSize: '20px' }} /> FEATURE
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ background: '#f1f1f1', borderRadius: '0px 0px 8px 8px', border: '2px solid #ddd',  borderTop: '0px', padding: '.25rem 0rem .25rem .5rem' }}>
                {src}
              </Grid>
            </Grid>
            }
            else {
              return <Grid item xs={12} sm={12} md={4} key={src + i} sx={{ '& .hide': { userSelect: 'none', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', fontWeight: 600, alignItems: 'center', '& .option': { '&:hover': { background: '#ffffff' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffffbf', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '.25rem .5rem', }, padding: '.5rem', display: 'none',  }, '&:hover': { '& .hide': { display: 'flex' }}, }}>
              <Grid sx={{ borderRadius: '8px 8px 0px 0px', minHeight: '200px', background: `url("https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(hotelData.imageDirectoryName)}/${src}")`, backgroundSize: 'cover', backgroundPosition: 'center center',  }}>
                <Grid container className='hide'>
                  <Grid className='option' item onClick={() => removeImage(src)}>
                    <HideImage sx={{ mr: '.5rem', fontSize: '20px' }} /> REMOVE
                  </Grid>
                  <Grid className='option' item onClick={() => setFeatured(src)} >
                    <PanoramaWideAngleSelect sx={{ mr: '.5rem', fontSize: '20px' }} /> FEATURE
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{  background: '#f1f1f1', borderRadius: '0px 0px 8px 8px', border: '2px solid #ddd', borderTop: '0px', padding: '.25rem 0rem .25rem .5rem' }}>
                {src}
              </Grid>
            </Grid>
            }
          })}
        </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>

    <Grid item xs={12} sx={{ p: '.5rem 0rem'}}>
      <Accordion elevation={2}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body1" sx={{ mt: '1rem', mb: '.5rem', fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
          ALL GOOGLE CLOUD IMAGES &#8212; {data && data.adminImageDirectory.files.length}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2} >
          {data && data.adminImageDirectory.files.map((file: any) => {
              return <Grid item xs={12} sm={12} md={4} key={file.name} sx={{ '& .hide': { ml: 'auto', cursor: 'pointer', fontSize: '12px', fontWeight: 600, alignItems: 'center', background: '#ffffffbf', backdropFilter: 'blur(6px)', margin: '1rem .5rem', borderRadius: '12px', padding: '.25rem .5rem', display: 'none', position: 'absolute', '&:hover': { background: '#ffffff' } }, '&:hover': { '& .hide': { display: 'flex' }} }}>
                <Grid sx={{ borderRadius: '8px 8px 0px 0px', minHeight: '200px', background: `url(" https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(hotelData.imageDirectoryName)}/${file.name}")`, backgroundSize: 'cover', backgroundPosition: 'center center',  }}>
                  <Grid className='hide' onClick={() => addImage(file.name)}> <AddPhotoAlternate sx={{ mr: '.5rem', fontSize: '20px' }} /> ADD </Grid>
                </Grid>
                <Grid item sx={{ background: '#f1f1f1', borderRadius: '0px 0px 8px 8px', border: '2px solid #ddd', borderTop: '0px', padding: '.25rem 0rem .25rem .5rem' }}>
                  {hotelData.imageFilenames.find((name: string) => name === file.name) ? 'already added' : file.name}
                </Grid>
              </Grid>
            })}
        </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>

    {/* <Grid item xs={12} sx={{ p: '.5rem 0rem'}}>
      <Typography variant="body1" sx={{ mt: '1rem', mb: '.5rem', fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        SABRE IMAGES &#8212; {hotelData.sabreImageURLs.length}
      </Typography>
    </Grid>
    <Grid item xs={12} sx={{ display: 'flex', flexWrap: 'wrap', overflowY: 'auto' }}>
      {hotelData.sabreImageURLs.map((src: string) => {
          return <Grid key={src} sx={{ '& .hide': { fontWeight: 600, alignItems: 'center', background: '#fffff80', backdropFilter: 'blur(6px)', margin: '.5rem', display: 'none', position: 'absolute' }, '&:hover': { '& .hide': { display: 'flex' }} }}>
              <Grid className='hide'> <HideImage sx={{ mr: '.5rem' }} /> VISIBLE </Grid>
              <img style={{ maxHeight: '200px', margin: '.5rem .5rem .5rem 0rem' }}  src={src} />
          </Grid>
        })}
    </Grid> */}
  </Grid>
}
