// import dynamic from 'next/dynamic';
import { LoginSocialGoogle } from 'reactjs-social-login'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const ButtonLogin = () => {
  const router = useRouter()
    const clientId = '671214379595-kckkb751edf08ij8b0kv92gfqm2ji02h.apps.googleusercontent.com'
    const onSuccess = (response) => {
      console.log(response.data.email)
      var data = {
        "email": response.data.email
      };
      const config = {
        method: 'post',
        url: 'https://helpdesk_backend.ulbi.ac.id/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      }
      axios(config).then((response) => {
        console.log(response)
        const status = response.data.status
        const token = response.data.token
        if(status === 1){
          localStorage.setItem('auth', token)
          router.push('/dashboard')
        }else{
          const message = response.data.message
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    // const onFailure = (response) => console.log(response);
    return (
        <LoginSocialGoogle 
        client_id={clientId}
        scope='openid profile email'
        discoveryDocs='claims_supported'
        access_type='offline'
        onResolve={onSuccess}
        onReject={(err) => {
          console.log(err);
        }}
            >
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
            >
              Login With Google Account
            </Button>
        </LoginSocialGoogle>
    )
}

export default ButtonLogin