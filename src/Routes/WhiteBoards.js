import { useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/WhiteBoards.css"
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CryptoJS from 'crypto-js';


export default function WhiteBoards(){

    const [ whiteboards, setWhiteBoards ] = useState([])

    const [open, setOpen] = useState(false);
    const [ studentEmail, setStudentEmail ] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSkip = () => {
        // const newWindow = window.open('http://localhost:4005/joinWhiteboard', '_blank');
        // newWindow.opener = null;
    }

    const handleCreate = () => {

    }

    const handleStudentEmail = (e) => {
        setStudentEmail(e.target.value)
    }

    return (
        <div className = "whiteBoards">
            <Dialog open = {open}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Student's Email
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth variant="standard" value={studentEmail} onChange={handleStudentEmail} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSkip}>Create without student's email</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>

            <Menu />
            <div>
            <h1>Whiteboards</h1>
            <button onClick={handleClickOpen}>Create New Whiteboard</button>
            {
                whiteboards.length ?
                whiteboards.map((whiteboard, index) => {
                    return <p>whiteboard</p>
                })
                :
                <h2>You do not have any whiteboards</h2>
            }
            </div>
        </div>
    )
}