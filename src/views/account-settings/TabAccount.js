// ** React Imports
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TabList from '@mui/lab/TabList'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MuiTab from '@mui/material/Tab'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Swal from 'sweetalert2'

import InputAdornment from '@mui/material/InputAdornment'
// import Tiptap from '../../@core/layouts/components/Tiptap'
import dynamic from 'next/dynamic'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import axios from 'axios'
import { Card } from '@mui/material'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [perihal, setPerihal] = useState([])
  const [counter, setCounter] = useState(1)
  const [department, setDepartment] = useState([])
  const [idDepartment, setIdDepartment] = useState(0)
  const [idPerihal, setIdPerihal] = useState(0)
  const [jenisComplain, setJenisComplain] = useState([])
  const [idJenisComplain, setIdJenisComplain] = useState(0)
  const [namaLengkap, setNamaLengkap] = useState('')
  const [jabatan, setjabatan] = useState('')
  const [idUser, setIdUser] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [priority, setPriority] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('auth')
    if (!token) {
      const router = useRouter()
      router.push('/401')
    } else {
      const decode = jwt_decode(token)
      const baseData = JSON.parse(decode.sub)
      setNamaLengkap(baseData.nama_lengkap)
      setIdUser(baseData.id_user)
      const config = {
        method: 'get',
        url: 'https://helpdesk_backend.ulbi.ac.id/get_department',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
      axios(config).then(response => {
        setDepartment(response.data.data)
      })
      var configJabatan = {
        method: 'get',
        url: `https://helpdesk_backend.ulbi.ac.id/id_jabatan/${baseData.id_jabatan}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      axios(configJabatan)
        .then(function (response) {
          setjabatan(response.data.data[0].nama_jabatan)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [])

  const handleFirstChange = event => {
    const value = event.target.value
    setIdDepartment(value)

    const configPerihal = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/get_apps_base?id_department=${value}`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    axios(configPerihal)
      .then(response => {
        setPerihal(response.data.data)
      })
      .catch(err => {
        console.log(err)
      })
    setPerihal('')
  }

  const handleSecondChange = event => {
    const value = event.target.value
    setIdPerihal(value)
    console.log(value)
    const configjenisTask = {
      method: 'get',
      url: `https://helpdesk_backend.ulbi.ac.id/jt_byapp?id_aplikasi=${value}`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    axios(configjenisTask)
      .then(response => {
        setJenisComplain(response.data.data)
      })
      .catch(err => {
        console.log(err)
      })
    setJenisComplain('')
  }
  const onChange = file => {
    const fileUpload = file.target.files[0]
    setFile(fileUpload)
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      console.log(fileUpload)
      reader.readAsDataURL(fileUpload)
    }
  }
  const handleAdd = () => {
    setCounter(counter + 1)
    console.log(counter)
  }

  const Tab = styled(MuiTab)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 67
    }
  }))

  const TabName = styled('span')(({ theme }) => ({
    lineHeight: 1.71,
    fontSize: '0.875rem',
    marginLeft: theme.spacing(2.4),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }))

  const handleSave = e => {
    e.preventDefault()
    const token = localStorage.getItem('auth')
    const decode = jwt_decode(token)
    const baseData = JSON.parse(decode.sub)
    console.log(keterangan)
    // simpan content ke database atau kirim ke server
    if (keterangan === '' || idDepartment == 0 || idJenisComplain === 0 || idPerihal === 0 || priority === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Form Masih ada yang kosong'
      })
    }
    const formData = new FormData()
    formData.append('file', file)
    const configFile = {
      method: 'post',
      url: 'https://helpdesk_backend.ulbi.ac.id/post_task_attachment',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }
    axios(configFile)
      .then(response => {
        console.log(response.data)
        setFileName(response.data)
      })
      .catch(err => {
        console.log(err)
      })
    var data = {
      id_user_comp: baseData.id_user,
      id_aplikasi: idPerihal,
      id_jabatan: baseData.id_jabatan,
      id_jenis_task: idJenisComplain,
      id_department: idDepartment,
      priority: priority,
      keterangan: keterangan,
      attachment: fileName
    }
    console.log(imgSrc)

    var config = {
      method: 'post',
      url: 'https://helpdesk_backend.ulbi.ac.id/post_task',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios(config)
      .then(function (response) {
        const cek = response.data.status
        if (cek === 1) {
          Swal.fire({
            icon: 'success',
            title: 'okeey...',
            text: response.data.message
          })
        } else {
          console.log(response)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <InputLabel>NAMA JABATAN</InputLabel>
            <TextField fullWidth label={jabatan} defaultValue={jabatan} disabled inputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>NAMA LENGKAP</InputLabel>
            <TextField
              fullWidth
              label={namaLengkap}
              disabled
              InputProps={{ readOnly: true }}
              defaultValue={namaLengkap}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>PRIORITAS</InputLabel>
            <FormControl fullWidth>
              <Select label='Department' defaultValue='' required onChange={e => setPriority(e.target.value)}>
                <MenuItem value={2}>Low</MenuItem>
                <MenuItem value={4}>Medium</MenuItem>
                <MenuItem value={6}>High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>DEPARTMENT</InputLabel>
            <FormControl fullWidth>
              <Select label='Department' defaultValue='' required onChange={handleFirstChange}>
                {department && department.length > 0
                  ? department.map(d => <MenuItem value={d.id_department}>{d.nama_department.toUpperCase()}</MenuItem>)
                  : 'None'}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>KELUHAN</InputLabel>
            <FormControl fullWidth>
              <Select defaultValue='active' required onChange={handleSecondChange}>
                {perihal && perihal.length > 0 ? (
                  perihal.map(p => <MenuItem value={p.id_aplikasi}>{p.nama_aplikasi}</MenuItem>)
                ) : (
                  <MenuItem value=''>Pilih Department</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>PERIHAL</InputLabel>
            <FormControl fullWidth>
              <Select label='Keluhan' required defaultValue='active' onChange={e => setIdJenisComplain(e.target.value)}>
                {jenisComplain && jenisComplain.length > 0 ? (
                  jenisComplain.map(jc => <MenuItem value={jc.id_jenis_task}>{jc.jenis_task}</MenuItem>)
                ) : (
                  <MenuItem value=''>Pilih Keluhan</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>DETAIL COMPLAIN</InputLabel>
            <TextField
              fullWidth
              multiline
              required
              minRows={3}
              placeholder='Silahkan tulis detail complain seperti : npm, nidn, nama grup kelas dan lain lain...'
              sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
              onChange={e => setKeterangan(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <MessageOutline />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <TabList
              aria-label='account-settings tabs'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
              <Tab
                value='account'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TabName>Upload Attachment</TabName>
                  </Box>
                }
              />
            </TabList>
            {Array.from(Array(counter)).map((c, index) => {
              return (
                <Box p={5} key={c} sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt='Profile Pic' />
                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload Attachment
                      <input
                        hidden
                        type='file'
                        onChange={onChange}
                        accept='image/png, image/jpeg'
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => setImgSrc('/images/avatars/1.png')}
                    >
                      Reset
                    </ResetButtonStyled>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Allowed PNG or JPEG. Max size of 800K.
                    </Typography>
                  </Box>
                  <ResetButtonStyled color='primary' variant='outlined' onClick={() => setCounter(counter - 1)}>
                    -
                  </ResetButtonStyled>
                </Box>
              )
            })}
            <ResetButtonStyled color='primary' variant='outlined' onClick={handleAdd}>
              +
            </ResetButtonStyled>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSave}>
              Submit
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
