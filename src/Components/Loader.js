import CircularProgress from '@mui/material/CircularProgress';

export default function Loader({ size, color }){
    return (
        <div className='loader'>
            <CircularProgress size={size} color={color} />
        </div>
    )
}