import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({

    loginWrap: {
        width: '430px',
        height: 'auto',
        position: 'relative',
        zIndex: 1,

        '&::before': {
            content: '""',
            height: '200px',
            width: '200px',
            position: 'absolute',
            borderRadius: '50%',
            background: 'linear-gradient(#1845ad, #23a2f6)',
            left: '-100px',
            top: '-100px',
        },
        '&:after': {
            content: '""',
            height: '200px',
            width: '200px',
            position: 'absolute',
            borderRadius: '50%',
            background: 'linear-gradient(to right, #ff512f, #f09819)',
            right: '-100px',
            bottom: '-100px',
            zIndex: -1,
        }
    },

    loading: {
        margin: '50px auto'
    },

    form: {
        height: 'auto',
        width: 'auto',
        backgroundColor: 'rgba(248, 244, 241, 0.13)',
        // position: 'absolute',
        // transform: 'translate(-50%,-50%)',
        // top: '50%',
        // left: '50%',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 40px rgba(8,7,16,0.6)',
        padding: '50px 35px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: '999',
        '& *': {
            color: '#1845ad',
            letterSpacing: '0.5px',
            outline: 'none',
            border: 'none',
        },

        '& h3': {
            fontSize: '32px',
            fontWeight: 500,
            lineHeight: '42px',
            textAlign: 'center',
            margin: '0 auto',
        },

        '& p': {
          fontSize: '14px',
            textAlign: 'center',
            color: 'black',
        },

        '& label': {
            display: 'block',
            marginTop: '30px',
            fontSize: '16px',
            fontWeight: 500,
        },

        '& input': {
            // display: 'flex',
            // height: '50px',
            // width: 'auto',
            // backgroundColor: 'rgba(255,255,255,0.07)',
            // borderRadius: '3px',
            // padding: '0 10px',
            // marginTop: '8px',
            // fontSize: '14px',
            // fontWeight: 300,
            // maxWidth: '100%',
        },

        '& input::placeholder': {
            // color: 'red',
        },

        '& button': {
            marginTop: '30px',
            // width: '100%',
            backgroundColor: '#1845ad',
            color: '#FFF',
            // padding: '15px 0',
            // fontSize: '18px',
            // fontWeight: 600,
            // borderRadius: '5px',
            // cursor: 'pointer',
        },

        /* social block converted to JSS */
        '& .social': {
            marginTop: '30px',
            display: 'flex',
        },

        '& .social div': {
            width: '150px',
            borderRadius: '3px',
            padding: '5px 10px 10px 5px',
            border: '1px solid #1845ad',
            backgroundColor: 'transparent',
            color: '#1845ad',
            textAlign: 'center',
            cursor: 'pointer',
        },

        '& .social div:hover': {
            backgroundColor: 'rgba(255,255,255,0.47)',
        },

        '& .social .fb': {
            marginLeft: '25px',
        },

        '& .social i': {
            marginRight: '4px',
        },
    },
}));

export default useStyles;
