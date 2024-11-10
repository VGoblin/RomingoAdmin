import { FC } from 'react'
import { Hotel } from './Hotel/Hotel'
import { Hotels } from './Hotels'
import { RoomWrapper } from './Hotel/Rooms/Room'
import { CreateHotel } from './Hotel/Create/Create'
import { CreateRoomWrapper } from './Hotel/Rooms/Create/Create'
import { Routes, Route } from 'react-router-dom'

export const HotelRouter: FC = () => {

  return <Routes>
    <Route index element={<Hotels />} />
    <Route path='create' element={<CreateHotel />} />
    <Route path=':id' element={<Hotel />} />
    <Route path=':id/rooms/create' element={<CreateRoomWrapper />} />
    <Route path=':id/rooms/:roomId' element={<RoomWrapper />} />
  </Routes>
}
