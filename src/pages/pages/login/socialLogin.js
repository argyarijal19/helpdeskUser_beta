// import dynamic from 'next/dynamic';
import { LoginSocialGoogle } from 'reactjs-social-login'
import Button from '@mui/material/Button'

const ButtonLogin = () => {
    const clientId = '671214379595-kckkb751edf08ij8b0kv92gfqm2ji02h.apps.googleusercontent.com'
    const onSuccess = (response) => console.log(response);
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
              Login
            </Button>
        </LoginSocialGoogle>
    )
}

export default ButtonLogin