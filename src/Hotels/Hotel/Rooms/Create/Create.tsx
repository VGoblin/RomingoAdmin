import { FC, useEffect, useState, createContext, useContext } from 'react'
import { Box, Switch, Accordion,Container, Fab, Grid, CircularProgress, Button, ButtonGroup, Typography, TextField, useTheme, AccordionSummary, AccordionDetails } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { SaveRounded, Check, HideImage, PanoramaWideAngleSelect, ExpandMore, AddPhotoAlternate, ErrorRounded } from '@mui/icons-material'
import { HotelRoomContext } from '../RoomContext'
import { RoomData } from '../../../../tools/types'
import { SabreRooms } from '../SabreRooms'

const CREATE_ROOM =  gql`
  mutation AdminCreateRoom(
    $propertyId: String!,
    $sabreNames: [String!]!,
    $sabreTexts: [String!]!,
    $name: String!,
    $blocked: Boolean!,
    $areaInSquareFeet: Int!,
    $featuredImageFilename: String!,
    $imageFilenames: [String!]!) {
      adminCreateRoom(input: {
        propertyId: $propertyId,
        sabreNames: $sabreNames,
        sabreTexts: $sabreTexts,
        name: $name,
        blocked: $blocked,
        areaInSquareFeet: $areaInSquareFeet,
        featuredImageFilename: $featuredImageFilename,
        imageFilenames: $imageFilenames,
      }) {
        id
      }
  }
`

const HOTEL_QUERY = gql`
query ( $id: String!) {
  adminProperty(input: { id: $id }) {
    id name desc sabreId addressLine1 zipCode  neighborhood romingoScore dogAmenities featuredImageFilename
    imageFilenames
    cityId
    imageDirectoryName
  }
}`


interface AbsorbHotelData {
  hotelData: any
}

const CreateRoom: FC<AbsorbHotelData> = ({ hotelData }) => {
  const navigate = useNavigate()
  const [roomData, setRoomData] = useState<RoomData>({
    name: '',
    areaInSquareFeet: 0,
    featuredImageFilename: '',
    imageFilenames: [],
    sabreText: '',
    sabreName: '',
    hotelImageDirectoryName: hotelData.adminProperty.imageDirectoryName,
    blocked: false
  })

  const [initialData, setInitialData] = useState<RoomData>()
  const [createRoom] = useMutation(CREATE_ROOM)
  const [currentTab, setCurrentTab] = useState<string>(localStorage.getItem('currentTab') || 'details')
  const [saving, setSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<any>(null)
  const { id } = useParams()

  useEffect(() => {
    localStorage.setItem('currentTab', currentTab)
  }, [currentTab])

  useEffect(() => {
    if (currentTab !== 'details' || 'images') {
      setCurrentTab('details')
    }
  }, [])

  const handleCreateRoom = () => {
    if ( (roomData.sabreName && roomData.sabreName!.length > 0) || ( roomData.sabreText && roomData.sabreText!.length > 0) ) {
      if ( (roomData.featuredImageFilename.length > 0) && (roomData.imageFilenames.length > 0) ) {
        if ((roomData.name.length > 0) && (roomData.areaInSquareFeet > 0) ) {
            setSaving(true)
            setTimeout(() => {
              createRoom({ variables: {
                propertyId: id,
                sabreNames: roomData.sabreName ? [roomData.sabreName] : [],
                sabreTexts: roomData.sabreText ? [roomData.sabreText] : [],
                name: roomData.name,
                areaInSquareFeet: parseFloat(roomData.areaInSquareFeet.toString()),
                featuredImageFilename: roomData.featuredImageFilename,
                imageFilenames: roomData.imageFilenames,
                blocked: roomData.blocked
              }
              }).then(() => {
                setTimeout(() => {
                  navigate(`/hotels/${id}`)
                }, 250)
              })
            }, 2000)
        }
        else {
          setErrorMessage('Room name and area in square feet must be added before you can create a room.')
        }
       }
       else {
        setErrorMessage('All images must be added before you can create a room.')
       }
    }
    else {
      setErrorMessage('All sabre data needs to be filled in before you can create a room.')
    }
  }

  useEffect(() => {
    if (saving) {
      setTimeout(() => {
        setSaved(true)
      }, 2000)
    }
    else {
      setSaved(false)
    }
  }, [saving])

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaving(false)
      }, 2000)
    }
  }, [saved])

  return <HotelRoomContext.Provider value={[roomData, setRoomData]}>
    <Container maxWidth='xl'>
      <Grid container spacing={1}>

        {saving &&
          <Grid sx={{ position: 'fixed', top: '0px', left: '0px', right: '0px', zIndex: 1401, bottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '325px', background: '#11111140', fontWeight: 600, color: '#111', backdropFilter: 'blur(6px)', fontSize: '20px'}}>
            <Grid sx={{ background: '#ffffffbf', padding: '1rem 2.5rem', borderRadius: '12px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'}}>
              {saved?
                <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Check sx={{ margin: '1rem auto', fontSize: '40px' }} /> Saving Complete
                </Grid> :
                <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress sx={{ color: '#111', margin: '1rem auto', height: '25px' }} /> Saving Changes
                </Grid>
              }
            </Grid>
          </Grid>
        }

      {errorMessage &&
          <Grid sx={{ position: 'fixed', top: '0px', left: '0px', right: '0px', zIndex: 1401, bottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '325px', background: '#11111140', fontWeight: 600, color: '#111', backdropFilter: 'blur(6px)', fontSize: '20px'}}>
            <Grid sx={{ background: '#ffffffbf', maxWidth: '350px', padding: '1rem 2.5rem', borderRadius: '12px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'}}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <ErrorRounded sx={{ margin: '1rem auto', fontSize: '40px' }} /> {errorMessage}
              </Grid>
              <Grid sx={{ width: '100%', display: 'flex', pt: '1rem', justifyContent: 'center' }}>
                <Button variant='contained' onClick={() => setErrorMessage(null)}> Ok </Button>
              </Grid>
            </Grid>
          </Grid>
        }

        {roomData &&

          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} sx={{ margin: '0px auto', mb: '1rem', mt: '1rem' }}>
                <ButtonGroup fullWidth>
                  <Button variant={currentTab === 'images' ? 'contained' : 'outlined'} onClick={() => setCurrentTab('images')}>
                    ROOM IMAGES
                  </Button>
                  <Button variant={currentTab === 'details' ? 'contained' : 'outlined'} onClick={() => setCurrentTab('details')}>
                    ROOM DETAILS
                  </Button>
                  <Button variant={currentTab === 'rooms' ? 'contained' : 'outlined'} onClick={() => navigate(`/hotels/${id}`)}>
                    HOTEL
                  </Button>
                </ButtonGroup>
              </Grid>

              <Grid container>
                <Grid item xs={12} sm={12} md={3} sx={{ pr: '1rem' }}>
                  <SabreRooms />
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                  {currentTab === 'images' && <Images />}
                  {currentTab === 'details' && <Details />}
                </Grid>
              </Grid>

            </Grid>

          </Grid>
        }

      <Fab disabled={ initialData == roomData } onClick={handleCreateRoom} color='primary' sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}> <SaveRounded /> </Fab>
      </Grid>
    </Container>
  </HotelRoomContext.Provider>
}

export const CreateRoomWrapper = () => {
  const route = useParams()
  const { id } = route
  const { loading, error, data } = useQuery(HOTEL_QUERY, {
    variables: { id: id }
  })

  if (data) return <CreateRoom hotelData={data} />
  else return <></>
}


export const Details: FC = () => {
  const [roomData, setRoomData] = useContext(HotelRoomContext)
  const theme = useTheme()

  const updateName = (i: any) => {
    setRoomData({ ...roomData, name: i.target.value })
  }

  const updateArea = (i: any) => {
    setRoomData({ ...roomData, areaInSquareFeet: i.target.value })
  }

  const updateRoomType = (i: any) => {
    setRoomData({ ...roomData, sabreName: i.target.value })
  }

  const updateSabreText = (i: any) => {
    setRoomData({ ...roomData, sabreText: i.target.value })
  }

  const updateBlocked = (i: any) => {
    roomData.blocked ? setRoomData({ ...roomData, blocked: false }) : setRoomData({ ...roomData, blocked: true })
  }

  return <Grid container sx={{ boxShadow: 3, transition: 'all .25s ease-in-out', '&:hover': { boxShadow: 5 }, display: 'flex', borderRadius: '12px', border: '1px solid #ddd', background: theme.palette.background.paper, flexDirection: { xs: 'column', sm: 'row' }, p: '1rem'}}>
    <Grid item xs={12} sm={6}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        ROOM NAME
      </Typography>
      <Typography variant="body1" sx={{ mt: '1rem', color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Roboto'}}>
        <TextField value={roomData.name} onChange={updateName} fullWidth />
      </Typography>
    </Grid>

    <Grid item xs={12} sm={3} sx={{ textAlign: 'left', pl: '1rem' }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        AREA (SQ FT)
      </Typography>
      <Typography variant="h6" sx={{ mt: '1rem', color: "warning.main", mr: {sm: '0rem', xs: 'auto'}, }}>
        <TextField type='number' onChange={updateArea} value={roomData && roomData.areaInSquareFeet} fullWidth />
      </Typography>
      </Grid>
      <Grid item xs={12} sm={3} sx={{ pt: '1rem', pl: '1rem',}}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'center', fontFamily: 'Montserrat'}}>
          BLOCKED
        </Typography>
        <Typography variant="body1" sx={{ mt: '1rem', color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'center', fontFamily: 'Roboto'}}>
          <Switch onClick={updateBlocked} value={roomData.blocked} />
        </Typography>
    </Grid>

    <hr style={{ height: '2px', display: 'block', marginTop: '1rem', border: '0px', background: '#ddd', width: '100%'}} />

    <Grid item xs={12} sx={{ mt: '.5rem', mb: '.5rem' }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        SABRE DATA
      </Typography>
      <Typography variant="body1" sx={{mt: '1rem', color: "#222", fontWeight: 500, fontSize: '1.25rem', display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Roboto'}}>
        <TextField sx={{ mr: '1rem' }} label='room name (type)' fullWidth onChange={updateRoomType} value={roomData && roomData.sabreName || ''} />
        <TextField label='room text (desc)' fullWidth onChange={updateSabreText} value={roomData && roomData.sabreText || ''} />
      </Typography>
    </Grid>

  </Grid>
}

const IMAGE_DIRECTORY_QUERY = gql`
query AdminImageDirectory($name: String!, $rooms: Boolean!) {
  adminImageDirectory(input: { name: $name, rooms: $rooms }) {
    name
   files {
      name
    }
    directories {
      name
      files {
        name
      }
    }
  }
}`

export const Images: FC= () => {
  const [roomData, setRoomData] = useContext(HotelRoomContext)
  const theme = useTheme()
  const [fetchDirectoryImages, { data, loading, error, refetch }] = useLazyQuery(IMAGE_DIRECTORY_QUERY, {
    variables: {
      name: roomData.hotelImageDirectoryName,
      rooms: true
    }
  })

  const removeImage = (i:string) => {
    setRoomData({ ...roomData, imageFilenames: roomData.imageFilenames.filter((item: string) => item !== i )})
  }

  const addImage = (i:string) => {
    setRoomData({ ...roomData, imageFilenames: [ ...roomData.imageFilenames, i ] })
  }

  const setFeatured = (i:string) => {
    setRoomData({ ...roomData, featuredImageFilename: i })
  }

  useEffect(() => {
    fetchDirectoryImages()
  }, [])

  return <Grid container sx={{ boxShadow: 3, transition: 'all .25s ease-in-out', '&:hover': { boxShadow: 5 }, display: 'flex', borderRadius: '12px', border: '1px solid #ddd', background:theme.palette.background.paper, flexDirection: { xs: 'column', sm: 'row' }, p: '1rem'}}>
    <Grid item xs={12}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#666", display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', fontFamily: 'Montserrat'}}>
        FEATURED ROOM IMAGE
      </Typography>
      <Box component="img" src={roomData.featuredImageFilename.includes('http') ? roomData.featuredImageURL : `https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(roomData.hotelImageDirectoryName)}/rooms/${(roomData.featuredImageFilename).replace("http:", "")}`}
        alt={roomData.featuredImageFilename} boxShadow={2}
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
          VISIBLE IMAGES &#8212; {roomData.imageFilenames.length}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} >
          {roomData.imageFilenames.map((src: string) => {
            if (src.includes('http')) {
              return <Grid item xs={12} sm={12} md={4} key={src} sx={{ '& .hide': { userSelect: 'none', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', fontWeight: 600, alignItems: 'center', '& .option': { '&:hover': { background: '#ffffff' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffffbf', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '.25rem .5rem', }, padding: '.5rem', display: 'none',  }, '&:hover': { '& .hide': { display: 'flex' }}, }}>
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
              <Grid item sx={{  background: '#f1f1f1', borderRadius: '0px 0px 8px 8px', border: '2px solid #ddd', borderTop: '0px', padding: '.25rem 0rem .25rem .5rem' }}>
                {src}
              </Grid>
            </Grid>
            }
            else {
              return <Grid item xs={12} sm={12} md={4} key={src} sx={{ '& .hide': { userSelect: 'none', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', fontWeight: 600, alignItems: 'center', '& .option': { '&:hover': { background: '#ffffff' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffffbf', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '.25rem .5rem', }, padding: '.5rem', display: 'none',  }, '&:hover': { '& .hide': { display: 'flex' }}, }}>
              <Grid sx={{ borderRadius: '8px 8px 0px 0px', minHeight: '200px', background: `url("https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(roomData.hotelImageDirectoryName)}/rooms/${src}")`, backgroundSize: 'cover', backgroundPosition: 'center center',  }}>
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
                <Grid sx={{ borderRadius: '8px 8px 0px 0px', minHeight: '200px', background: `url("https://storage.googleapis.com/romingo-production-public/images/${encodeURIComponent(roomData.hotelImageDirectoryName)}/rooms/${file.name}")`, backgroundSize: 'cover', backgroundPosition: 'center center',  }}>
                  <Grid className='hide' onClick={() => addImage(file.name)}> <AddPhotoAlternate sx={{ mr: '.5rem', fontSize: '20px' }} /> ADD </Grid>
                </Grid>
                <Grid item sx={{ borderTop: '0px', background: '#f1f1f1', borderRadius: '0px 0px 8px 8px', border: '2px solid #ddd', padding: '.25rem 0rem .25rem .5rem' }}>
                  {file.name}
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
