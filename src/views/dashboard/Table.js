// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import axios from 'axios'
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'




const DashboardTable = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('auth')
    const decode = jwt_decode(token)
    const baseData = JSON.parse(decode.sub)
    const config = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/all_task_byuser?id_user=${baseData.id_user}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    }
    axios(config).then((response) => {
      setData(response.data.data)
    }).catch((err) => {
      console.log(err)
    })
  },[])
  const rows = [
    data && data.length > 0 ? data.map((m) => (
      {
        perihal: 27,
        status: 'current',
        dateInput: '09/27/2018',
        keluhan: 'Sally Quinn',
        staff: '$19586.23',
        deadline: 'eebsworth2m@sbwire.com',
      }
    )):
    {
      perihal: 'tidak ada',
      status: 'none',
      dateInput: 'tidak ada',
      keluhan: 'tidak ada',
      staff: 'tidak ada',
      deadline: 'tidak ada',
    }
  ]
  
  const statusObj = {
    menunggu: { color: 'error' },
    none: { color: 'warning' },
    process: { color: 'success' }
  }
  console.log(rows)
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Keluhan</TableCell>
              <TableCell>Perihal</TableCell>
              <TableCell>Tanggan Input</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow hover key={row.keluhan} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.keluhan}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.perihal}</TableCell>
                <TableCell>{row.dateInput}</TableCell>
                <TableCell>{row.staff}</TableCell>
                <TableCell>{row.deadline}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable
