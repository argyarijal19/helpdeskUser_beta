// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import AccountEditOutline from 'mdi-material-ui/AccountEditOutline'
import AccountDetails from 'mdi-material-ui/AccountDetails'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import AccountCheckOutline from 'mdi-material-ui/AccountCheckOutline'
import AccountClockOutline from 'mdi-material-ui/AccountClockOutline'

// data 
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'



const renderStats = () => {
  const [inProgress, setInProgress] = useState(0);
  const [inQueue, setInQueue] = useState(0)
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const token = localStorage.getItem('auth')
    const decode = jwt_decode(token)
    const baseData = JSON.parse(decode.sub)
    console.log(baseData.id_user)
    const configProgress = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/all_task_byuser_ws?id_user=${baseData.id_user}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    }
    axios(configProgress).then((response) => {
      const data = response.data.data
      if (data !== null){
        setInProgress(data.length)
      }
    })
    const configQueue = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/all_task_byuser_ns?id_user=${baseData.id_user}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    }
    axios(configQueue).then((response) => {
      const data = response.data.data
      if (data !== null){
        setInQueue(data.length)
      }
    })
    const configDone = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/all_task_byuser_tsdone?id_user=${baseData.id_user}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    }
    axios(configDone).then((response) => {
      const data = response.data.data
      if (data !== null){
        setDone(data.length)
      }
    })
    setTotal(done + inProgress + inQueue)
  })
  const complainData = [
    {
      stats: inProgress,
      title: 'Dalam Proses',
      color: 'primary',
      icon: <AccountEditOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: inQueue,
      title: 'Dalam Antrian',
      color: 'error',
      icon: <AccountClockOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: done,
      color: 'success',
      title: 'Selesai',
      icon: <AccountCheckOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: total,
      color: 'info',
      title: 'Total Complain',
      icon: <AccountDetails sx={{ fontSize: '1.75rem' }} />
    }
  ]
  return complainData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = () => {
  return (
    <Card>
      <CardHeader
        title='Detail Jumlah Complian'
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Detail Jumlah Complain
            </Box>{' '}
            Keseluruhan
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
