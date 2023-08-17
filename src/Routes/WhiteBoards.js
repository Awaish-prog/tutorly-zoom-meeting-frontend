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
import Loader from "../Components/Loader"
import { createBitpaper, createWhiteboardData, deleteBitpaper, deleteWhiteboard, getBoardsList } from "../apiCalls/apiCalls";
import CircularProgress from '@mui/material/CircularProgress';
import { MdDelete } from "react-icons/md"


export default function WhiteBoards({ notify, updateNotification }){

    const [ whiteboards, setWhiteBoards ] = useState([])
    const address = 'https://app.tutorly.com/joinWhiteboard/'
    const [open, setOpen] = useState(false);
    const [ studentEmail, setStudentEmail ] = useState("")
    const [ paperName, setPaperName ] = useState("")
    const [ message, setMessage ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")
    const [ loader, setLoader ] = useState(true)
    const [ formLoader, setFormLoader ] = useState(false)
    const [ deleteOpen, setDeleteOpen ] = useState(false)
    const [ deleteIndex, setDeleteIndex ] = useState(-1)
    const [ paperType, setPaperType ] = useState("paper")
    
    const handleClickOpen = (type = 'paper') => {
        setOpen(true);
        setPaperType(type)
        const tutorEmail = localStorage.getItem('email') 
        const tutorName = tutorEmail.slice(0, tutorEmail.indexOf('@'))
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")
        setPaperName(tutorName + " " + dateString)
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(false)
        setErrorMessage("")
    };

    function handleDelete(index){
        setDeleteIndex(index)
        setDeleteOpen(true)
    }

    function closeDeletePaper(){
        setDeleteOpen(false)
    }

    const handleSkip = async () => {
        if(!paperName){
            return
        }
        setMessage(false)

        setFormLoader(true)

        const email = localStorage.getItem('email')
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")

        const encryptedKey = CryptoJS.AES.encrypt(dateString + '!' + email, secretKey).toString()

        const paperLink = address + encryptedKey

        const response = paperType === 'bitpaper' ? await createBitpaper(paperName, email, studentEmail, dateString) : await createWhiteboardData(paperName, paperLink, email, studentEmail, dateString, "")

        setFormLoader(false)
        
        if(response.status && response.status === 200){
            const newWindow = window.open(paperType === 'bitpaper' ? response.data.urls.admin : paperLink, '_blank');
            
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
        setFormLoader(true)

        const email = localStorage.getItem('email')
        const date = new Date()
        const dateString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")

        const encryptedKey = CryptoJS.AES.encrypt(dateString + '!' + email + studentEmail, secretKey).toString()

        const paperLink = address + encryptedKey

        const response = paperType === 'bitpaper' ? await createBitpaper(paperName, email, studentEmail, dateString) : await createWhiteboardData(paperName, paperLink, email, studentEmail, dateString, "")

        setFormLoader(false)
        
        if(response.status && response.status === 200){
            const newWindow = window.open(paperType === 'bitpaper' ? response.data.urls.admin : paperLink, '_blank');
            
            newWindow.opener = null;
            setOpen(false)
        }
        else{
            setErrorMessage("Page wasn't created because of an unexpected error")
        }
        
        setPaperType('paper')
    }

    const handleStudentEmail = (e) => {
        setStudentEmail(e.target.value)
    }

    const handlePaper = (e) => {
        setPaperName(e.target.value)
    }

    async function getBoardsListAsync(){
        const boardsData = await getBoardsList()
        boardsData.status && boardsData.status === 200 && setWhiteBoards(boardsData.boardsList.reverse())
        setLoader(false)
    }

    async function deletePaperApiCall(){
        if(deleteIndex >= 0 && whiteboards[deleteIndex] && whiteboards[deleteIndex][1]){
            setDeleteOpen(false)
            console.log(whiteboards[deleteIndex][1]);
            if(whiteboards[deleteIndex][1].includes(" ")){
                deleteBitpaper(whiteboards[deleteIndex][1].slice(0, whiteboards[deleteIndex][1].indexOf(" ")))
            }
            deleteWhiteboard(whiteboards[deleteIndex][1])
            setWhiteBoards((prev) => {
                const newBoards = [...prev]
                newBoards.splice(deleteIndex, 1)
                return newBoards
            })
        }
        setDeleteOpen(false)
    }

    useEffect(() => {
        getBoardsListAsync()
    }, [])

    return (
        <div className = "whiteBoards">
            <Dialog open = {open}>
                {
                    errorMessage ? 
                    <>
                    <DialogTitle>{errorMessage}</DialogTitle>
                    <Button onClick={handleClose}>Cancel</Button>
                    </>
                    :
                    <>
                    <DialogTitle>Create New Paper</DialogTitle>
                    {
                        formLoader ?
                        <div className = "loaderMargin">
                        <CircularProgress />
                        </div>
                        :
                        <DialogContent>
                        <DialogContentText style= { (message || !paperName) ? {color: 'red'} : {}}>
                        {paperName ? "Enter Student's Email" : 'Please enter paper name'} 
                        </DialogContentText>
                        <TextField margin="dense" id="name" label="Paper Name" type="text" fullWidth variant="standard" value={paperName} onChange={handlePaper} />

                        <TextField autoFocus margin="dense" id="name" label="Student's email Address" type="email" fullWidth variant="standard" value={studentEmail} onChange={handleStudentEmail} />
                        </DialogContent>
                    }
                    
                    <DialogActions>
                    <Button onClick={handleSkip}>Create without student's email</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                    </DialogActions>
                    </>
                }
                
            </Dialog>

            <Dialog open={deleteOpen}>
                <DialogTitle>Delete this paper?</DialogTitle>
                <Button onClick={deletePaperApiCall}>Yes</Button>
                <Button onClick={closeDeletePaper}>No</Button>
            </Dialog>

            
            <Menu notify = {notify} updateNotification = {updateNotification} />
            <div className="whiteboardDiv">
            <h1>Whiteboards</h1>
            <div className="newBoardButtonContainer">
            {localStorage.getItem('role') === "tutor" && <button className="newBoardButton" onClick={() => handleClickOpen('bitpaper')}>Create Bit paper</button>}
            {/* {localStorage.getItem('role') === "tutor" && <button className="newBoardButton" onClick={handleClickOpen}>Create New Whiteboard</button>} */}
            </div>
            {
                loader ?
                <div className ="loaderDiv">
                <Loader size={100} />
                </div>
                :
                <div className = "boardsList">
                {
                    whiteboards.length ?
                    whiteboards.map((whiteboard, index) => {
                        return <div key={index} className="paperDiv">
                        <a href={whiteboard[1].includes(" ") ? localStorage.getItem('role') !== "tutor" ? whiteboard[1].slice(whiteboard[1].indexOf(" ") + 1, whiteboard[1].lastIndexOf(" ")) : whiteboard[1].slice(whiteboard[1].lastIndexOf(" ") + 1) : whiteboard[1]} className="paper-link" target="_blank" >{whiteboard[0]}</a>
                        {localStorage.getItem('role') === 'tutor' && <div onClick = {() => {handleDelete(index)}}>
                            <MdDelete />
                        </div>}
                        </div>
                    })
                    :
                    <h2>You do not have any whiteboards</h2>
                }
                </div>
            }
            
            </div>
        </div>
    )
}