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
import { Button } from '@mui/material'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const DashboardTable = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('auth')
    const decode = jwt_decode(token)
    const baseData = JSON.parse(decode.sub)
    const config = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/all_task_byuser?id_user=${parseInt(baseData.id_user)}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    axios(config)
      .then(response => {
        setData(response.data.data)
      })
      .catch(err => {
        console.log(err)
      })
    console.log(data)
  }, [])
  const rows =
    data && data.length > 0
      ? data.map(m => ({
          id_task: m.id_task,
          perihal: m.jenis_task,
          status: m.status === '0' ? 'menunggu' : 'process',
          dateInput: m.date_input,
          keluhan: m.nama_aplikasi,
          staff: m.id_user_staff && m.id_user_staff ? id_user_staff : 'Belum Ditangani',
          deadline: m.date_done && m.date_done ? m.date_done : '-'
        }))
      : [
          {
            perihal: 'tidak ada',
            status: 'none',
            dateInput: 'tidak ada',
            keluhan: 'tidak ada',
            staff: 'tidak ada',
            deadline: 'tidak ada'
          }
        ]

  const statusObj = {
    menunggu: { color: 'error' },
    none: { color: 'warning' },
    process: { color: 'success' }
  }
  console.log(data)
  const handleDelete = id_task => {
    const token = localStorage.getItem('auth')
    console.log(id_task)
    const config = {
      method: 'delete',
      url: `https://helpdesk_backend.ulbi.ac.id/delete_task/${id_task}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    axios(config)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'horeee....',
          text: response.data.message
        }).then(() => {
          router.refresh()
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>ID Complain</TableCell>
              <TableCell>Keluhan</TableCell>
              <TableCell>Perihal</TableCell>
              <TableCell>Tanggan Input</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow hover key={row.id_task} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.id_task}</TableCell>
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
                <TableCell>
                  {row.status && row.status === 'menunggu' ? (
                    <Chip
                      onClick={() => handleDelete(row.id_task)}
                      label={'hapus'}
                      color={'error'}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  ) : row.status === 'none' ? (
                    <Chip
                      label={'none'}
                      color={'success'}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  ) : (
                    <Chip
                      label={'ditangani'}
                      color={'success'}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  )}
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
