// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import jwt_decode from 'jwt-decode'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import axios from 'axios'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const [namaLengkap, setNamaLengkap] = useState('')
  const [profile, setProfile] = useState('')
  const [jabatan, setjabatan] = useState('')
  useEffect(() => {
    const token = localStorage.getItem('auth')
    if(!token){
      const router = useRouter()
      router.push('/401')
    }
    const decode = jwt_decode(token)
    const baseData = JSON.parse(decode.sub)
    console.log(baseData)
    setNamaLengkap(baseData.nama_lengkap)
    setProfile(localStorage.getItem('picture'))
    var config = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/id_jabatan/${baseData.id_jabatan}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    };
    axios(config)
    .then(function (response) {
      setjabatan(response.data.data[0].nama_jabatan);
    })
    .catch(function (error) {
      console.log(error);
    });
  },[])
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      localStorage.removeItem('auth')
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={profile}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src={profile} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{namaLengkap}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {jabatan}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose('/pages/login')}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
