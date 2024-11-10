import { FC, useEffect, useState, createContext, useContext } from 'react'
import { Chip, Paper, Container, Typography, Fab, Dialog, Grid, CircularProgress, Select, FormControl, InputLabel, MenuItem, Button, TextField, Box, ButtonGroup, Tooltip } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'
import { SaveRounded, ErrorRounded, Check } from '@mui/icons-material'
import { HotelRoomContext } from './RoomContext'
import { Details } from './Details/Details'
import { Images } from './Images/Images'
import { RoomData } from '../../../tools/types'

const ROOM_QUERY = gql`
  query($id: String!) {
    adminRoom(input: { id: $id }) {
      id
      propertyId
      sabreNames
      sabreTexts
      blocked
      name
      areaInSquareFeet
      imageFilenames
      featuredImageFilename
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
  }
`

const UPDATE_ROOM =  gql`
  mutation AdminUpdateRoom(
    $id: String!,
    $propertyId: String!,
    $sabreNames: [String!]!,
    $sabreTexts: [String!]!,
    $blocked: Boolean!,
    $name: String!,
    $areaInSquareFeet: Int!,
    $featuredImageFilename: String!,
    $imageFilenames: [String!]!) {
      adminUpdateRoom(input: {
        id: $id,
        propertyId: $propertyId,
        sabreNames: $sabreNames,
        sabreTexts: $sabreTexts,
        blocked: $blocked,
        name: $name,
        areaInSquareFeet: $areaInSquareFeet,
        featuredImageFilename: $featuredImageFilename,
        imageFilenames: $imageFilenames,
      }) {
        id
      }
  }`

interface AbsorbHotelData {
  hotelData: any
}

const Room: FC<AbsorbHotelData> = ({ hotelData }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { loading, error, data } = useQuery(ROOM_QUERY, {
    fetchPolicy: 'network-only',
    variables: { id: roomId }
  })
  const [roomData, setRoomData] = useState<RoomData>()

  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [initialData, setInitialData] = useState<RoomData>()
  const [currentTab, setCurrentTab] = useState<string>(localStorage.getItem('currentTab') || 'details')
  const [saving, setSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState<any>(null)

  const handleUpdateRoom = () => {
    if (roomData !== undefined) {
      if ( (roomData.sabreName && roomData.sabreName!.length > 0) || (roomData.sabreText && roomData.sabreText!.length > 0)) {
        if ( (roomData.featuredImageFilename.length > 0) && (roomData.imageFilenames.length > 0) ) {
          if ((roomData.name.length > 0) && (roomData.areaInSquareFeet > 0) ) {
              setSaving(true)
              setTimeout(() => {
                updateRoom({ variables: {
                  id: roomId,
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
                  setSaved(true)
                  // window.location.reload()
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
  }

  useEffect(() => {
    localStorage.setItem('currentTab', currentTab)
  }, [currentTab])

  useEffect(() => {
    if (currentTab !== 'details' || 'images') {
      setCurrentTab('details')
    }
  }, [])

  useEffect(() => {
    if (data && data.adminRoom)
      setInitialData({
        name: data.adminRoom.name,
        areaInSquareFeet: data.adminRoom.areaInSquareFeet,
        featuredImageFilename: data.adminRoom.featuredImageFilename,
        imageFilenames: data.adminRoom.imageFilenames,
        sabreText: data.adminRoom.sabreTexts[0],
        sabreName: data.adminRoom.sabreNames[0],
        hotelImageDirectoryName: hotelData.adminProperty.imageDirectoryName,
        blocked: data.adminRoom.blocked
      })
  }, [data])

  useEffect(() => {
    if (initialData) {
      setRoomData(initialData)
    }
  }, [initialData])

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

  if (error) return <> error... </>

  return <HotelRoomContext.Provider value={[roomData, setRoomData]}>
    <Container>
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


      {loading && <CircularProgress sx={{ margin: '0px auto'}} />}

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
                  <Button variant={currentTab === 'rooms' ? 'contained' : 'outlined'} onClick={() => { setCurrentTab('rooms');setTimeout(() => navigate(`/hotels/${id}`), 0)}}>
                    ROOMS
                  </Button>
                </ButtonGroup>
              </Grid>

            {currentTab === 'images' && <Images />}
            {currentTab === 'details' && <Details />}

            </Grid>

          </Grid>
        }

      <Fab disabled={ initialData == roomData } onClick={handleUpdateRoom} color='primary' sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}> <SaveRounded /> </Fab>

      </Grid>
    </Container>
  </HotelRoomContext.Provider>
}


export const RoomWrapper = () => {
  const route = useParams()
  const { id } = route
  const { loading, error, data } = useQuery(HOTEL_QUERY, {
    variables: { id: id }
  })

  if (data) return <Room hotelData={data} />
  else return <></>
}