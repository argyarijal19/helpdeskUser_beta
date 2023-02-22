// ** MUI Imports
import Card from '@mui/material/Card'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

//data
// data 
import axios from 'axios'
// import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = () => {
  const [topRate, setToprate] = useState(0)
  const [bestStaff, setBestStaff] = useState('Tidak Ada')
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'
  useEffect(() => {
    const token = localStorage.getItem('auth')
    const config = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/get_top_rate`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    }
    axios(config).then((response) => {
      const data = response.data.data
      console.log(data)
      if (data !== null){
        setToprate(data[0].rating)
        setBestStaff(data[0].nama_lengkap)
      }
    })
  },[])

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Congratulations {bestStaff}! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Best Staff of the month
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          Total Rating
        </Typography>
        <Button size='small' variant='outlined'>
          <Rating defaultValue={topRate} precision={0.5} readOnly />
          <Box sx={{ ml: 2 }}>{topRate}</Box>
        </Button>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default Trophy
