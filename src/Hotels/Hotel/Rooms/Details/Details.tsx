import { FC, useContext, useState } from 'react'
import { useTheme, Typography, Grid, Switch, TextField, } from '@mui/material'
import { HotelRoomContext } from '../RoomContext'

export const Details: FC = () => {
  const [roomData, setRoomData] = useContext(HotelRoomContext)
  const theme = useTheme()

  const [showConfirm, setShowConfirm] = useState(false)
  const [extraInfo, setExtraInfo] = useState('')

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

  const deleteRoom = async () => {
    const roomId = window.location.href.split('/').slice(-1)[0]
    const url = `${process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:4000'}/v2/admin/room/${roomId}?userId=${localStorage.getItem("userId")}`
    console.log(url)
    const result = await fetch(url, { method: "POST" })
    const data = await result.json()
    setExtraInfo(JSON.stringify(data))
  }

  return <Grid container sx={{ boxShadow: 3, transition: 'all .25s ease-in-out', '&:hover': { boxShadow: 5 }, display: 'flex', borderRadius: '12px', border: '1px solid #ddd', background: theme.palette.background.paper, flexDirection: { xs: 'row', sm: 'row' }, p: '1rem'}}>
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
          <Switch onClick={updateBlocked} checked={roomData.blocked ? true : false} />
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
    <Grid>
      {!showConfirm && <button onClick={() => setShowConfirm(true)}>DELETE</button>}
      {showConfirm && <button onClick={() => deleteRoom()}>Confirm?</button>}
      {extraInfo && <p>{extraInfo}</p>}
    </Grid>

  </Grid>
}