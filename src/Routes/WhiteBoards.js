import { useEffect, useState } from "react";
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
import { secretKey } from "../Secret";
import { createWhiteboardData } from "../apiCalls/apiCalls";


export default function WhiteBoards(){

    const [ whiteboards, setWhiteBoards ] = useState([])
    const address = 'http://localhost:3001/joinWhiteboard/'
    const [open, setOpen] = useState(false);
    const [ studentEmail, setStudentEmail ] = useState("")
    const [ paperName, setPaperName ] = useState("")
    const [ message, setMessage ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
        const tutorEmail = localStorage.getItem('email') 
        const tutorName = tutorEmail.slice(0, tutorEmail.indexOf('@'))
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")
        setPaperName(tutorName + " " + dateString)
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(false)
    };

    const handleSkip = async () => {
        if(!paperName){
            return
        }
        setMessage(false)

        const email = localStorage.getItem('email')
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")

        const encryptedKey = CryptoJS.AES.encrypt(dateString + '!' + email, secretKey).toString()

        const paperLink = address + encryptedKey

        const response = await createWhiteboardData(paperName, paperLink, email, studentEmail, dateString, "")

        if(response.status && response.status === 200){
            const newWindow = window.open(paperLink, '_blank');
            newWindow.opener = null;
            setOpen(false)
        }
        else{
            setErrorMessage("Page wasn't created because of an unexpected error")
        }

    }

    const handleCreate = async () => {
        if(!studentEmail || !paperName){
            setMessage(true)
            return
        }
        setMessage(false)

        const email = localStorage.getItem('email')
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")

        const encryptedKey = CryptoJS.AES.encrypt(dateString + '!' + email + studentEmail, secretKey).toString()

        const paperLink = address + encryptedKey

        const response = await createWhiteboardData(paperName, paperLink, email, studentEmail, dateString, "")

        if(response.status && response.status === 200){
            const newWindow = window.open(paperLink, '_blank');
            newWindow.opener = null;
            setOpen(false)
        }
        else{
            setErrorMessage("Page wasn't created because of an unexpected error")
        }
    }

    const handleStudentEmail = (e) => {
        setStudentEmail(e.target.value)
    }

    const handlePaper = (e) => {
        setPaperName(e.target.value)
    }

    useEffect(() => {
        console.log(window.location.href);
    }, [])

    return (
        <div className = "whiteBoards">
            <Dialog open = {open}>
                {
                    errorMessage ? 
                    <DialogTitle>{errorMessage}</DialogTitle>
                    :
                    <>
                    <DialogTitle>Create New Paper</DialogTitle>
                    <DialogContent>
                    <DialogContentText style= { (message || !paperName) ? {color: 'red'} : {}}>
                        {paperName ? "Enter Student's Email" : 'Please enter paper name'} 
                    </DialogContentText>
                    <TextField margin="dense" id="name" label="Paper Name" type="text" fullWidth variant="standard" value={paperName} onChange={handlePaper} />

                    <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth variant="standard" value={studentEmail} onChange={handleStudentEmail} />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleSkip}>Create without student's email</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                    </DialogActions>
                    </>
                }
                
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